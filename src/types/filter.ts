/**
 * Filter, sort, and search types for aircraft monitoring
 */

export type GroundFilter = 'ALL' | 'AIRBORNE' | 'ON_GROUND';

export type VerticalFilter = 'ALL' | 'CLIMBING' | 'DESCENDING' | 'LEVEL';

export type SortField = 'callsign' | 'icao24' | 'altitude' | 'velocity' | 'lastContact' | 'verticalRate';

export type SortDirection = 'asc' | 'desc';

export interface AircraftFilterCriteria {
  searchQuery: string; // matches callsign, icao24, or originCountry
  minAltitudeFt: number; // 0
  maxAltitudeFt: number; // 50000+
  minVelocityKts: number; // 0
  maxVelocityKts: number; // 800+
  groundState: GroundFilter;
  verticalState: VerticalFilter;
  originCountry: string; // "" or specific country
  onlyWithPosition: boolean; // default true
  emergencyOnly: boolean; // default false (matches squawk 7700, 7600, 7500)
}

export interface AircraftSortConfig {
  field: SortField;
  direction: SortDirection;
}
