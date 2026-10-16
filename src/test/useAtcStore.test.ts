import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAtcStore } from '../store/useAtcStore';
import * as openskyService from '../services/openskyApi';
import { Aircraft } from '../types/opensky';
import { DEFAULT_REGION } from '../constants/regions';

describe('useAtcStore State & Lifecycle', () => {
  beforeEach(() => {
    useAtcStore.setState({
      aircraftMap: {},
      historyMap: {},
      selectedIcao24: null,
      currentRegion: DEFAULT_REGION,
      activeBounds: { ...DEFAULT_REGION.bounds },
      apiStatus: {
        source: 'LIVE',
        status: 'IDLE',
        freshness: 'FRESH',
        lastSuccessfulFetch: null,
        lastAttempt: null,
        lastError: null,
        rateLimitBackoffUntil: null,
        consecutiveFailures: 0,
        snapshotServerTime: null,
        requestDurationMs: null,
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('preserves aircraft identity and accumulates observations across updates', async () => {
    const mockAircraft1: Aircraft = {
      icao24: '40061e',
      callsign: 'BAW456',
      originCountry: 'United Kingdom',
      latitude: 51.47,
      longitude: -0.45,
      baroAltitudeMeters: 3000,
      baroAltitudeFeet: 9842,
      geoAltitudeMeters: 3000,
      geoAltitudeFeet: 9842,
      velocityMps: 200,
      velocityKnots: 389,
      heading: 270,
      headingCardinal: 'W',
      verticalRateMps: 0,
      verticalRateFpm: 0,
      verticalState: 'LEVEL',
      onGround: false,
      timePosition: 1718000000,
      lastContact: 1718000000,
      squawk: '1000',
      spi: false,
      positionSource: 'ADS-B',
      hasValidPosition: true,
      firstSeenAt: 1000,
      lastSeenAt: 1000,
      observationCount: 1,
      isStale: false,
    };

    // First fetch
    vi.spyOn(openskyService, 'fetchLiveAircraftFromOpenSky').mockResolvedValueOnce({
      time: 1718000000,
      aircraft: [{ ...mockAircraft1 }],
    });

    await useAtcStore.getState().fetchAircraftSnapshot(true);

    let state = useAtcStore.getState();
    expect(state.aircraftMap['40061e']).toBeDefined();
    expect(state.aircraftMap['40061e'].observationCount).toBe(1);
    expect(state.historyMap['40061e']).toHaveLength(1);

    // Second fetch with updated position
    const mockAircraft2: Aircraft = {
      ...mockAircraft1,
      latitude: 51.48, // aircraft moved
      longitude: -0.47,
      lastSeenAt: 2000,
    };

    vi.spyOn(openskyService, 'fetchLiveAircraftFromOpenSky').mockResolvedValueOnce({
      time: 1718000010,
      aircraft: [mockAircraft2],
    });

    await useAtcStore.getState().fetchAircraftSnapshot(true);

    state = useAtcStore.getState();
    const updated = state.aircraftMap['40061e'];
    expect(updated).toBeDefined();
    // Identity preserved: firstSeenAt is preserved, observationCount incremented
    expect(updated.firstSeenAt).toBe(1000);
    expect(updated.observationCount).toBe(2);
    // History trail accumulated
    expect(state.historyMap['40061e']).toHaveLength(2);
    expect(state.historyMap['40061e'][1].latitude).toBe(51.48);
  });

  it('preserves existing data and flags STALE status when fetch fails', async () => {
    // Populate store with initial aircraft
    useAtcStore.setState({
      aircraftMap: {
        '40061e': {
          icao24: '40061e',
          callsign: 'BAW456',
          originCountry: 'United Kingdom',
          latitude: 51.47,
          longitude: -0.45,
          baroAltitudeMeters: 3000,
          baroAltitudeFeet: 9842,
          geoAltitudeMeters: 3000,
          geoAltitudeFeet: 9842,
          velocityMps: 200,
          velocityKnots: 389,
          heading: 270,
          headingCardinal: 'W',
          verticalRateMps: 0,
          verticalRateFpm: 0,
          verticalState: 'LEVEL',
          onGround: false,
          timePosition: 1718000000,
          lastContact: 1718000000,
          squawk: '1000',
          spi: false,
          positionSource: 'ADS-B',
          hasValidPosition: true,
          firstSeenAt: 1000,
          lastSeenAt: 1000,
          observationCount: 1,
          isStale: false,
        },
      },
    });

    // Simulate network error
    vi.spyOn(openskyService, 'fetchLiveAircraftFromOpenSky').mockRejectedValueOnce(
      new Error('Connection timed out')
    );

    await useAtcStore.getState().fetchAircraftSnapshot(true);

    const state = useAtcStore.getState();
    // Aircraft map must NOT be wiped!
    expect(Object.keys(state.aircraftMap)).toHaveLength(1);
    expect(state.aircraftMap['40061e']).toBeDefined();
    // Must be marked STALE with error details
    expect(state.apiStatus.freshness).toBe('STALE');
    expect(state.apiStatus.status).toBe('ERROR');
    expect(state.apiStatus.lastError).toContain('Connection timed out');
    expect(state.apiStatus.consecutiveFailures).toBe(1);
  });

  it('enforces rate limit backoff and suppresses requests until backoff expires', async () => {
    const rateLimitError = new openskyService.OpenSkyRateLimitError(
      'Rate limit exceeded',
      60
    );

    vi.spyOn(openskyService, 'fetchLiveAircraftFromOpenSky').mockRejectedValueOnce(
      rateLimitError
    );

    await useAtcStore.getState().fetchAircraftSnapshot(true);

    const state = useAtcStore.getState();
    expect(state.apiStatus.status).toBe('RATE_LIMITED');
    expect(state.apiStatus.rateLimitBackoffUntil).toBeGreaterThan(Date.now());

    // Subsequent normal fetch should be blocked by active backoff
    const fetchSpy = vi.spyOn(openskyService, 'fetchLiveAircraftFromOpenSky');
    await useAtcStore.getState().fetchAircraftSnapshot(false);

    // Fetch was NOT called because backoff is active
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
