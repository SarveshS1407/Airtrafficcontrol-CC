import React from 'react';
import { useAtcStore } from '../../store/useAtcStore';
import { Aircraft, AircraftObservation } from '../../types/opensky';
import { BoundingBox, RegionPreset } from '../../types/geo';
import { RadarMap } from './RadarMap';
import { GoogleRadarMap } from './GoogleRadarMap';
import { LocationSearchControl } from '../Location/LocationSearchControl';
import { LocationMonitorPanel } from '../Location/LocationMonitorPanel';
import { Globe2, Map as MapIcon, Crosshair } from 'lucide-react';
import { GeocodedLocationResult } from '../../services/googleMapsLoader';

interface UnifiedMapProps {
  aircraftList: Aircraft[];
  selectedIcao24: string | null;
  selectedHistory: AircraftObservation[];
  currentRegion: RegionPreset;
  activeBounds: BoundingBox;
  viewportSyncEnabled: boolean;
  tileProviderKey: 'osmDark' | 'osmStandard' | 'osmHot';
  showTrail: boolean;
  showBoundsRectangle: boolean;
  mapCenterTarget?: [number, number] | null;
  onSelectAircraft: (icao24: string | null) => void;
  onViewportChange: (bounds: BoundingBox) => void;
  onTileProviderChange: (key: 'osmDark' | 'osmStandard' | 'osmHot') => void;
  onToggleTrail: () => void;
  onToggleBoundsRectangle: () => void;
  onResetGlobalView?: () => void;
  onClearCenterTarget?: () => void;
}

export const UnifiedMap: React.FC<UnifiedMapProps> = (props) => {
  const {
    mapEngine,
    setMapEngine,
    monitoringTarget,
    setMonitoringTarget,
    setMonitoringRadius,
  } = useAtcStore();

  const handleSelectLocation = (loc: GeocodedLocationResult) => {
    setMonitoringTarget({
      name: loc.name,
      lat: loc.lat,
      lng: loc.lng,
      radiusKm: 50,
    });
  };

  const handleMapClick = (lat: number, lng: number, placeName?: string) => {
    setMonitoringTarget({
      name: placeName || `Sector ${lat.toFixed(2)}°, ${lng.toFixed(2)}°`,
      lat,
      lng,
      radiusKm: monitoringTarget?.radiusKm || 50,
    });
  };

  const handleClearMonitoring = () => {
    setMonitoringTarget(null);
    props.onResetGlobalView?.();
  };

  return (
    <div className="relative w-full h-full min-w-0 min-h-0 overflow-hidden bg-[#EBF3FA]">
      {/* 1. Master Map Engine Rendering */}
      {mapEngine === 'google' ? (
        <GoogleRadarMap
          aircraftList={props.aircraftList}
          selectedIcao24={props.selectedIcao24}
          selectedHistory={props.selectedHistory}
          currentRegion={props.currentRegion}
          activeBounds={props.activeBounds}
          monitoringTarget={monitoringTarget}
          viewportSyncEnabled={props.viewportSyncEnabled}
          showTrail={props.showTrail}
          mapCenterTarget={props.mapCenterTarget}
          onSelectAircraft={props.onSelectAircraft}
          onViewportChange={props.onViewportChange}
          onMapClick={handleMapClick}
          onClearCenterTarget={props.onClearCenterTarget}
          onSwitchToLeaflet={() => setMapEngine('leaflet')}
        />
      ) : (
        <RadarMap
          aircraftList={props.aircraftList}
          selectedIcao24={props.selectedIcao24}
          selectedHistory={props.selectedHistory}
          currentRegion={props.currentRegion}
          activeBounds={props.activeBounds}
          monitoringTarget={monitoringTarget}
          viewportSyncEnabled={props.viewportSyncEnabled}
          tileProviderKey={props.tileProviderKey}
          showTrail={props.showTrail}
          showBoundsRectangle={props.showBoundsRectangle}
          mapCenterTarget={props.mapCenterTarget}
          onSelectAircraft={props.onSelectAircraft}
          onViewportChange={props.onViewportChange}
          onTileProviderChange={props.onTileProviderChange}
          onToggleTrail={props.onToggleTrail}
          onToggleBoundsRectangle={props.onToggleBoundsRectangle}
          onResetGlobalView={props.onResetGlobalView}
          onClearCenterTarget={props.onClearCenterTarget}
          onMapClick={handleMapClick}
        />
      )}

      {/* 2. Top-Left Floating Location Search Control */}
      <div className="absolute top-3 left-3 z-20 w-72 sm:w-80">
        <LocationSearchControl onSelectLocation={handleSelectLocation} />
      </div>

      {/* 3. Top-Right Secondary Map Controls */}
      <div className="absolute top-3 right-14 sm:right-16 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-md font-sans text-xs">
        {props.currentRegion.id !== 'global' && (
          <button
            onClick={props.onResetGlobalView}
            className="px-2.5 py-1.5 rounded-lg text-slate-700 hover:text-aviation-navy hover:bg-slate-100 font-medium transition flex items-center gap-1.5"
            title="Reset to global view"
          >
            <Globe2 className="w-3.5 h-3.5 text-aviation-navy" />
            <span className="hidden sm:inline">World View</span>
          </button>
        )}
        <div className="h-4 w-px bg-slate-200 hidden sm:block" />
        <button
          onClick={() => setMapEngine(mapEngine === 'google' ? 'leaflet' : 'google')}
          className="px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-aviation-navy hover:bg-slate-100 transition flex items-center gap-1.5 font-medium text-[11px]"
          title="Toggle map cartography engine"
        >
          {mapEngine === 'google' ? (
            <>
              <Globe2 className="w-3.5 h-3.5 text-aviation-navy" />
              <span>Google Maps</span>
            </>
          ) : (
            <>
              <MapIcon className="w-3.5 h-3.5 text-aviation-navy" />
              <span>OpenStreetMap</span>
            </>
          )}
        </button>
      </div>

      {/* 4. Floating Location Monitor HUD Card */}
      {monitoringTarget && (
        <div className="absolute top-16 left-3 sm:left-auto sm:right-3 z-20 animate-slideDown">
          <LocationMonitorPanel
            target={monitoringTarget}
            aircraftList={props.aircraftList}
            onSelectRadius={setMonitoringRadius}
            onClear={handleClearMonitoring}
            onSelectAircraft={props.onSelectAircraft}
          />
        </div>
      )}

      {/* 5. Click-to-Monitor Instruction Prompt Hint */}
      {!monitoringTarget && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 text-slate-600 text-xs font-sans backdrop-blur-md shadow-sm">
          <Crosshair className="w-3.5 h-3.5 text-aviation-navy" />
          <span>Click anywhere on the map to explore nearby flights</span>
        </div>
      )}
    </div>
  );
};
