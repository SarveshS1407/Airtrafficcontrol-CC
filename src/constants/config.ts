/**
 * ATC Application Configuration Constants
 */

export const ATC_CONFIG = {
  // Polling intervals in milliseconds
  DEFAULT_POLLING_INTERVAL_MS: 10000, // 10 seconds adheres to OpenSky anonymous rate limit
  MIN_POLLING_INTERVAL_MS: 5000,
  POLLING_INTERVAL_OPTIONS: [
    { label: '5s (Auth / High)', value: 5000 },
    { label: '10s (Recommended)', value: 10000 },
    { label: '15s (Conserve)', value: 15000 },
    { label: '30s (Slow)', value: 30000 },
    { label: 'Manual Only', value: 0 },
  ],

  // Rate limit and backoff
  RATE_LIMIT_BASE_BACKOFF_MS: 60000, // 1 minute backoff upon HTTP 429
  MAX_CONSECUTIVE_ERRORS_BEFORE_PAUSE: 5,
  REQUEST_TIMEOUT_MS: 8000,

  // Aircraft tracking lifecycle
  STALE_AIRCRAFT_THRESHOLD_SEC: 60, // Marks aircraft as stale if no position update in 60s
  PURGE_AIRCRAFT_THRESHOLD_SEC: 240, // Removes aircraft if not observed for 4 minutes
  MAX_HISTORY_POINTS_PER_AIRCRAFT: 100, // Movement breadcrumbs to retain per aircraft

  // Geographic bounds constraints
  MAX_BOUNDS_AREA_DEG_SQ: 30, // Limit bounding box to reasonable terminal area size
  MIN_BOUNDS_SPAN_DEG: 0.1, // Minimum span to prevent 0-size queries

  // Map settings and tile providers
  TILE_PROVIDERS: {
    osmDark: {
      name: 'OpenStreetMap (Tactical Radar Night)',
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      maxZoom: 19,
      className: 'atc-dark-tiles',
    },
    osmStandard: {
      name: 'OpenStreetMap (Daylight Chart)',
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      maxZoom: 19,
    },
    osmHot: {
      name: 'OpenStreetMap (Humanitarian Transit)',
      url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors, style by <a href="https://www.hotosm.org/" target="_blank" rel="noopener">HOT</a>',
      maxZoom: 19,
      subdomains: 'abc',
    },
  },

  // Disclaimer text required by spec
  HISTORY_DISCLAIMER:
    'Locally collected observations reflect the current monitoring session only and do not represent a complete historical flight record from origin to destination.',
  
  DEMO_DATA_LABEL:
    'DEMO MODE: Displaying recorded historical flight vectors for offline testing. Real-time updates paused.',
};
