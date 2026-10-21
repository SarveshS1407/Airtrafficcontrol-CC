import React, { useEffect, useState, useCallback } from 'react';
import {
  Plane,
  Filter,
  MapPin,
  Radio,
  Compass,
  X,
  BarChart3,
  Settings,
  Star,
  Globe2,
  UserCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAtcStore } from '../store/useAtcStore';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from '../router/Router';
import { AtcHeader } from '../components/Header/AtcHeader';
import { StaleDataAlert } from '../components/Common/StaleDataAlert';
import { MetricsBanner } from '../components/Sidebar/MetricsBanner';
import { RegionSelector } from '../components/Sidebar/RegionSelector';
import { FilterPanel } from '../components/Sidebar/FilterPanel';
import { FlightList } from '../components/Sidebar/FlightList';
import { UnifiedMap } from '../components/Map/UnifiedMap';
import { FlightDetailPanel } from '../components/Telemetry/FlightDetailPanel';
import { FleetAnalyticsView } from '../components/Analytics/FleetAnalyticsView';
import { AirspaceSettingsView } from '../components/Settings/AirspaceSettingsView';
import { PRESET_REGIONS } from '../constants/regions';

type DashboardView = 'radar' | 'analytics' | 'settings';
type SidebarTab = 'flights' | 'filters' | 'sectors' | 'watchlist';
type MobileSheet = 'none' | 'flights' | 'filters' | 'telemetry';

export const DashboardPage: React.FC = () => {
  const { currentUser, isAuthenticated, signOut, toggleWatchlist } = useAuthStore();

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

  const [activeView, setActiveView] = useState<DashboardView>('radar');
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
  }, [fetchAircraftSnapshot, isPollingPaused, pollingIntervalMs]);

  // Keyboard shortcut listener (Space = pause/play, R = refresh, Esc = close inspector)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        useAtcStore.getState().togglePollingPause();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        fetchAircraftSnapshot(true);
      } else if (e.key === 'Escape') {
        selectAircraft(null);
        setMobileSheet('none');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fetchAircraftSnapshot, selectAircraft]);

  const allFilteredAircraft = getFilteredAircraftList();
  const stats = getStatistics();
  const selectedData = getSelectedAircraft();
  const selectedAircraft = selectedData.aircraft;
  const historyObservations = selectedData.history;

  // Watchlist filter
  const watchlistAircraft = allFilteredAircraft.filter((a) =>
    currentUser?.watchlist.includes(a.icao24.toLowerCase())
  );

  const handleSelectAircraft = useCallback(
    (icao24: string | null) => {
      selectAircraft(icao24);
      if (icao24) {
        setMobileSheet('telemetry');
      }
    },
    [selectAircraft]
  );

  const handleResetGlobalView = useCallback(() => {
    setRegion('global');
  }, [setRegion]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-aviation-cloud text-aviation-slate font-sans">
      {/* 1. Universal Top Navigation Bar */}
      <header className="bg-aviation-navy border-b border-aviation-midnight px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3 text-white z-30 select-none shadow-sm">
        {/* Left: Branding & Return to Landing */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2.5 group text-slate-200 hover:text-white transition"
            title="Return to Landing Page"
          >
            <div className="w-8 h-8 rounded-xl bg-aviation-sky flex items-center justify-center shadow-xs">
              <Radio className="w-4 h-4 text-aviation-navy animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm tracking-tight text-white">
                <span>AirTrafficControl</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 text-blue-100 font-semibold">
                  CC
                </span>
              </div>
              <span className="text-[10px] text-blue-200/70 block font-normal">Global Flight Monitoring</span>
            </div>
          </Link>

          <span className="h-5 w-px bg-white/20 hidden md:block" />

          {/* Sub-view Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-aviation-midnight/60 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveView('radar')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 font-medium ${
                activeView === 'radar'
                  ? 'bg-white text-aviation-navy font-semibold shadow-xs'
                  : 'text-blue-100/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Live Radar</span>
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 font-medium ${
                activeView === 'analytics'
                  ? 'bg-white text-aviation-navy font-semibold shadow-xs'
                  : 'text-blue-100/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Fleet Analytics</span>
            </button>
            <button
              onClick={() => setActiveView('settings')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 font-medium ${
                activeView === 'settings'
                  ? 'bg-white text-aviation-navy font-semibold shadow-xs'
                  : 'text-blue-100/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Center: Global/Sector Quick Switcher & Reset */}
        <div className="hidden lg:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 bg-aviation-midnight/60 border border-white/15 rounded-xl px-3 py-1.5 text-white">
            <Globe2 className="w-3.5 h-3.5 text-aviation-sky" />
            <select
              value={currentRegion.id}
              onChange={(e) => setRegion(e.target.value)}
              className="bg-transparent text-white text-xs focus:outline-none cursor-pointer font-medium"
            >
              {PRESET_REGIONS.map((r) => (
                <option key={r.id} value={r.id} className="bg-aviation-midnight text-white">
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {currentRegion.id !== 'global' && (
            <button
              onClick={handleResetGlobalView}
              className="px-3 py-1.5 rounded-xl bg-aviation-sky/20 border border-aviation-sky/40 text-blue-100 hover:bg-aviation-sky/30 transition flex items-center gap-1.5 text-xs font-medium"
              title="Reset to Worldwide Global View"
            >
              <Globe2 className="w-3.5 h-3.5 text-aviation-sky" />
              <span>Reset Global</span>
            </button>
          )}
        </div>

        {/* Right: Auth Profile / Sign In */}
        <div className="flex items-center gap-3">
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-2 text-xs">
              <div className="hidden sm:flex items-center gap-2 bg-aviation-midnight/60 border border-white/15 rounded-xl px-3 py-1.5">
                <UserCheck className="w-3.5 h-3.5 text-aviation-green" />
                <span className="text-white font-medium">{currentUser.callsign}</span>
                {currentUser.watchlist.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-aviation-navy font-bold flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-aviation-navy" />
                    {currentUser.watchlist.length}
                  </span>
                )}
              </div>
              <button
                onClick={signOut}
                className="p-2 rounded-xl bg-aviation-midnight/60 hover:bg-red-900/60 border border-white/15 text-slate-300 hover:text-white transition"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <Link
                to="/signin"
                className="px-3.5 py-1.5 rounded-xl bg-white text-aviation-navy font-semibold hover:bg-blue-50 transition shadow-xs"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* 2. Main Workspace Display Area */}
      {activeView === 'analytics' ? (
        <FleetAnalyticsView
          aircraftList={allFilteredAircraft}
          onSelectAircraft={(icao) => {
            selectAircraft(icao);
            setActiveView('radar');
          }}
          onClose={() => setActiveView('radar')}
        />
      ) : activeView === 'settings' ? (
        <AirspaceSettingsView onClose={() => setActiveView('radar')} />
      ) : (
        /* Radar Surveillance View */
        <div className="flex-1 flex flex-col min-h-0 relative">
          {/* ATC Header controls */}
          <AtcHeader
            onToggleSidebar={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
            isSidebarOpen={isDesktopSidebarOpen}
          />

          {/* Stale Data / Cloud Egress Alert Banner */}
          <StaleDataAlert
            apiStatus={apiStatus}
            aircraftCount={allFilteredAircraft.length}
            onRetry={() => fetchAircraftSnapshot(true)}
            onSwitchToDemo={() => setDataSource('DEMO')}
          />

          {/* Middle Body: Sidebar + Map + Telemetry Drawer */}
          <div className="flex-1 flex min-h-0 relative overflow-hidden">
            {/* Desktop Collapsible Left Sidebar */}
            <aside
              className={`${
                isDesktopSidebarOpen ? 'w-80 lg:w-96' : 'w-0'
              } hidden md:flex flex-col border-r border-aviation-border bg-white transition-all duration-200 z-20 shrink-0 overflow-hidden shadow-xs`}
            >
              {/* Metrics Banner */}
              <MetricsBanner stats={stats} lastUpdated={apiStatus.lastSuccessfulFetch} />

              {/* Sidebar Tabs */}
              <div className="flex items-center border-b border-aviation-border bg-aviation-cloud/50 text-xs font-medium">
                <button
                  onClick={() => setActiveTab('flights')}
                  className={`flex-1 py-2.5 px-2 text-center transition flex items-center justify-center gap-1.5 border-b-2 ${
                    activeTab === 'flights'
                      ? 'border-aviation-navy text-aviation-navy bg-white font-semibold'
                      : 'border-transparent text-aviation-muted hover:text-aviation-navy hover:bg-white/50'
                  }`}
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>Targets ({allFilteredAircraft.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('filters')}
                  className={`flex-1 py-2.5 px-2 text-center transition flex items-center justify-center gap-1.5 border-b-2 ${
                    activeTab === 'filters'
                      ? 'border-aviation-navy text-aviation-navy bg-white font-semibold'
                      : 'border-transparent text-aviation-muted hover:text-aviation-navy hover:bg-white/50'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>

                <button
                  onClick={() => setActiveTab('sectors')}
                  className={`flex-1 py-2.5 px-2 text-center transition flex items-center justify-center gap-1.5 border-b-2 ${
                    activeTab === 'sectors'
                      ? 'border-aviation-navy text-aviation-navy bg-white font-semibold'
                      : 'border-transparent text-aviation-muted hover:text-aviation-navy hover:bg-white/50'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Sectors</span>
                </button>

                {currentUser && (
                  <button
                    onClick={() => setActiveTab('watchlist')}
                    className={`py-2.5 px-3 text-center transition flex items-center justify-center gap-1 border-b-2 ${
                      activeTab === 'watchlist'
                        ? 'border-aviation-amber text-aviation-amber bg-white font-semibold'
                        : 'border-transparent text-aviation-muted hover:text-aviation-navy hover:bg-white/50'
                    }`}
                    title="Watchlist Flights"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>({currentUser.watchlist.length})</span>
                  </button>
                )}
              </div>

              {/* Tab Content Panes */}
              <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
                {activeTab === 'flights' && (
                  <FlightList
                    aircraftList={allFilteredAircraft}
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
                    watchlist={currentUser?.watchlist}
                    onToggleWatchlist={toggleWatchlist}
                  />
                )}

                {activeTab === 'watchlist' && (
                  <div className="flex-1 flex flex-col min-h-0 bg-aviation-cloud/30">
                    <div className="p-3 bg-white border-b border-aviation-border text-xs text-aviation-muted">
                      <span className="font-semibold text-aviation-navy flex items-center gap-1.5 mb-0.5">
                        <Star className="w-3.5 h-3.5 text-aviation-amber fill-aviation-amber" />
                        Watchlist ({watchlistAircraft.length})
                      </span>
                      <span>Aircraft pinned to your observation list.</span>
                    </div>
                    {watchlistAircraft.length === 0 ? (
                      <div className="p-8 text-center text-xs text-aviation-muted space-y-2">
                        <Star className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="font-medium text-aviation-navy">No flights currently pinned.</p>
                        <p className="text-xs text-aviation-muted">
                          Click the star icon next to any aircraft in the Targets list to pin it.
                        </p>
                      </div>
                    ) : (
                      <FlightList
                        aircraftList={watchlistAircraft}
                        selectedIcao24={selectedIcao24}
                        sortConfig={sortConfig}
                        isLive={apiStatus.source === 'LIVE'}
                        onSelectAircraft={handleSelectAircraft}
                        onSortChange={setSort}
                        onResetFilters={resetFilters}
                        searchQuery={filters.searchQuery}
                        onSearchChange={(q) => setFilter({ searchQuery: q })}
                        groundState={filters.groundState}
                        onGroundStateChange={(gs) => setFilter({ groundState: gs })}
                        emergencyOnly={filters.emergencyOnly}
                        onToggleEmergency={() => setFilter({ emergencyOnly: !filters.emergencyOnly })}
                        apiStatus={apiStatus}
                        watchlist={currentUser?.watchlist}
                        onToggleWatchlist={toggleWatchlist}
                      />
                    )}
                  </div>
                )}

                {activeTab === 'filters' && (
                  <FilterPanel
                    filters={filters}
                    onFilterChange={setFilter}
                    onResetFilters={resetFilters}
                  />
                )}

                {activeTab === 'sectors' && (
                  <div className="flex-1 p-3 space-y-3 text-xs bg-aviation-cloud/30">
                    <RegionSelector
                      currentRegionId={currentRegion.id}
                      activeBounds={activeBounds}
                      viewportSyncEnabled={viewportSyncEnabled}
                      onSelectRegion={setRegion}
                      onApplyCustomBounds={setCustomBounds}
                      onToggleViewportSync={setViewportSync}
                    />

                    {/* Sector Teleport Cards */}
                    <div className="p-2 space-y-2">
                      <span className="text-[11px] text-aviation-muted uppercase font-bold px-1 block">
                        Quick Airspace Selection
                      </span>
                      {PRESET_REGIONS.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setRegion(r.id)}
                          className={`w-full p-2.5 rounded-xl text-left transition border shadow-2xs ${
                            currentRegion.id === r.id
                              ? 'bg-aviation-lightSky border-aviation-sky text-aviation-navy font-semibold ring-1 ring-aviation-sky/30'
                              : 'bg-white border-aviation-border text-aviation-slate hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between font-medium text-xs text-aviation-navy">
                            <span>{r.name}</span>
                            <span className="text-[11px] font-normal text-aviation-muted">{r.country}</span>
                          </div>
                          <span className="text-[11px] text-aviation-muted block truncate mt-0.5">
                            {r.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* Desktop Sidebar Toggle Button */}
            <button
              onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
              className="hidden md:flex absolute top-1/2 left-0 -translate-y-1/2 z-30 p-2 rounded-r-xl bg-white hover:bg-slate-50 border border-l-0 border-aviation-border text-aviation-navy shadow-md transition"
              style={{ left: isDesktopSidebarOpen ? (window.innerWidth >= 1024 ? '384px' : '320px') : '0px' }}
              title={isDesktopSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              {isDesktopSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {/* Central Radar Map Workspace */}
            <main className="flex-1 flex flex-col min-w-0 h-full relative">
              <UnifiedMap
                aircraftList={allFilteredAircraft}
                selectedIcao24={selectedIcao24}
                selectedHistory={historyObservations}
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
                onResetGlobalView={handleResetGlobalView}
                onClearCenterTarget={clearCenterTarget}
              />
            </main>

            {/* Telemetry Detail Drawer (Right side) */}
            {selectedAircraft && (
              <FlightDetailPanel
                aircraft={selectedAircraft}
                history={historyObservations}
                onClose={() => selectAircraft(null)}
                onClearHistory={clearHistory}
                onCenterOnMap={(lat, lon) => triggerCenterOnMap(lat, lon)}
              />
            )}
          </div>

          {/* 3. Mobile Navigation Bottom Bar */}
          <div className="md:hidden bg-white/95 border-t border-aviation-border p-1 flex items-center justify-around z-30 text-xs shadow-md backdrop-blur-md">
            <button
              onClick={() => setMobileSheet('none')}
              className={`flex-1 py-2 flex flex-col items-center gap-1 ${
                mobileSheet === 'none' ? 'text-aviation-navy font-bold' : 'text-aviation-muted'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Radar</span>
            </button>

            <button
              onClick={() => setMobileSheet('flights')}
              className={`flex-1 py-2 flex flex-col items-center gap-1 ${
                mobileSheet === 'flights' ? 'text-aviation-navy font-bold' : 'text-aviation-muted'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>Targets ({allFilteredAircraft.length})</span>
            </button>

            <button
              onClick={() => setMobileSheet('filters')}
              className={`flex-1 py-2 flex flex-col items-center gap-1 ${
                mobileSheet === 'filters' ? 'text-aviation-navy font-bold' : 'text-aviation-muted'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {selectedAircraft && (
              <button
                onClick={() => setMobileSheet('telemetry')}
                className={`flex-1 py-2 flex flex-col items-center gap-1 ${
                  mobileSheet === 'telemetry' ? 'text-aviation-navy font-bold' : 'text-aviation-muted'
                }`}
              >
                <Radio className="w-4 h-4 text-aviation-sky animate-pulse" />
                <span>Flight</span>
              </button>
            )}
          </div>

          {/* Mobile Bottom Sheets */}
          {mobileSheet === 'flights' && (
            <div className="md:hidden fixed inset-x-0 bottom-12 top-24 bg-white border-t border-aviation-border z-40 flex flex-col shadow-2xl rounded-t-2xl overflow-hidden animate-slideUp">
              <div className="p-3 bg-aviation-cloud border-b border-aviation-border flex items-center justify-between text-xs font-semibold text-aviation-navy">
                <span>Active Targets ({allFilteredAircraft.length})</span>
                <button
                  onClick={() => setMobileSheet('none')}
                  className="p-1 text-aviation-muted hover:text-aviation-navy"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FlightList
                aircraftList={allFilteredAircraft}
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
                watchlist={currentUser?.watchlist}
                onToggleWatchlist={toggleWatchlist}
              />
            </div>
          )}

          {mobileSheet === 'filters' && (
            <div className="md:hidden fixed inset-x-0 bottom-12 top-24 bg-white border-t border-aviation-border z-40 flex flex-col shadow-2xl rounded-t-2xl overflow-hidden animate-slideUp">
              <div className="p-3 bg-aviation-cloud border-b border-aviation-border flex items-center justify-between text-xs font-semibold text-aviation-navy">
                <span>Flight & Sector Filters</span>
                <button
                  onClick={() => setMobileSheet('none')}
                  className="p-1 text-aviation-muted hover:text-aviation-navy"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <RegionSelector
                  currentRegionId={currentRegion.id}
                  activeBounds={activeBounds}
                  viewportSyncEnabled={viewportSyncEnabled}
                  onSelectRegion={setRegion}
                  onApplyCustomBounds={setCustomBounds}
                  onToggleViewportSync={setViewportSync}
                />
                <FilterPanel
                  filters={filters}
                  onFilterChange={setFilter}
                  onResetFilters={resetFilters}
                />
              </div>
            </div>
          )}

          {mobileSheet === 'telemetry' && selectedAircraft && (
            <div className="md:hidden fixed inset-x-0 bottom-12 top-20 bg-white border-t border-aviation-border z-40 flex flex-col shadow-2xl rounded-t-2xl overflow-hidden animate-slideUp">
              <div className="p-3 bg-aviation-cloud border-b border-aviation-border flex items-center justify-between text-xs font-semibold text-aviation-navy">
                <span>Flight Telemetry: {selectedAircraft.callsign}</span>
                <button
                  onClick={() => setMobileSheet('none')}
                  className="p-1 text-aviation-muted hover:text-aviation-navy"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <FlightDetailPanel
                  aircraft={selectedAircraft}
                  history={historyObservations}
                  onClose={() => {
                    selectAircraft(null);
                    setMobileSheet('none');
                  }}
                  onClearHistory={clearHistory}
                  onCenterOnMap={(lat, lon) => {
                    triggerCenterOnMap(lat, lon);
                    setMobileSheet('none');
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
