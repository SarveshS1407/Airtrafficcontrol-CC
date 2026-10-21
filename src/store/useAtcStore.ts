import { create } from 'zustand';
import { Aircraft, AircraftObservation } from '../types/opensky';
import { BoundingBox, RegionPreset } from '../types/geo';
import {
  AircraftFilterCriteria,
  AircraftSortConfig,
  SortField,
} from '../types/filter';
import { ApiStatus, ATCStatistics, DataSource } from '../types/telemetry';
import { PRESET_REGIONS, DEFAULT_REGION } from '../constants/regions';
import { ATC_CONFIG } from '../constants/config';
import {
  fetchLiveAircraftFromOpenSky,
  fetchDemoAircraftSnapshot,
  createObservationFromAircraft,
  OpenSkyRateLimitError,
} from '../services/openskyApi';
import { isWithinBounds, validateBoundingBox, createRadiusBoundingBox } from '../services/geoUtils';
import { isGoogleMapsConfigured } from '../services/googleMapsLoader';

export interface MonitoringTarget {
  name: string;
  lat: number;
  lng: number;
  radiusKm: number;
}

export interface AtcState {
  // Aircraft Registry (Keyed by ICAO24 for O(1) identity preservation)
  aircraftMap: Record<string, Aircraft>;
  // Movement History (Keyed by ICAO24)
  historyMap: Record<string, AircraftObservation[]>;
  selectedIcao24: string | null;

  // Geographic controls
  currentRegion: RegionPreset;
  customBounds: BoundingBox;
  activeBounds: BoundingBox;
  viewportSyncEnabled: boolean;
  monitoringTarget: MonitoringTarget | null;

  // Map Engine Preference
  mapEngine: 'google' | 'leaflet';

  // Filters & Sorting
  filters: AircraftFilterCriteria;
  sortConfig: AircraftSortConfig;

  // Polling Lifecycle & Diagnostics
  apiStatus: ApiStatus;
  pollingIntervalMs: number;
  isPollingPaused: boolean;

  // Map Display Preferences
  tileProviderKey: 'osmDark' | 'osmStandard' | 'osmHot';
  showTrail: boolean;
  showLabels: boolean;
  showBoundsRectangle: boolean;
  mapCenterTarget: [number, number] | null;

  // Internal Request Controller
  activeAbortController: AbortController | null;

  // Actions
  setMapEngine: (engine: 'google' | 'leaflet') => void;
  setMonitoringTarget: (target: MonitoringTarget | null) => void;
  setMonitoringRadius: (radiusKm: number) => void;
  setDataSource: (source: DataSource) => void;
  setRegion: (regionId: string) => void;
  setCustomBounds: (bounds: BoundingBox) => void;
  setViewportSync: (enabled: boolean) => void;
  updateBoundsFromViewport: (bounds: BoundingBox) => void;
  selectAircraft: (icao24: string | null) => void;
  triggerCenterOnMap: (lat: number, lon: number) => void;
  clearCenterTarget: () => void;
  setFilter: (partial: Partial<AircraftFilterCriteria>) => void;
  resetFilters: () => void;
  setSort: (field: SortField) => void;
  setPollingInterval: (ms: number) => void;
  togglePollingPause: () => void;
  setTileProvider: (key: 'osmDark' | 'osmStandard' | 'osmHot') => void;
  toggleTrail: () => void;
  toggleLabels: () => void;
  toggleBoundsRectangle: () => void;
  clearHistory: () => void;

  // Async Polling
  fetchAircraftSnapshot: (force?: boolean) => Promise<void>;

  // Selectors / Helpers
  getFilteredAircraftList: () => Aircraft[];
  getStatistics: () => ATCStatistics;
  getSelectedAircraft: () => { aircraft: Aircraft | null; history: AircraftObservation[] };
}

const DEFAULT_FILTERS: AircraftFilterCriteria = {
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
};

export const useAtcStore = create<AtcState>((set, get) => ({
  aircraftMap: {},
  historyMap: {},
  selectedIcao24: null,

  currentRegion: DEFAULT_REGION,
  customBounds: { ...DEFAULT_REGION.bounds },
  activeBounds: { ...DEFAULT_REGION.bounds },
  viewportSyncEnabled: false,
  monitoringTarget: null,

  mapEngine:
    typeof window !== 'undefined' && localStorage.getItem('atc_map_engine_pref')
      ? (localStorage.getItem('atc_map_engine_pref') as 'google' | 'leaflet')
      : isGoogleMapsConfigured()
      ? 'google'
      : 'leaflet',

  filters: { ...DEFAULT_FILTERS },
  sortConfig: { field: 'altitude', direction: 'desc' },

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

  pollingIntervalMs: ATC_CONFIG.DEFAULT_POLLING_INTERVAL_MS,
  isPollingPaused: false,

  tileProviderKey: 'osmDark',
  showTrail: true,
  showLabels: true,
  showBoundsRectangle: true,
  mapCenterTarget: null,

  activeAbortController: null,

  setMapEngine: (engine: 'google' | 'leaflet') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('atc_map_engine_pref', engine);
    }
    set({ mapEngine: engine });
  },

  setMonitoringTarget: (target: MonitoringTarget | null) => {
    if (!target) {
      set({ monitoringTarget: null });
      return;
    }
    const bounds = createRadiusBoundingBox(target.lat, target.lng, target.radiusKm);
    set({
      monitoringTarget: target,
      activeBounds: bounds,
      customBounds: bounds,
      viewportSyncEnabled: false,
      mapCenterTarget: [target.lat, target.lng],
    });
    get().fetchAircraftSnapshot(true);
  },

  setMonitoringRadius: (radiusKm: number) => {
    const current = get().monitoringTarget;
    if (!current) return;
    const updated = { ...current, radiusKm };
    const bounds = createRadiusBoundingBox(updated.lat, updated.lng, radiusKm);
    set({
      monitoringTarget: updated,
      activeBounds: bounds,
      customBounds: bounds,
    });
    get().fetchAircraftSnapshot(true);
  },

  setDataSource: (source: DataSource) => {
    // If switching to demo, reset error state
    set((state) => ({
      apiStatus: {
        ...state.apiStatus,
        source,
        status: 'IDLE',
        lastError: null,
        freshness: source === 'DEMO' ? 'DEMO' : state.apiStatus.freshness,
      },
    }));
    // Trigger snapshot for new source
    get().fetchAircraftSnapshot(true);
  },

  setRegion: (regionId: string) => {
    const region = PRESET_REGIONS.find((r) => r.id === regionId) ?? DEFAULT_REGION;
    set({
      currentRegion: region,
      activeBounds: { ...region.bounds },
      viewportSyncEnabled: false,
      monitoringTarget: null,
      mapCenterTarget: [...region.center] as [number, number],
    });
    get().fetchAircraftSnapshot(true);
  },

  setCustomBounds: (bounds: BoundingBox) => {
    const validation = validateBoundingBox(bounds);
    if (!validation.isValid) return;

    const customPreset = PRESET_REGIONS.find((r) => r.id === 'custom') ?? {
      id: 'custom',
      name: 'Custom Region',
      description: 'User specified bounding coordinates',
      country: 'Global',
      bounds,
      center: [(bounds.lamin + bounds.lamax) / 2, (bounds.lomin + bounds.lomax) / 2] as [number, number],
      zoom: 8,
    };

    set({
      currentRegion: {
        ...customPreset,
        bounds,
        center: [(bounds.lamin + bounds.lamax) / 2, (bounds.lomin + bounds.lomax) / 2],
      },
      customBounds: bounds,
      activeBounds: bounds,
      viewportSyncEnabled: false,
    });
    get().fetchAircraftSnapshot(true);
  },

  setViewportSync: (enabled: boolean) => {
    set({ viewportSyncEnabled: enabled });
  },

  updateBoundsFromViewport: (bounds: BoundingBox) => {
    if (!get().viewportSyncEnabled) return;
    const validation = validateBoundingBox(bounds);
    if (!validation.isValid) return;
    set({ activeBounds: bounds });
  },

  selectAircraft: (icao24: string | null) => {
    set({ selectedIcao24: icao24 });
  },

  triggerCenterOnMap: (lat: number, lon: number) => {
    set({ mapCenterTarget: [lat, lon] });
  },

  clearCenterTarget: () => {
    set({ mapCenterTarget: null });
  },

  setFilter: (partial: Partial<AircraftFilterCriteria>) => {
    set((state) => ({
      filters: { ...state.filters, ...partial },
    }));
  },

  resetFilters: () => {
    set({ filters: { ...DEFAULT_FILTERS } });
  },

  setSort: (field: SortField) => {
    set((state) => {
      if (state.sortConfig.field === field) {
        return {
          sortConfig: {
            field,
            direction: state.sortConfig.direction === 'asc' ? 'desc' : 'asc',
          },
        };
      }
      return {
        sortConfig: { field, direction: 'desc' },
      };
    });
  },

  setPollingInterval: (ms: number) => {
    set({ pollingIntervalMs: ms });
  },

  togglePollingPause: () => {
    set((state) => ({ isPollingPaused: !state.isPollingPaused }));
  },

  setTileProvider: (key) => set({ tileProviderKey: key }),
  toggleTrail: () => set((state) => ({ showTrail: !state.showTrail })),
  toggleLabels: () => set((state) => ({ showLabels: !state.showLabels })),
  toggleBoundsRectangle: () => set((state) => ({ showBoundsRectangle: !state.showBoundsRectangle })),

  clearHistory: () => {
    set({ historyMap: {} });
  },

  fetchAircraftSnapshot: async (force: boolean = false) => {
    const state = get();

    // 1. Check if fetching already in progress
    if (state.apiStatus.status === 'FETCHING' && !force) {
      return;
    }

    // 2. Check if rate-limited backoff is active
    const now = Date.now();
    if (
      state.apiStatus.rateLimitBackoffUntil &&
      state.apiStatus.rateLimitBackoffUntil > now &&
      !force &&
      state.apiStatus.source === 'LIVE'
    ) {
      return;
    }

    // Cancel any active in-flight request
    if (state.activeAbortController) {
      state.activeAbortController.abort();
    }

    const abortController = new AbortController();
    set((s) => ({
      activeAbortController: abortController,
      apiStatus: {
        ...s.apiStatus,
        status: 'FETCHING',
        lastAttempt: now,
      },
    }));

    const startTime = performance.now();

    try {
      let snapshot: { time: number; aircraft: Aircraft[] };

      if (state.apiStatus.source === 'DEMO') {
        snapshot = fetchDemoAircraftSnapshot();
      } else {
        snapshot = await fetchLiveAircraftFromOpenSky(state.activeBounds, abortController.signal);
      }

      const durationMs = Math.round(performance.now() - startTime);
      const incomingAircraft = snapshot.aircraft;

      // Update aircraft map while PRESERVING IDENTITY, session history, and observations
      const currentMap = { ...get().aircraftMap };
      const currentHistory = { ...get().historyMap };
      const seenIcaoSet = new Set<string>();

      for (const fresh of incomingAircraft) {
        const id = fresh.icao24;
        seenIcaoSet.add(id);

        const existing = currentMap[id];
        if (existing) {
          // Preserve local session tracking metadata
          fresh.firstSeenAt = existing.firstSeenAt;
          fresh.observationCount = existing.observationCount + 1;
        }

        currentMap[id] = fresh;

        // Collect movement observation point
        const observation = createObservationFromAircraft(fresh);
        if (observation) {
          const list = currentHistory[id] ? [...currentHistory[id]] : [];
          // Avoid duplicate coordinates within same second
          const lastPoint = list[list.length - 1];
          const hasMoved =
            !lastPoint ||
            lastPoint.latitude !== observation.latitude ||
            lastPoint.longitude !== observation.longitude ||
            lastPoint.baroAltitudeMeters !== observation.baroAltitudeMeters;

          if (hasMoved) {
            list.push(observation);
            // Limit buffer size to maximum configured points
            if (list.length > ATC_CONFIG.MAX_HISTORY_POINTS_PER_AIRCRAFT) {
              list.shift();
            }
            currentHistory[id] = list;
          }
        }
      }

      // Check for aircraft that were not in incoming snapshot (e.g. left bounding box or lost radar contact)
      const purgeThresholdSec = ATC_CONFIG.PURGE_AIRCRAFT_THRESHOLD_SEC;
      const staleThresholdSec = ATC_CONFIG.STALE_AIRCRAFT_THRESHOLD_SEC;
      const nowEpochSec = Math.floor(now / 1000);

      for (const [id, ac] of Object.entries(currentMap)) {
        if (!seenIcaoSet.has(id)) {
          const ageSec = nowEpochSec - (ac.timePosition ?? ac.lastContact);
          if (ageSec > purgeThresholdSec) {
            delete currentMap[id];
            // keep historyMap for historical reference or clean up
          } else if (ageSec > staleThresholdSec) {
            currentMap[id] = { ...ac, isStale: true };
          }
        }
      }

      set({
        aircraftMap: currentMap,
        historyMap: currentHistory,
        activeAbortController: null,
        apiStatus: {
          ...get().apiStatus,
          status: 'SUCCESS',
          freshness: state.apiStatus.source === 'DEMO' ? 'DEMO' : 'FRESH',
          lastSuccessfulFetch: now,
          lastError: null,
          consecutiveFailures: 0,
          rateLimitBackoffUntil: null,
          snapshotServerTime: snapshot.time,
          requestDurationMs: durationMs,
        },
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Ignored, intentional cancellation
        return;
      }

      const durationMs = Math.round(performance.now() - startTime);
      const isRateLimit = err instanceof OpenSkyRateLimitError;
      const retryAfterSec = isRateLimit ? err.retryAfterSec : 60;
      const errorMessage = err instanceof Error ? err.message : 'Unknown network failure';

      // ON FAILURE: Preserves the last successful snapshot with STALE flag!
      set((s) => ({
        activeAbortController: null,
        apiStatus: {
          ...s.apiStatus,
          status: isRateLimit ? 'RATE_LIMITED' : 'ERROR',
          // Keep existing data, mark as STALE if previous data exists
          freshness: Object.keys(s.aircraftMap).length > 0 ? 'STALE' : 'FRESH',
          lastError: errorMessage,
          consecutiveFailures: s.apiStatus.consecutiveFailures + 1,
          rateLimitBackoffUntil: isRateLimit ? Date.now() + retryAfterSec * 1000 : null,
          requestDurationMs: durationMs,
        },
      }));
    }
  },

  getFilteredAircraftList: () => {
    const { aircraftMap, filters, sortConfig } = get();
    const query = filters.searchQuery.trim().toLowerCase();
    const countryQuery = filters.originCountry.trim().toLowerCase();

    const list = Object.values(aircraftMap).filter((ac) => {
      // Must have valid coordinates if onlyWithPosition is checked
      if (filters.onlyWithPosition && !ac.hasValidPosition) {
        return false;
      }

      // Callsign / ICAO / Country search query
      if (query) {
        const matchCallsign = ac.callsign.toLowerCase().includes(query);
        const matchIcao = ac.icao24.toLowerCase().includes(query);
        const matchCountry = ac.originCountry.toLowerCase().includes(query);
        if (!matchCallsign && !matchIcao && !matchCountry) {
          return false;
        }
      }

      // Country filter
      if (countryQuery && !ac.originCountry.toLowerCase().includes(countryQuery)) {
        return false;
      }

      // Ground status filter
      if (filters.groundState === 'AIRBORNE' && ac.onGround) return false;
      if (filters.groundState === 'ON_GROUND' && !ac.onGround) return false;

      // Vertical rate filter
      if (filters.verticalState !== 'ALL' && ac.verticalState !== filters.verticalState) {
        return false;
      }

      // Altitude filter (applies to airborne aircraft with known altitude)
      if (!ac.onGround && ac.baroAltitudeFeet !== null) {
        if (
          ac.baroAltitudeFeet < filters.minAltitudeFt ||
          ac.baroAltitudeFeet > filters.maxAltitudeFt
        ) {
          return false;
        }
      }

      // Velocity filter
      if (ac.velocityKnots !== null) {
        if (
          ac.velocityKnots < filters.minVelocityKts ||
          ac.velocityKnots > filters.maxVelocityKts
        ) {
          return false;
        }
      }

      // Emergency squawk filter (7700 = General Emergency, 7600 = Radio failure, 7500 = Hijack)
      if (filters.emergencyOnly && !['7700', '7600', '7500'].includes(ac.squawk ?? '')) {
        return false;
      }

      return true;
    });

    // Sorting
    list.sort((a, b) => {
      const dir = sortConfig.direction === 'asc' ? 1 : -1;
      switch (sortConfig.field) {
        case 'callsign':
          return a.callsign.localeCompare(b.callsign) * dir;
        case 'icao24':
          return a.icao24.localeCompare(b.icao24) * dir;
        case 'altitude':
          return ((a.baroAltitudeFeet ?? -1) - (b.baroAltitudeFeet ?? -1)) * dir;
        case 'velocity':
          return ((a.velocityKnots ?? -1) - (b.velocityKnots ?? -1)) * dir;
        case 'verticalRate':
          return ((a.verticalRateFpm ?? 0) - (b.verticalRateFpm ?? 0)) * dir;
        case 'lastContact':
          return (a.lastContact - b.lastContact) * dir;
        default:
          return 0;
      }
    });

    return list;
  },

  getStatistics: () => {
    const { aircraftMap, activeBounds } = get();
    const all = Object.values(aircraftMap);

    let airborneCount = 0;
    let onGroundCount = 0;
    let inBoundsCount = 0;
    let highestAltitudeFt = 0;
    let fastestSpeedKts = 0;

    for (const ac of all) {
      if (ac.onGround) {
        onGroundCount++;
      } else {
        airborneCount++;
      }

      if (ac.latitude !== null && ac.longitude !== null && isWithinBounds(ac.latitude, ac.longitude, activeBounds)) {
        inBoundsCount++;
      }

      if (ac.baroAltitudeFeet !== null && ac.baroAltitudeFeet > highestAltitudeFt) {
        highestAltitudeFt = ac.baroAltitudeFeet;
      }

      if (ac.velocityKnots !== null && ac.velocityKnots > fastestSpeedKts) {
        fastestSpeedKts = ac.velocityKnots;
      }
    }

    const filteredCount = get().getFilteredAircraftList().length;

    return {
      totalTracked: all.length,
      airborneCount,
      onGroundCount,
      filteredCount,
      inBoundsCount,
      highestAltitudeFt,
      fastestSpeedKts,
    };
  },

  getSelectedAircraft: () => {
    const { selectedIcao24, aircraftMap, historyMap } = get();
    if (!selectedIcao24 || !aircraftMap[selectedIcao24]) {
      return { aircraft: null, history: [] };
    }
    return {
      aircraft: aircraftMap[selectedIcao24],
      history: historyMap[selectedIcao24] ?? [],
    };
  },
}));
