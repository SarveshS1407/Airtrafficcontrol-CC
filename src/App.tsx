import React, { useEffect, useState, useCallback } from 'react';
import {
  Plane,
  Filter,
  MapPin,
  Radio,
  SlidersHorizontal,
  Compass,
  X,
  AlertTriangle,
} from 'lucide-react';
import { useAtcStore } from './store/useAtcStore';
import { AtcHeader } from './components/Header/AtcHeader';
import { StaleDataAlert } from './components/Common/StaleDataAlert';
import { MetricsBanner } from './components/Sidebar/MetricsBanner';
import { RegionSelector } from './components/Sidebar/RegionSelector';
import { FilterPanel } from './components/Sidebar/FilterPanel';
import { FlightList } from './components/Sidebar/FlightList';
import { RadarMap } from './components/Map/RadarMap';
import { FlightDetailPanel } from './components/Telemetry/FlightDetailPanel';

type SidebarTab = 'flights' | 'filters' | 'sectors';
type MobileSheet = 'none' | 'flights' | 'filters' | 'telemetry';

export const App: React.FC = () => {
  const {
    currentRegion,
    activeBounds,
    viewportSyncEnabled,
    filters,
    sortConfig,
    apiStatus,
    pollingIntervalMs,
    isPollingPaused,
    selectedIcao24,
    tileProviderKey,
    showTrail,
    showBoundsRectangle,
    setDataSource,
    setRegion,
    setCustomBounds,
    setViewportSync,
    updateBoundsFromViewport,
    selectAircraft,
    setFilter,
    resetFilters,
    setSort,
    setTileProvider,
    toggleTrail,
    toggleBoundsRectangle,
    clearHistory,
    fetchAircraftSnapshot,
    getFilteredAircraftList,
    getStatistics,
    getSelectedAircraft,
    mapCenterTarget,
    triggerCenterOnMap,
    clearCenterTarget,
  } = useAtcStore();

  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<SidebarTab>('flights');
  const [mobileSheet, setMobileSheet] = useState<MobileSheet>('none');

  // Initial fetch on mount
  useEffect(() => {
    fetchAircraftSnapshot(true);
  }, []);

  // Polling Lifecycle with interval cleanup
  useEffect(() => {
    if (isPollingPaused || pollingIntervalMs === 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      fetchAircraftSnapshot();
    }, pollingIntervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPollingPaused, pollingIntervalMs, fetchAircraftSnapshot]);

  // Global Tactical Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 'Escape') {
        selectAircraft(null);
        setMobileSheet('none');
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        useAtcStore.getState().togglePollingPause();
      } else if (e.key.toLowerCase() === 'r') {
        fetchAircraftSnapshot(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectAircraft, fetchAircraftSnapshot]);

  const filteredAircraft = getFilteredAircraftList();
  const statistics = getStatistics();
  const { aircraft: selectedAircraft, history: selectedHistory } = getSelectedAircraft();

  // Active filters count for badges
  const activeFilterCount =
    (filters.searchQuery ? 1 : 0) +
    (filters.groundState !== 'ALL' ? 1 : 0) +
    (filters.verticalState !== 'ALL' ? 1 : 0) +
    (filters.minAltitudeFt > 0 || filters.maxAltitudeFt < 55000 ? 1 : 0) +
    (filters.minVelocityKts > 0 || filters.maxVelocityKts < 700 ? 1 : 0) +
    (filters.originCountry ? 1 : 0) +
    (filters.emergencyOnly ? 1 : 0);

  const handleCenterOnMap = useCallback(
    (lat: number, lon: number) => {
      triggerCenterOnMap(lat, lon);
    },
    [triggerCenterOnMap]
  );

  const handleSelectAircraft = useCallback(
    (icao24: string | null) => {
      selectAircraft(icao24);
      if (icao24 && window.innerWidth < 768) {
        setMobileSheet('telemetry');
      }
    },
    [selectAircraft]
  );

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-atc-950 text-slate-100 font-sans select-none">
      {/* Tactical Radar Header */}
      <AtcHeader
        onToggleSidebar={() => {
          if (window.innerWidth < 768) {
            setMobileSheet((prev) => (prev === 'flights' ? 'none' : 'flights'));
          } else {
            setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
          }
        }}
        isSidebarOpen={isDesktopSidebarOpen}
      />

      {/* Stale Data / Rate Limit Warning Banner */}
      <StaleDataAlert
        apiStatus={apiStatus}
        aircraftCount={statistics.totalTracked}
        onRetry={() => fetchAircraftSnapshot(true)}
        onSwitchToDemo={() => setDataSource('DEMO')}
      />

      {/* Main Operations Work Area */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* DESKTOP Left Surveillance Panel (hidden on screens < 768px) */}
        <aside
          className={`${
            isDesktopSidebarOpen ? 'w-96 xl:w-[420px]' : 'w-0'
          } hidden md:flex flex-col h-full bg-atc-900 border-r border-atc-800 transition-all duration-300 ease-in-out overflow-hidden z-20 shrink-0 shadow-xl`}
        >
          {/* Segmented Surveillance Navigation Tabs */}
          <div className="grid grid-cols-3 border-b border-atc-800 bg-atc-950/90 text-xs font-mono">
            <button
              onClick={() => setActiveTab('flights')}
              className={`py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors border-b-2 font-semibold ${
                activeTab === 'flights'
                  ? 'border-cyan-400 text-cyan-300 bg-atc-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              TARGETS
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-atc-800 border border-atc-700 text-cyan-300">
                {filteredAircraft.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('filters')}
              className={`py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors border-b-2 font-semibold ${
                activeTab === 'filters'
                  ? 'border-cyan-400 text-cyan-300 bg-atc-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              FILTERS
              {activeFilterCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-900 text-cyan-300 border border-cyan-500 font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('sectors')}
              className={`py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors border-b-2 font-semibold ${
                activeTab === 'sectors'
                  ? 'border-cyan-400 text-cyan-300 bg-atc-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              SECTORS
            </button>
          </div>

          {/* TAB 1: Targets View */}
          {activeTab === 'flights' && (
            <div className="flex-1 flex flex-col min-h-0">
              <MetricsBanner stats={statistics} />
              <FlightList
                aircraftList={filteredAircraft}
                selectedIcao24={selectedIcao24}
                sortConfig={sortConfig}
                isLive={apiStatus.source === 'LIVE'}
                onSelectAircraft={handleSelectAircraft}
                onSortChange={setSort}
                onResetFilters={resetFilters}
                onSwitchToDemo={() => setDataSource('DEMO')}
                searchQuery={filters.searchQuery}
                onSearchChange={(q) => setFilter({ searchQuery: q })}
                groundState={filters.groundState}
                onGroundStateChange={(gs) => setFilter({ groundState: gs })}
                emergencyOnly={filters.emergencyOnly}
                onToggleEmergency={() => setFilter({ emergencyOnly: !filters.emergencyOnly })}
                apiStatus={apiStatus}
              />
            </div>
          )}

          {/* TAB 2: Telemetry Filters */}
          {activeTab === 'filters' && (
            <div className="flex-1 overflow-y-auto">
              <FilterPanel
                filters={filters}
                onFilterChange={setFilter}
                onResetFilters={resetFilters}
              />
            </div>
          )}

          {/* TAB 3: Geographic Sectors & Bounds */}
          {activeTab === 'sectors' && (
            <div className="flex-1 overflow-y-auto">
              <RegionSelector
                currentRegionId={currentRegion.id}
                activeBounds={activeBounds}
                viewportSyncEnabled={viewportSyncEnabled}
                onSelectRegion={setRegion}
                onApplyCustomBounds={setCustomBounds}
                onToggleViewportSync={setViewportSync}
              />
            </div>
          )}
        </aside>

        {/* Center: Primary Surveillance Radar Map */}
        <main className="flex-1 relative h-full">
          {/* Floating Empty / Cloud-Blocked Alert Pill on Map */}
          {filteredAircraft.length === 0 && apiStatus.status === 'ERROR' && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2 rounded-full bg-atc-950/95 border border-amber-500/50 shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs font-mono text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
              <span>Live feed restricted (Cloud datacenter IP policy)</span>
              <button
                onClick={() => setDataSource('DEMO')}
                className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition"
              >
                Launch Demo Radar
              </button>
            </div>
          )}

          <RadarMap
            aircraftList={filteredAircraft}
            selectedIcao24={selectedIcao24}
            selectedHistory={selectedHistory}
            currentRegion={currentRegion}
            activeBounds={activeBounds}
            viewportSyncEnabled={viewportSyncEnabled}
            tileProviderKey={tileProviderKey}
            showTrail={showTrail}
            showBoundsRectangle={showBoundsRectangle}
            mapCenterTarget={mapCenterTarget}
            onSelectAircraft={handleSelectAircraft}
            onViewportChange={updateBoundsFromViewport}
            onTileProviderChange={setTileProvider}
            onToggleTrail={toggleTrail}
            onToggleBoundsRectangle={toggleBoundsRectangle}
            onClearCenterTarget={clearCenterTarget}
          />
        </main>

        {/* DESKTOP Right Drawer: Selected Flight Telemetry HUD */}
        {selectedAircraft && (
          <div className="hidden md:flex absolute right-0 top-0 bottom-0 z-30">
            <FlightDetailPanel
              aircraft={selectedAircraft}
              history={selectedHistory}
              onClose={() => selectAircraft(null)}
              onCenterOnMap={handleCenterOnMap}
              onClearHistory={clearHistory}
            />
          </div>
        )}

        {/* MOBILE Slide-up Bottom Sheet Drawer */}
        {mobileSheet !== 'none' && (
          <div className="md:hidden fixed inset-x-0 bottom-16 top-16 z-30 flex flex-col bg-atc-900/98 border-t border-atc-700 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom duration-200">
            {/* Sheet Handle & Close Header */}
            <div className="px-4 py-2 bg-atc-950 border-b border-atc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
                  {mobileSheet === 'flights' && `Active Targets (${filteredAircraft.length})`}
                  {mobileSheet === 'filters' && 'Telemetry Filters & Sector'}
                  {mobileSheet === 'telemetry' && (selectedAircraft ? selectedAircraft.callsign : 'Flight Inspector')}
                </span>
              </div>

              <button
                onClick={() => setMobileSheet('none')}
                className="p-1 rounded bg-atc-800 text-slate-400 hover:text-white"
                aria-label="Close Sheet"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sheet Content Body */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {mobileSheet === 'flights' && (
                <div className="flex flex-col h-full">
                  <MetricsBanner stats={statistics} />
                  <FlightList
                    aircraftList={filteredAircraft}
                    selectedIcao24={selectedIcao24}
                    sortConfig={sortConfig}
                    isLive={apiStatus.source === 'LIVE'}
                    onSelectAircraft={handleSelectAircraft}
                    onSortChange={setSort}
                    onResetFilters={resetFilters}
                    onSwitchToDemo={() => setDataSource('DEMO')}
                    searchQuery={filters.searchQuery}
                    onSearchChange={(q) => setFilter({ searchQuery: q })}
                    groundState={filters.groundState}
                    onGroundStateChange={(gs) => setFilter({ groundState: gs })}
                    emergencyOnly={filters.emergencyOnly}
                    onToggleEmergency={() => setFilter({ emergencyOnly: !filters.emergencyOnly })}
                    apiStatus={apiStatus}
                  />
                </div>
              )}

              {mobileSheet === 'filters' && (
                <div className="p-2 space-y-4">
                  <FilterPanel
                    filters={filters}
                    onFilterChange={setFilter}
                    onResetFilters={resetFilters}
                  />
                  <RegionSelector
                    currentRegionId={currentRegion.id}
                    activeBounds={activeBounds}
                    viewportSyncEnabled={viewportSyncEnabled}
                    onSelectRegion={setRegion}
                    onApplyCustomBounds={setCustomBounds}
                    onToggleViewportSync={setViewportSync}
                  />
                </div>
              )}

              {mobileSheet === 'telemetry' && selectedAircraft && (
                <FlightDetailPanel
                  aircraft={selectedAircraft}
                  history={selectedHistory}
                  onClose={() => {
                    selectAircraft(null);
                    setMobileSheet('none');
                  }}
                  onCenterOnMap={(lat, lon) => {
                    handleCenterOnMap(lat, lon);
                    setMobileSheet('none');
                  }}
                  onClearHistory={clearHistory}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE Tactical Bottom Navigation Bar (screens < 768px) */}
      <nav className="md:hidden flex items-center justify-around h-16 bg-atc-950 border-t border-atc-800 z-40 px-2 shrink-0 select-none">
        {/* Radar Map view */}
        <button
          onClick={() => setMobileSheet('none')}
          className={`flex flex-col items-center justify-center w-16 py-1 rounded transition ${
            mobileSheet === 'none' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Radio className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-mono">Radar</span>
        </button>

        {/* Targets view */}
        <button
          onClick={() => setMobileSheet(mobileSheet === 'flights' ? 'none' : 'flights')}
          className={`relative flex flex-col items-center justify-center w-16 py-1 rounded transition ${
            mobileSheet === 'flights' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Plane className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-mono">Targets</span>
          {filteredAircraft.length > 0 && (
            <span className="absolute top-0 right-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-cyan-900 border border-cyan-500 text-cyan-200">
              {filteredAircraft.length}
            </span>
          )}
        </button>

        {/* Filters & Sectors view */}
        <button
          onClick={() => setMobileSheet(mobileSheet === 'filters' ? 'none' : 'filters')}
          className={`relative flex flex-col items-center justify-center w-16 py-1 rounded transition ${
            mobileSheet === 'filters' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-mono">Filters</span>
          {activeFilterCount > 0 && (
            <span className="absolute top-0 right-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-indigo-900 border border-indigo-500 text-indigo-200">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Telemetry HUD view */}
        <button
          onClick={() => {
            if (selectedAircraft) {
              setMobileSheet(mobileSheet === 'telemetry' ? 'none' : 'telemetry');
            }
          }}
          disabled={!selectedAircraft}
          className={`flex flex-col items-center justify-center w-16 py-1 rounded transition ${
            !selectedAircraft
              ? 'opacity-30 text-slate-600'
              : mobileSheet === 'telemetry'
              ? 'text-cyan-400 font-semibold'
              : 'text-slate-300'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-mono">
            {selectedAircraft ? selectedAircraft.callsign.slice(0, 6) : 'Telemetry'}
          </span>
        </button>
      </nav>
    </div>
  );
};

export default App;
