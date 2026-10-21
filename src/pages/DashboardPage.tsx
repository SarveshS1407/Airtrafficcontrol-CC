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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-atc-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Universal Top Navigation Bar */}
      <header className="bg-slate-950/95 border-b border-slate-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-3 text-slate-100 z-30 select-none backdrop-blur-md">
        {/* Left: Branding & Return to Landing */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 group text-slate-400 hover:text-white transition"
            title="Return to Landing Page"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-500/40">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Radio className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-white">
                <span>ATC-CC</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                  GLOBAL
                </span>
              </div>
              <span className="text-[9px] font-mono text-slate-500 block">Surveillance Console</span>
            </div>
          </Link>

          <span className="h-5 w-px bg-slate-800 hidden md:block" />

          {/* Sub-view Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 font-mono text-xs">
            <button
              onClick={() => setActiveView('radar')}
              className={`px-2.5 py-1 rounded transition flex items-center gap-1.5 ${
                activeView === 'radar'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Live Radar</span>
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              className={`px-2.5 py-1 rounded transition flex items-center gap-1.5 ${
                activeView === 'analytics'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Fleet Analytics</span>
            </button>
            <button
              onClick={() => setActiveView('settings')}
              className={`px-2.5 py-1 rounded transition flex items-center gap-1.5 ${
                activeView === 'settings'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Center: Global/Sector Quick Switcher & Reset */}
        <div className="hidden lg:flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1">
            <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={currentRegion.id}
              onChange={(e) => setRegion(e.target.value)}
              className="bg-transparent text-slate-200 font-mono text-xs focus:outline-none cursor-pointer"
            >
              {PRESET_REGIONS.map((r) => (
                <option key={r.id} value={r.id} className="bg-slate-900 text-slate-200">
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {currentRegion.id !== 'global' && (
            <button
              onClick={handleResetGlobalView}
              className="px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/80 transition flex items-center gap-1 text-xs"
              title="Reset to Worldwide Global View"
            >
              <Globe2 className="w-3 h-3" />
              <span>Reset Global</span>
            </button>
          )}
        </div>

        {/* Right: Auth Profile / Sign In */}
        <div className="flex items-center gap-3">
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-2 font-mono text-xs">
              <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-200 font-bold">{currentUser.callsign}</span>
                {currentUser.watchlist.length > 0 && (
                  <span className="text-[10px] px-1 py-0.2 rounded bg-amber-950 border border-amber-600/50 text-amber-300 font-bold flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-300" />
                    {currentUser.watchlist.length}
                  </span>
                )}
              </div>
              <button
                onClick={signOut}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-400 transition"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 font-mono text-xs">
              <Link
                to="/signin"
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition"
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
          {/* ATC Header controls (Zulu clock, sweep, pause) */}
          <AtcHeader
            onToggleSidebar={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
            isSidebarOpen={isDesktopSidebarOpen}
          />

          {/* Floating Stale Data / Cloud Egress Alert Pill */}
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
              } hidden md:flex flex-col border-r border-atc-700/80 bg-atc-950 transition-all duration-200 z-20 shrink-0 overflow-hidden`}
            >
              {/* Metrics Banner */}
              <MetricsBanner stats={stats} />

              {/* Sidebar Tabs */}
              <div className="flex items-center border-b border-atc-800 bg-atc-900/90 text-xs font-mono font-semibold">
                <button
                  onClick={() => setActiveTab('flights')}
                  className={`flex-1 py-2 px-2 text-center transition flex items-center justify-center gap-1.5 border-b-2 ${
                    activeTab === 'flights'
                      ? 'border-cyan-400 text-cyan-300 bg-atc-950/80'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-atc-850'
                  }`}
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>TARGETS ({allFilteredAircraft.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('filters')}
                  className={`flex-1 py-2 px-2 text-center transition flex items-center justify-center gap-1.5 border-b-2 ${
                    activeTab === 'filters'
                      ? 'border-cyan-400 text-cyan-300 bg-atc-950/80'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-atc-850'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>FILTERS</span>
                </button>

                <button
                  onClick={() => setActiveTab('sectors')}
                  className={`flex-1 py-2 px-2 text-center transition flex items-center justify-center gap-1.5 border-b-2 ${
                    activeTab === 'sectors'
                      ? 'border-cyan-400 text-cyan-300 bg-atc-950/80'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-atc-850'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>SECTORS</span>
                </button>

                {currentUser && (
                  <button
                    onClick={() => setActiveTab('watchlist')}
                    className={`py-2 px-3 text-center transition flex items-center justify-center gap-1 border-b-2 ${
                      activeTab === 'watchlist'
                        ? 'border-amber-400 text-amber-300 bg-atc-950/80'
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-atc-850'
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
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="p-3 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
                      <span className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        CONTROLLER WATCHLIST ({watchlistAircraft.length})
                      </span>
                      <span>Aircraft pinned to your active observation list.</span>
                    </div>
                    {watchlistAircraft.length === 0 ? (
                      <div className="p-8 text-center text-xs font-mono text-slate-500 space-y-2">
                        <Star className="w-8 h-8 text-slate-700 mx-auto" />
                        <p>No flights currently pinned.</p>
                        <p className="text-[11px] text-slate-600">
                          Click the star icon next to any aircraft in the TARGETS list to pin it.
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
                  <div className="flex-1 p-2 space-y-3 font-mono text-xs">
                    <RegionSelector
                      currentRegionId={currentRegion.id}
                      activeBounds={activeBounds}
                      viewportSyncEnabled={viewportSyncEnabled}
                      onSelectRegion={setRegion}
                      onApplyCustomBounds={setCustomBounds}
                      onToggleViewportSync={setViewportSync}
                    />

                    {/* Sector Teleport Cards */}
                    <div className="p-2 space-y-1.5">
                      <span className="text-[10px] text-slate-500 uppercase font-bold px-1 block">
                        Quick Airspace Teleport
                      </span>
                      {PRESET_REGIONS.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setRegion(r.id)}
                          className={`w-full p-2 rounded-lg text-left transition border ${
                            currentRegion.id === r.id
                              ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-200'
                              : 'bg-atc-900 border-atc-800 text-slate-400 hover:text-slate-200 hover:border-atc-700'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-xs">
                            <span>{r.name}</span>
                            <span className="text-[10px] font-normal text-slate-500">{r.country}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 block truncate mt-0.5">
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
              className="hidden md:flex absolute top-1/2 left-0 -translate-y-1/2 z-30 p-1.5 rounded-r bg-atc-950/90 hover:bg-atc-900 border border-l-0 border-atc-700 text-slate-400 hover:text-white shadow-xl transition"
              style={{ left: isDesktopSidebarOpen ? (window.innerWidth >= 1024 ? '384px' : '320px') : '0px' }}
              title={isDesktopSidebarOpen ? 'Collapse Surveillance Dock' : 'Expand Surveillance Dock'}
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
          <div className="md:hidden bg-atc-950/95 border-t border-atc-800 p-1 flex items-center justify-around z-30 font-mono text-[10px]">
            <button
              onClick={() => setMobileSheet('none')}
              className={`flex-1 py-1.5 flex flex-col items-center gap-1 ${
                mobileSheet === 'none' ? 'text-cyan-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Radar</span>
            </button>

            <button
              onClick={() => setMobileSheet('flights')}
              className={`flex-1 py-1.5 flex flex-col items-center gap-1 ${
                mobileSheet === 'flights' ? 'text-cyan-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>Targets ({allFilteredAircraft.length})</span>
            </button>

            <button
              onClick={() => setMobileSheet('filters')}
              className={`flex-1 py-1.5 flex flex-col items-center gap-1 ${
                mobileSheet === 'filters' ? 'text-cyan-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {selectedAircraft && (
              <button
                onClick={() => setMobileSheet('telemetry')}
                className={`flex-1 py-1.5 flex flex-col items-center gap-1 ${
                  mobileSheet === 'telemetry' ? 'text-cyan-400 font-bold' : 'text-slate-400'
                }`}
              >
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Flight</span>
              </button>
            )}
          </div>

          {/* Mobile Bottom Sheets */}
          {mobileSheet === 'flights' && (
            <div className="md:hidden fixed inset-x-0 bottom-12 top-24 bg-atc-950 border-t border-atc-700 z-40 flex flex-col shadow-2xl rounded-t-2xl overflow-hidden animate-slideUp">
              <div className="p-3 bg-atc-900 border-b border-atc-800 flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-slate-200">ACTIVE TARGETS ({allFilteredAircraft.length})</span>
                <button
                  onClick={() => setMobileSheet('none')}
                  className="p-1 text-slate-400 hover:text-white"
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
            <div className="md:hidden fixed inset-x-0 bottom-12 top-24 bg-atc-950 border-t border-atc-700 z-40 flex flex-col shadow-2xl rounded-t-2xl overflow-hidden animate-slideUp">
              <div className="p-3 bg-atc-900 border-b border-atc-800 flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-slate-200">TELEMETRY & SECTOR FILTERS</span>
                <button
                  onClick={() => setMobileSheet('none')}
                  className="p-1 text-slate-400 hover:text-white"
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
            <div className="md:hidden fixed inset-x-0 bottom-12 top-20 bg-atc-950 border-t border-atc-700 z-40 flex flex-col shadow-2xl rounded-t-2xl overflow-hidden animate-slideUp">
              <div className="p-3 bg-atc-900 border-b border-atc-800 flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-cyan-300">TELEMETRY: {selectedAircraft.callsign}</span>
                <button
                  onClick={() => setMobileSheet('none')}
                  className="p-1 text-slate-400 hover:text-white"
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
