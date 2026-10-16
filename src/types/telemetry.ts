/**
 * Telemetry, Movement History, and Polling lifecycle types
 */
import { AircraftObservation } from './opensky';

export type PollingStatus = 'IDLE' | 'FETCHING' | 'SUCCESS' | 'ERROR' | 'RATE_LIMITED';

export type DataFreshness = 'FRESH' | 'STALE' | 'DEMO';

export type DataSource = 'LIVE' | 'DEMO';

export interface AircraftHistoryTrack {
  icao24: string;
  callsign: string;
  observations: AircraftObservation[]; // chronological list of points
  maxPoints: number;
}

export interface ATCStatistics {
  totalTracked: number;
  airborneCount: number;
  onGroundCount: number;
  filteredCount: number;
  inBoundsCount: number;
  highestAltitudeFt: number;
  fastestSpeedKts: number;
}

export interface ApiStatus {
  source: DataSource;
  status: PollingStatus;
  freshness: DataFreshness;
  lastSuccessfulFetch: number | null; // epoch ms
  lastAttempt: number | null; // epoch ms
  lastError: string | null;
  rateLimitBackoffUntil: number | null; // epoch ms
  consecutiveFailures: number;
  snapshotServerTime: number | null; // OpenSky unix epoch
  requestDurationMs: number | null;
}
