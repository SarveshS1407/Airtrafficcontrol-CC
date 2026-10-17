import React, { useState } from 'react';
import {
  Layers,
  Crosshair,
  Maximize2,
  RotateCcw,
  Square,
  Spline,
} from 'lucide-react';
import { ATC_CONFIG } from '../../constants/config';

interface MapControlsProps {
  tileProviderKey: 'osmDark' | 'osmStandard' | 'osmHot';
  showTrail: boolean;
  showBoundsRectangle: boolean;
  hasSelectedAircraft: boolean;
  aircraftCount: number;
  onTileProviderChange: (key: 'osmDark' | 'osmStandard' | 'osmHot') => void;
  onFitAllAircraft: () => void;
  onCenterSelected: () => void;
  onResetSectorView: () => void;
  onToggleTrail: () => void;
  onToggleBoundsRectangle: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  tileProviderKey,
  showTrail,
  showBoundsRectangle,
  hasSelectedAircraft,
  aircraftCount,
  onTileProviderChange,
  onFitAllAircraft,
  onCenterSelected,
  onResetSectorView,
  onToggleTrail,
  onToggleBoundsRectangle,
}) => {
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000] select-none">
      {/* Layer selector button */}
      <div className="relative">
        <button
          onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
          className={`p-2 rounded bg-atc-950/90 hover:bg-atc-900 border text-slate-300 hover:text-white shadow-lg backdrop-blur-md transition ${
            isLayerMenuOpen ? 'border-cyan-500 text-cyan-300' : 'border-atc-700'
          }`}
          title="Switch Map Tiles"
          aria-label="Switch Map Tiles"
        >
          <Layers className="w-4 h-4" />
        </button>

        {isLayerMenuOpen && (
          <div className="absolute right-full top-0 mr-2 w-52 p-2 rounded bg-atc-950/95 border border-atc-700 shadow-xl backdrop-blur-md text-xs font-mono space-y-1">
            <span className="text-[10px] uppercase text-slate-500 font-semibold px-2 block">
              Basemap Tiles
            </span>
            {Object.entries(ATC_CONFIG.TILE_PROVIDERS).map(([key, provider]) => (
              <button
                key={key}
                onClick={() => {
                  onTileProviderChange(key as 'osmDark' | 'osmStandard' | 'osmHot');
                  setIsLayerMenuOpen(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded transition ${
                  tileProviderKey === key
                    ? 'bg-cyan-900/40 text-cyan-300 font-semibold border border-cyan-500/40'
                    : 'text-slate-300 hover:bg-atc-900 hover:text-white'
                }`}
              >
                {provider.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fit all aircraft */}
      <button
        onClick={onFitAllAircraft}
        disabled={aircraftCount === 0}
        className="p-2 rounded bg-atc-950/90 hover:bg-atc-900 border border-atc-700 text-slate-300 hover:text-white shadow-lg backdrop-blur-md transition disabled:opacity-40"
        title="Fit All Aircraft in View"
        aria-label="Fit All Aircraft in View"
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      {/* Center on selected */}
      {hasSelectedAircraft && (
        <button
          onClick={onCenterSelected}
          className="p-2 rounded bg-cyan-950/90 hover:bg-cyan-900/90 border border-cyan-500/60 text-cyan-300 shadow-lg backdrop-blur-md transition"
          title="Center on Selected Aircraft"
          aria-label="Center on Selected Aircraft"
        >
          <Crosshair className="w-4 h-4 animate-pulse" />
        </button>
      )}

      {/* Reset view to sector center */}
      <button
        onClick={onResetSectorView}
        className="p-2 rounded bg-atc-950/90 hover:bg-atc-900 border border-atc-700 text-slate-300 hover:text-white shadow-lg backdrop-blur-md transition"
        title="Reset Sector Center View"
        aria-label="Reset Sector Center View"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      {/* Toggle Bounding Box Rectangle */}
      <button
        onClick={onToggleBoundsRectangle}
        className={`p-2 rounded bg-atc-950/90 hover:bg-atc-900 border text-slate-300 hover:text-white shadow-lg backdrop-blur-md transition ${
          showBoundsRectangle ? 'border-cyan-500/80 text-cyan-300' : 'border-atc-700 opacity-60'
        }`}
        title={showBoundsRectangle ? 'Hide Sector Bounds Rectangle' : 'Show Sector Bounds Rectangle'}
        aria-label={showBoundsRectangle ? 'Hide Sector Bounds Rectangle' : 'Show Sector Bounds Rectangle'}
      >
        <Square className="w-4 h-4" />
      </button>

      {/* Toggle Flight Trail */}
      <button
        onClick={onToggleTrail}
        className={`p-2 rounded bg-atc-950/90 hover:bg-atc-900 border text-slate-300 hover:text-white shadow-lg backdrop-blur-md transition ${
          showTrail ? 'border-cyan-500/80 text-cyan-300' : 'border-atc-700 opacity-60'
        }`}
        title={showTrail ? 'Hide Flight Trail Breadcrumbs' : 'Show Flight Trail Breadcrumbs'}
        aria-label={showTrail ? 'Hide Flight Trail Breadcrumbs' : 'Show Flight Trail Breadcrumbs'}
      >
        <Spline className="w-4 h-4" />
      </button>
    </div>
  );
};
