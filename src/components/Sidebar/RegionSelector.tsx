import React, { useState } from 'react';
import { MapPin, Check, AlertCircle, Eye } from 'lucide-react';
import { PRESET_REGIONS } from '../../constants/regions';
import { BoundingBox } from '../../types/geo';
import { validateBoundingBox } from '../../services/geoUtils';

interface RegionSelectorProps {
  currentRegionId: string;
  activeBounds: BoundingBox;
  viewportSyncEnabled: boolean;
  onSelectRegion: (regionId: string) => void;
  onApplyCustomBounds: (bounds: BoundingBox) => void;
  onToggleViewportSync: (enabled: boolean) => void;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  currentRegionId,
  activeBounds,
  viewportSyncEnabled,
  onSelectRegion,
  onApplyCustomBounds,
  onToggleViewportSync,
}) => {
  const [isCustomExpanded, setIsCustomExpanded] = useState<boolean>(
    currentRegionId === 'custom'
  );

  const [formBounds, setFormBounds] = useState<BoundingBox>({ ...activeBounds });
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (id === 'custom') {
      setIsCustomExpanded(true);
      onSelectRegion('custom');
    } else {
      setIsCustomExpanded(false);
      setValidationError(null);
      onSelectRegion(id);
    }
  };

  const handleApplyCustom = () => {
    const res = validateBoundingBox(formBounds, true);
    if (!res.isValid) {
      setValidationError(res.error ?? 'Invalid bounds');
      return;
    }
    setValidationError(null);
    onApplyCustomBounds(formBounds);
  };

  return (
    <div className="p-3 bg-atc-900 border-b border-atc-800 text-xs">
      <div className="flex items-center justify-between mb-1.5">
        <label className="font-mono text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-semibold">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          GEOGRAPHIC SECTOR
        </label>
        {validationError && (
          <span className="text-[10px] text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Error
          </span>
        )}
      </div>

      {/* Preset Region Dropdown */}
      <select
        value={currentRegionId}
        onChange={handleRegionChange}
        className="w-full bg-atc-950 border border-atc-700 rounded px-2.5 py-1.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500 transition"
      >
        {PRESET_REGIONS.map((region) => (
          <option key={region.id} value={region.id} className="bg-atc-900">
            {region.name} — {region.country}
          </option>
        ))}
      </select>

      {/* Viewport Sync Checkbox */}
      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-300">
        <label
          htmlFor="viewportSyncToggle"
          className="flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-slate-200"
        >
          <input
            id="viewportSyncToggle"
            type="checkbox"
            checked={viewportSyncEnabled}
            onChange={(e) => onToggleViewportSync(e.target.checked)}
            className="rounded bg-atc-950 border-atc-700 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3 text-cyan-400" />
            Sync sector to map viewport
          </span>
        </label>
        <button
          onClick={() => setIsCustomExpanded(!isCustomExpanded)}
          className="text-cyan-400 hover:text-cyan-300 underline font-mono text-[10px]"
        >
          {isCustomExpanded ? 'Hide Bounds' : 'Edit Bounds'}
        </button>
      </div>

      {/* Custom Coordinates Editor */}
      {isCustomExpanded && (
        <div className="mt-2.5 p-2 rounded bg-atc-950/70 border border-atc-800 space-y-2">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Bounding Box (WGS84 Degrees)</span>
            <span className="text-slate-500">
              Area: {((formBounds.lamax - formBounds.lamin) * (formBounds.lomax - formBounds.lomin)).toFixed(2)}°²
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] font-mono text-slate-500 block">South Lat (lamin)</span>
              <input
                type="number"
                step="0.01"
                value={formBounds.lamin}
                onChange={(e) =>
                  setFormBounds({ ...formBounds, lamin: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-atc-900 border border-atc-700 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 block">North Lat (lamax)</span>
              <input
                type="number"
                step="0.01"
                value={formBounds.lamax}
                onChange={(e) =>
                  setFormBounds({ ...formBounds, lamax: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-atc-900 border border-atc-700 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 block">West Lon (lomin)</span>
              <input
                type="number"
                step="0.01"
                value={formBounds.lomin}
                onChange={(e) =>
                  setFormBounds({ ...formBounds, lomin: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-atc-900 border border-atc-700 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 block">East Lon (lomax)</span>
              <input
                type="number"
                step="0.01"
                value={formBounds.lomax}
                onChange={(e) =>
                  setFormBounds({ ...formBounds, lomax: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-atc-900 border border-atc-700 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {validationError && (
            <div className="text-[11px] text-rose-400 bg-rose-950/40 border border-rose-800/60 p-1.5 rounded">
              {validationError}
            </div>
          )}

          <button
            onClick={handleApplyCustom}
            className="w-full mt-1 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/50 text-cyan-200 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Check className="w-3.5 h-3.5" />
            Apply Sector Coordinates
          </button>
        </div>
      )}
    </div>
  );
};
