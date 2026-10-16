import React, { useEffect, useState, useCallback } from 'react';
import { useAtcStore } from './store/useAtcStore';
import { AtcHeader } from './components/Header/AtcHeader';
import { StaleDataAlert } from './components/Common/StaleDataAlert';
import { MetricsBanner } from './components/Sidebar/MetricsBanner';
import { RegionSelector } from './components/Sidebar/RegionSelector';
import { FilterPanel } from './components/Sidebar/FilterPanel';
import { FlightList } from './components/Sidebar/FlightList';
import { RadarMap } from './components/Map/RadarMap';
import { FlightDetailPanel } from './components/Telemetry/FlightDetailPanel';

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
  } = useAtcStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Initial fetch on mount
  useEffect(() => {
    fetchAircraftSnapshot(true);
  }, []);

  // Polling Interval Lifecycle with controlled timer and cleanup
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
      // Don't trigger shortcuts if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 'Escape') {
        selectAircraft(null);
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

  const handleCenterOnMap = useCallback((_lat: number, _lon: number) => {
    // Aircraft center action handled via selected state
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-atc-950 text-slate-100 font-sans select-none">
      {/* Tactical Radar Header */}
      <AtcHeader
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
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
        {/* Left Sidebar: Controls, Filters & Flight List */}
        <aside
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } absolute md:relative z-20 flex flex-col w-80 md:w-96 h-full bg-atc-900 border-r border-atc-800 transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none`}
        >
          {/* Key Aviation Metrics */}
          <MetricsBanner stats={statistics} />

          {/* Geographic Sector Selector */}
          <RegionSelector
            currentRegionId={currentRegion.id}
            activeBounds={activeBounds}
            viewportSyncEnabled={viewportSyncEnabled}
            onSelectRegion={setRegion}
            onApplyCustomBounds={setCustomBounds}
            onToggleViewportSync={setViewportSync}
          />

          {/* Telemetry Filters */}
          <FilterPanel
            filters={filters}
            onFilterChange={setFilter}
            onResetFilters={resetFilters}
          />

          {/* Searchable Target List */}
          <FlightList
            aircraftList={filteredAircraft}
            selectedIcao24={selectedIcao24}
            sortConfig={sortConfig}
            onSelectAircraft={selectAircraft}
            onSortChange={setSort}
            onResetFilters={resetFilters}
          />
        </aside>

        {/* Center: Interactive Radar Map */}
        <main className="flex-1 relative h-full">
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
            onSelectAircraft={selectAircraft}
            onViewportChange={updateBoundsFromViewport}
            onTileProviderChange={setTileProvider}
            onToggleTrail={toggleTrail}
            onToggleBoundsRectangle={toggleBoundsRectangle}
          />
        </main>

        {/* Right Drawer: Selected Flight Telemetry HUD */}
        {selectedAircraft && (
          <div className="absolute right-0 top-0 bottom-0 z-30 flex">
            <FlightDetailPanel
              aircraft={selectedAircraft}
              history={selectedHistory}
              onClose={() => selectAircraft(null)}
              onCenterOnMap={handleCenterOnMap}
              onClearHistory={clearHistory}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
