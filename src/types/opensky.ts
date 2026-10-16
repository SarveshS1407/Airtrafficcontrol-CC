/**
 * OpenSky Network REST API Types & Clean Data Models
 */

/**
 * Raw OpenSky state vector tuple structure from GET /api/states/all
 */
export type RawStateVector = [
  string,          // 0: icao24
  string | null,   // 1: callsign
  string,          // 2: origin_country
  number | null,   // 3: time_position (Unix seconds)
  number,          // 4: last_contact (Unix seconds)
  number | null,   // 5: longitude (WGS84 degrees)
  number | null,   // 6: latitude (WGS84 degrees)
  number | null,   // 7: baro_altitude (meters)
  boolean,         // 8: on_ground
  number | null,   // 9: velocity (m/s)
  number | null,   // 10: true_track (degrees clockwise from north)
  number | null,   // 11: vertical_rate (m/s)
  number[] | null, // 12: sensors
  number | null,   // 13: geo_altitude (meters)
  string | null,   // 14: squawk
  boolean,         // 15: spi
  number,          // 16: position_source (0=ADS-B, 1=ASTERIX, 2=MLAT, 3=FLARM)
  number?          // 17: category (optional)
];

export interface OpenSkyResponse {
  time: number; // Unix seconds of server snapshot
  states: RawStateVector[] | null;
}

export type PositionSource = 'ADS-B' | 'ASTERIX' | 'MLAT' | 'FLARM' | 'UNKNOWN';

export type VerticalState = 'CLIMBING' | 'DESCENDING' | 'LEVEL';

/**
 * Normalized Aircraft observation representing a single point in time
 */
export interface AircraftObservation {
  timestamp: number; // Observation time in epoch milliseconds
  latitude: number;
  longitude: number;
  baroAltitudeMeters: number | null;
  baroAltitudeFeet: number | null;
  geoAltitudeMeters: number | null;
  geoAltitudeFeet: number | null;
  velocityMps: number | null;
  velocityKnots: number | null;
  heading: number | null; // 0-359 degrees
  verticalRateMps: number | null;
  verticalRateFpm: number | null;
  onGround: boolean;
}

/**
 * High-level Live Aircraft Model with telemetry and calculated fields
 */
export interface Aircraft {
  icao24: string;
  callsign: string;
  originCountry: string;
  latitude: number | null;
  longitude: number | null;
  baroAltitudeMeters: number | null;
  baroAltitudeFeet: number | null;
  geoAltitudeMeters: number | null;
  geoAltitudeFeet: number | null;
  velocityMps: number | null;
  velocityKnots: number | null;
  heading: number | null; // 0 - 360 degrees
  headingCardinal: string; // e.g. "N", "NE", "SSW"
  verticalRateMps: number | null;
  verticalRateFpm: number | null;
  verticalState: VerticalState;
  onGround: boolean;
  timePosition: number | null; // Unix epoch seconds
  lastContact: number; // Unix epoch seconds
  squawk: string | null;
  spi: boolean;
  positionSource: PositionSource;
  category?: number;
  
  // Local session tracking metadata
  hasValidPosition: boolean;
  firstSeenAt: number; // Local epoch ms
  lastSeenAt: number; // Local epoch ms
  observationCount: number;
  isStale: boolean; // Position hasn't updated in > 60s
}
