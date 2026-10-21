import {
  RawStateVector,
  OpenSkyResponse,
  Aircraft,
  PositionSource,
  VerticalState,
  AircraftObservation,
} from '../types/opensky';
import { BoundingBox } from '../types/geo';
import {
  metersToFeet,
  mpsToKnots,
  mpsToFpm,
  headingToCardinal,
  validateBoundingBox,
} from './geoUtils';
import { ATC_CONFIG } from '../constants/config';
import {
  MOCK_OPENSKY_LONDON_SNAPSHOT,
  advanceMockVectors,
} from '../constants/mockFixtures';

export class OpenSkyRateLimitError extends Error {
  retryAfterSec: number;
  constructor(message: string, retryAfterSec: number = 60) {
    super(message);
    this.name = 'OpenSkyRateLimitError';
    this.retryAfterSec = retryAfterSec;
  }
}

export class OpenSkyApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'OpenSkyApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Maps raw OpenSky position source integer to human readable source
 */
function parsePositionSource(sourceCode: number): PositionSource {
  switch (sourceCode) {
    case 0:
      return 'ADS-B';
    case 1:
      return 'ASTERIX';
    case 2:
      return 'MLAT';
    case 3:
      return 'FLARM';
    default:
      return 'UNKNOWN';
  }
}

/**
 * Parses vertical rate into flight vertical state
 */
function parseVerticalState(verticalRateMps: number | null): VerticalState {
  if (verticalRateMps === null || Number.isNaN(verticalRateMps)) {
    return 'LEVEL';
  }
  if (verticalRateMps > 0.5) {
    return 'CLIMBING';
  }
  if (verticalRateMps < -0.5) {
    return 'DESCENDING';
  }
  return 'LEVEL';
}

/**
 * Robustly parses a single raw OpenSky state vector array into our typed Aircraft model.
 * Handles null, undefined, unexpected types, or out-of-range values without throwing.
 */
export function parseRawStateVector(raw: RawStateVector, nowEpochMs: number = Date.now()): Aircraft | null {
  if (!Array.isArray(raw) || raw.length < 17) {
    return null;
  }

  const icao24 = typeof raw[0] === 'string' ? raw[0].trim().toLowerCase() : '';
  if (!icao24) {
    return null;
  }

  const rawCallsign = typeof raw[1] === 'string' ? raw[1].trim() : '';
  const callsign = rawCallsign.length > 0 ? rawCallsign : icao24.toUpperCase();
  const originCountry = typeof raw[2] === 'string' ? raw[2].trim() : 'Unknown';

  const timePosition = typeof raw[3] === 'number' && !Number.isNaN(raw[3]) ? raw[3] : null;
  const lastContact = typeof raw[4] === 'number' && !Number.isNaN(raw[4]) ? raw[4] : Math.floor(nowEpochMs / 1000);

  const rawLon = typeof raw[5] === 'number' && !Number.isNaN(raw[5]) ? raw[5] : null;
  const rawLat = typeof raw[6] === 'number' && !Number.isNaN(raw[6]) ? raw[6] : null;

  // Validate coordinates within valid bounds
  const hasValidPosition =
    rawLat !== null &&
    rawLon !== null &&
    rawLat >= -90 &&
    rawLat <= 90 &&
    rawLon >= -180 &&
    rawLon <= 180;

  const latitude = hasValidPosition ? rawLat : null;
  const longitude = hasValidPosition ? rawLon : null;

  const baroAltitudeMeters = typeof raw[7] === 'number' && !Number.isNaN(raw[7]) ? raw[7] : null;
  const baroAltitudeFeet = metersToFeet(baroAltitudeMeters);

  const onGround = Boolean(raw[8]);

  const velocityMps = typeof raw[9] === 'number' && !Number.isNaN(raw[9]) ? raw[9] : null;
  const velocityKnots = mpsToKnots(velocityMps);

  const heading =
    typeof raw[10] === 'number' && !Number.isNaN(raw[10])
      ? Math.round(((raw[10] % 360) + 360) % 360)
      : null;
  const headingCardinal = headingToCardinal(heading);

  const verticalRateMps = typeof raw[11] === 'number' && !Number.isNaN(raw[11]) ? raw[11] : null;
  const verticalRateFpm = mpsToFpm(verticalRateMps);
  const verticalState = parseVerticalState(verticalRateMps);

  const geoAltitudeMeters = typeof raw[13] === 'number' && !Number.isNaN(raw[13]) ? raw[13] : null;
  const geoAltitudeFeet = metersToFeet(geoAltitudeMeters);

  const squawk = typeof raw[14] === 'string' && raw[14].trim() ? raw[14].trim() : null;
  const spi = Boolean(raw[15]);
  const positionSource = typeof raw[16] === 'number' ? parsePositionSource(raw[16]) : 'UNKNOWN';
  const category = typeof raw[17] === 'number' ? raw[17] : undefined;

  const ageSeconds = Math.floor(nowEpochMs / 1000) - (timePosition ?? lastContact);
  const isStale = ageSeconds > ATC_CONFIG.STALE_AIRCRAFT_THRESHOLD_SEC;

  return {
    icao24,
    callsign,
    originCountry,
    latitude,
    longitude,
    baroAltitudeMeters,
    baroAltitudeFeet,
    geoAltitudeMeters,
    geoAltitudeFeet,
    velocityMps,
    velocityKnots,
    heading,
    headingCardinal,
    verticalRateMps,
    verticalRateFpm,
    verticalState,
    onGround,
    timePosition,
    lastContact,
    squawk,
    spi,
    positionSource,
    category,
    hasValidPosition,
    firstSeenAt: nowEpochMs,
    lastSeenAt: nowEpochMs,
    observationCount: 1,
    isStale,
  };
}

/**
 * Creates an observation point for movement history from an aircraft record
 */
export function createObservationFromAircraft(aircraft: Aircraft): AircraftObservation | null {
  if (aircraft.latitude === null || aircraft.longitude === null) {
    return null;
  }
  return {
    timestamp: aircraft.lastSeenAt,
    latitude: aircraft.latitude,
    longitude: aircraft.longitude,
    baroAltitudeMeters: aircraft.baroAltitudeMeters,
    baroAltitudeFeet: aircraft.baroAltitudeFeet,
    geoAltitudeMeters: aircraft.geoAltitudeMeters,
    geoAltitudeFeet: aircraft.geoAltitudeFeet,
    velocityMps: aircraft.velocityMps,
    velocityKnots: aircraft.velocityKnots,
    heading: aircraft.heading,
    verticalRateMps: aircraft.verticalRateMps,
    verticalRateFpm: aircraft.verticalRateFpm,
    onGround: aircraft.onGround,
  };
}

/**
 * State container for Demo mode simulation
 */
let demoSimulationState: RawStateVector[] = [...(MOCK_OPENSKY_LONDON_SNAPSHOT.states ?? [])];
let lastDemoTickEpochMs = Date.now();

export function resetDemoSimulation(): void {
  demoSimulationState = [...(MOCK_OPENSKY_LONDON_SNAPSHOT.states ?? [])];
  lastDemoTickEpochMs = Date.now();
}

/**
 * Generates an updated mock snapshot with simulated motion for offline development
 */
export function fetchDemoAircraftSnapshot(): { time: number; aircraft: Aircraft[] } {
  const now = Date.now();
  const elapsedSec = Math.max(1, Math.min(30, (now - lastDemoTickEpochMs) / 1000));
  lastDemoTickEpochMs = now;

  demoSimulationState = advanceMockVectors(demoSimulationState, elapsedSec);

  const aircraftList: Aircraft[] = [];
  for (const raw of demoSimulationState) {
    const parsed = parseRawStateVector(raw, now);
    if (parsed) {
      aircraftList.push(parsed);
    }
  }

  return {
    time: Math.floor(now / 1000),
    aircraft: aircraftList,
  };
}

/**
 * Fetches live aircraft from OpenSky Network REST API within specified geographic bounds,
 * or globally across all flight regions if bounds are omitted or set to world-scale.
 */
export async function fetchLiveAircraftFromOpenSky(
  bounds?: BoundingBox | null,
  signal?: AbortSignal
): Promise<{ time: number; aircraft: Aircraft[] }> {
  const isWorldwide = bounds
    ? bounds.lamin <= -70 && bounds.lamax >= 70 && bounds.lomin <= -160 && bounds.lomax >= 160
    : true;

  if (bounds && !isWorldwide) {
    // Validate bounds before network request
    const validation = validateBoundingBox(bounds, true);
    if (!validation.isValid) {
      throw new Error(`Invalid bounding box: ${validation.error}`);
    }
  }

  const params = new URLSearchParams();
  if (bounds && !isWorldwide) {
    params.set('lamin', bounds.lamin.toFixed(4));
    params.set('lomin', bounds.lomin.toFixed(4));
    params.set('lamax', bounds.lamax.toFixed(4));
    params.set('lomax', bounds.lomax.toFixed(4));
  }

  const requestUrl = params.toString().length > 0
    ? `/api/opensky/states/all?${params.toString()}`
    : '/api/opensky/states/all';

  let response: Response;
  try {
    response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw err; // Let caller know it was cancelled
    }
    throw new Error(
      `OpenSky network connection failed. Check your network or local proxy: ${(err as Error).message}`
    );
  }

  if (response.status === 429) {
    const retryAfterHeader = response.headers.get('Retry-After');
    const retrySec = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60;
    throw new OpenSkyRateLimitError(
      `OpenSky rate limit exceeded (HTTP 429). Respecting API policy backoff for ${retrySec}s.`,
      Number.isNaN(retrySec) ? 60 : retrySec
    );
  }

  if (!response.ok) {
    throw new OpenSkyApiError(
      `OpenSky API returned HTTP error ${response.status}: ${response.statusText}`,
      response.status
    );
  }

  let data: OpenSkyResponse;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error('Failed to parse OpenSky JSON response payload');
  }

  const nowEpochMs = Date.now();
  const parsedAircraft: Aircraft[] = [];

  if (Array.isArray(data.states)) {
    for (const raw of data.states) {
      const aircraft = parseRawStateVector(raw, nowEpochMs);
      if (aircraft) {
        parsedAircraft.push(aircraft);
      }
    }
  }

  return {
    time: typeof data.time === 'number' ? data.time : Math.floor(nowEpochMs / 1000),
    aircraft: parsedAircraft,
  };
}
