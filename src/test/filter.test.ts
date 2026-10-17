import { describe, it, expect, beforeEach } from 'vitest';
import { useAtcStore } from '../store/useAtcStore';
import { Aircraft } from '../types/opensky';

const createMockAircraft = (partial: Partial<Aircraft>): Aircraft => ({
  icao24: 'abc123',
  callsign: 'TEST01',
  originCountry: 'United Kingdom',
  latitude: 51.5,
  longitude: -0.1,
  baroAltitudeMeters: 3000,
  baroAltitudeFeet: 9842,
  geoAltitudeMeters: 3000,
  geoAltitudeFeet: 9842,
  velocityMps: 200,
  velocityKnots: 389,
  heading: 180,
  headingCardinal: 'S',
  verticalRateMps: 5,
  verticalRateFpm: 984,
  verticalState: 'CLIMBING',
  onGround: false,
  timePosition: 1718000000,
  lastContact: 1718000000,
  squawk: '1000',
  spi: false,
  positionSource: 'ADS-B',
  hasValidPosition: true,
  firstSeenAt: Date.now(),
  lastSeenAt: Date.now(),
  observationCount: 1,
  isStale: false,
  ...partial,
});

describe('useAtcStore Filtering & Sorting', () => {
  beforeEach(() => {
    useAtcStore.setState({
      aircraftMap: {
        ac1: createMockAircraft({
          icao24: 'ac1',
          callsign: 'BAW101',
          originCountry: 'United Kingdom',
          baroAltitudeFeet: 35000,
          velocityKnots: 450,
          verticalState: 'LEVEL',
          onGround: false,
        }),
        ac2: createMockAircraft({
          icao24: 'ac2',
          callsign: 'DLH202',
          originCountry: 'Germany',
          baroAltitudeFeet: 12000,
          velocityKnots: 300,
          verticalState: 'DESCENDING',
          onGround: false,
        }),
        ac3: createMockAircraft({
          icao24: 'ac3',
          callsign: 'AFR303',
          originCountry: 'France',
          baroAltitudeFeet: 0,
          velocityKnots: 20,
          verticalState: 'LEVEL',
          onGround: true, // on ground
        }),
        ac4: createMockAircraft({
          icao24: 'ac4',
          callsign: 'EZY404',
          originCountry: 'United Kingdom',
          baroAltitudeFeet: 8000,
          velocityKnots: 250,
          verticalState: 'CLIMBING',
          onGround: false,
          squawk: '7700',
        }),
      },
      filters: {
        searchQuery: '',
        minAltitudeFt: 0,
        maxAltitudeFt: 55000,
        minVelocityKts: 0,
        maxVelocityKts: 700,
        groundState: 'ALL',
        verticalState: 'ALL',
        originCountry: '',
        onlyWithPosition: true,
        emergencyOnly: false,
      },
      sortConfig: { field: 'altitude', direction: 'desc' },
    });
  });

  it('filters aircraft by callsign search query', () => {
    useAtcStore.getState().setFilter({ searchQuery: 'BAW' });
    const list = useAtcStore.getState().getFilteredAircraftList();
    expect(list).toHaveLength(1);
    expect(list[0].callsign).toBe('BAW101');
  });

  it('filters aircraft by ICAO24 hex search query', () => {
    useAtcStore.getState().setFilter({ searchQuery: 'ac2' });
    const list = useAtcStore.getState().getFilteredAircraftList();
    expect(list).toHaveLength(1);
    expect(list[0].icao24).toBe('ac2');
  });

  it('filters aircraft by airborne vs on-ground state', () => {
    useAtcStore.getState().setFilter({ groundState: 'ON_GROUND' });
    let list = useAtcStore.getState().getFilteredAircraftList();
    expect(list).toHaveLength(1);
    expect(list[0].callsign).toBe('AFR303');

    useAtcStore.getState().setFilter({ groundState: 'AIRBORNE' });
    list = useAtcStore.getState().getFilteredAircraftList();
    expect(list).toHaveLength(3);
    expect(list.some((a) => a.onGround)).toBe(false);
  });

  it('filters aircraft by vertical trend (climbing, descending, level)', () => {
    useAtcStore.getState().setFilter({ verticalState: 'CLIMBING' });
    const list = useAtcStore.getState().getFilteredAircraftList();
    expect(list).toHaveLength(1);
    expect(list[0].callsign).toBe('EZY404');
  });

  it('filters aircraft by altitude range ceiling', () => {
    useAtcStore.getState().setFilter({ maxAltitudeFt: 15000 });
    const list = useAtcStore.getState().getFilteredAircraftList();
    // ac2 (12k), ac3 (0 ground), ac4 (8k)
    expect(list.some((a) => a.callsign === 'BAW101')).toBe(false);
    expect(list.some((a) => a.callsign === 'DLH202')).toBe(true);
  });

  it('filters aircraft by speed range', () => {
    useAtcStore.getState().setFilter({ minVelocityKts: 400 });
    const list = useAtcStore.getState().getFilteredAircraftList();
    expect(list).toHaveLength(1);
    expect(list[0].callsign).toBe('BAW101');
  });

  it('sorts aircraft by altitude in descending and ascending order', () => {
    useAtcStore.getState().setSort('altitude'); // toggles to asc
    let list = useAtcStore.getState().getFilteredAircraftList();
    expect(list[0].callsign).toBe('AFR303'); // 0 ft

    useAtcStore.getState().setSort('altitude'); // toggles to desc
    list = useAtcStore.getState().getFilteredAircraftList();
    expect(list[0].callsign).toBe('BAW101'); // 35,000 ft
  });

  it('filters aircraft by emergency squawk codes (7700, 7600, 7500)', () => {
    useAtcStore.getState().setFilter({ emergencyOnly: true });
    const list = useAtcStore.getState().getFilteredAircraftList();
    expect(list).toHaveLength(1);
    expect(list[0].callsign).toBe('EZY404');
    expect(list[0].squawk).toBe('7700');
  });
});
