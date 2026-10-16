import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  parseRawStateVector,
  fetchLiveAircraftFromOpenSky,
  OpenSkyRateLimitError,
  OpenSkyApiError,
  fetchDemoAircraftSnapshot,
} from '../services/openskyApi';
import { RawStateVector } from '../types/opensky';
import { BoundingBox } from '../types/geo';

describe('openskyApi service', () => {
  describe('parseRawStateVector', () => {
    const validRawVector: RawStateVector = [
      '40061e',        // 0: icao24
      'BAW456  ',      // 1: callsign with whitespace
      'United Kingdom',// 2: origin_country
      1718000000,      // 3: time_position
      1718000000,      // 4: last_contact
      -0.4543,         // 5: longitude
      51.4700,         // 6: latitude
      3048.0,          // 7: baro_altitude (10,000 ft = 3048 m)
      false,           // 8: on_ground
      200.0,           // 9: velocity m/s (~389 kts)
      270.0,           // 10: true_track
      5.0,             // 11: vertical_rate m/s (+984 fpm)
      null,            // 12: sensors
      3100.0,          // 13: geo_altitude
      '1000',          // 14: squawk
      false,           // 15: spi
      0,               // 16: position_source (0 = ADS-B)
    ];

    it('parses valid airborne aircraft state vector correctly', () => {
      const nowEpochMs = 1718000010 * 1000;
      const ac = parseRawStateVector(validRawVector, nowEpochMs);

      expect(ac).not.toBeNull();
      expect(ac?.icao24).toBe('40061e');
      expect(ac?.callsign).toBe('BAW456'); // whitespace trimmed
      expect(ac?.originCountry).toBe('United Kingdom');
      expect(ac?.latitude).toBe(51.4700);
      expect(ac?.longitude).toBe(-0.4543);
      expect(ac?.hasValidPosition).toBe(true);
      expect(ac?.baroAltitudeMeters).toBe(3048.0);
      expect(ac?.baroAltitudeFeet).toBe(10000);
      expect(ac?.onGround).toBe(false);
      expect(ac?.velocityKnots).toBe(389);
      expect(ac?.heading).toBe(270);
      expect(ac?.headingCardinal).toBe('W');
      expect(ac?.verticalState).toBe('CLIMBING');
      expect(ac?.verticalRateFpm).toBe(984);
      expect(ac?.squawk).toBe('1000');
      expect(ac?.positionSource).toBe('ADS-B');
    });

    it('handles null and missing fields gracefully without throwing', () => {
      const sparseVector: RawStateVector = [
        '3c6665',
        null, // null callsign
        'Germany',
        null, // null time_position
        1718000000,
        null, // null longitude
        null, // null latitude
        null, // null altitude
        true, // on ground
        null, // null velocity
        null, // null heading
        null, // null vertical rate
        null,
        null,
        null, // null squawk
        false,
        2, // MLAT
      ];

      const ac = parseRawStateVector(sparseVector, 1718000010 * 1000);

      expect(ac).not.toBeNull();
      expect(ac?.icao24).toBe('3c6665');
      expect(ac?.callsign).toBe('3C6665'); // Falls back to uppercase ICAO
      expect(ac?.latitude).toBeNull();
      expect(ac?.longitude).toBeNull();
      expect(ac?.hasValidPosition).toBe(false);
      expect(ac?.baroAltitudeFeet).toBeNull();
      expect(ac?.velocityKnots).toBeNull();
      expect(ac?.heading).toBeNull();
      expect(ac?.headingCardinal).toBe('---');
      expect(ac?.verticalState).toBe('LEVEL');
      expect(ac?.squawk).toBeNull();
      expect(ac?.positionSource).toBe('MLAT');
      expect(ac?.onGround).toBe(true);
    });

    it('identifies stale observations when elapsed time exceeds 60s', () => {
      const oldTime = 1718000000;
      const futureNowEpochMs = (oldTime + 120) * 1000; // 120s later
      const ac = parseRawStateVector(validRawVector, futureNowEpochMs);

      expect(ac?.isStale).toBe(true);
    });

    it('rejects invalid inputs', () => {
      expect(parseRawStateVector([] as unknown as RawStateVector)).toBeNull();
      expect(parseRawStateVector(null as unknown as RawStateVector)).toBeNull();
    });
  });

  describe('fetchLiveAircraftFromOpenSky', () => {
    const validBounds: BoundingBox = {
      lamin: 50.8,
      lomin: -1.2,
      lamax: 52.2,
      lomax: 0.8,
    };

    beforeEach(() => {
      vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('successfully retrieves and parses aircraft from OpenSky API', async () => {
      const mockResponse = {
        time: 1718000050,
        states: [
          [
            '40061e',
            'BAW123  ',
            'United Kingdom',
            1718000050,
            1718000050,
            -0.12,
            51.50,
            2000,
            false,
            150,
            90,
            0,
            null,
            2000,
            '1000',
            false,
            0,
          ],
        ],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response);

      const result = await fetchLiveAircraftFromOpenSky(validBounds);

      expect(result.time).toBe(1718000050);
      expect(result.aircraft).toHaveLength(1);
      expect(result.aircraft[0].callsign).toBe('BAW123');
      expect(result.aircraft[0].icao24).toBe('40061e');
    });

    it('throws OpenSkyRateLimitError with retrySec on HTTP 429', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: {
          get: (name: string) => (name.toLowerCase() === 'retry-after' ? '45' : null),
        },
      } as unknown as Response);

      await expect(fetchLiveAircraftFromOpenSky(validBounds)).rejects.toThrow(
        OpenSkyRateLimitError
      );
    });

    it('throws OpenSkyApiError on non-200 HTTP responses', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
      } as unknown as Response);

      await expect(fetchLiveAircraftFromOpenSky(validBounds)).rejects.toThrow(
        OpenSkyApiError
      );
    });
  });

  describe('fetchDemoAircraftSnapshot', () => {
    it('returns valid simulation snapshots for offline testing', () => {
      const snapshot = fetchDemoAircraftSnapshot();
      expect(snapshot.aircraft.length).toBeGreaterThan(0);
      const first = snapshot.aircraft[0];
      expect(first.callsign).toBeDefined();
      expect(first.hasValidPosition).toBe(true);
    });
  });
});
