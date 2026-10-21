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
    <div className="p-3 bg-white border-b border-aviation-border text-xs font-sans">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-aviation-slate uppercase tracking-wider flex items-center gap-1.5 font-semibold">
          <MapPin className="w-3.5 h-3.5 text-aviation-sky" />
          Geographic Sector
        </label>
        {validationError && (
          <span className="text-[11px] text-aviation-red flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" /> Error
          </span>
        )}
      </div>

      {/* Preset Region Dropdown */}
      <select
        value={currentRegionId}
        onChange={handleRegionChange}
        className="w-full bg-aviation-cloud/60 border border-aviation-border hover:border-slate-300 focus:border-aviation-sky rounded-xl px-3 py-2 text-aviation-navy text-xs font-medium focus:outline-none transition shadow-2xs cursor-pointer"
      >
        {PRESET_REGIONS.map((region) => (
          <option key={region.id} value={region.id} className="bg-white text-aviation-navy">
            {region.name} — {region.country}
          </option>
        ))}
      </select>

      {/* Viewport Sync Checkbox */}
      <div className="mt-2.5 flex items-center justify-between text-xs text-aviation-slate">
        <label
          htmlFor="viewportSyncToggle"
          className="flex items-center gap-2 cursor-pointer select-none text-aviation-muted hover:text-aviation-navy"
        >
          <input
            id="viewportSyncToggle"
            type="checkbox"
            checked={viewportSyncEnabled}
            onChange={(e) => onToggleViewportSync(e.target.checked)}
            className="rounded border-aviation-border text-aviation-navy focus:ring-0 focus:ring-offset-0 cursor-pointer accent-aviation-navy"
          />
          <span className="flex items-center gap-1 font-medium">
            <Eye className="w-3.5 h-3.5 text-aviation-sky" />
            Sync sector to map viewport
          </span>
        </label>
        <button
          onClick={() => setIsCustomExpanded(!isCustomExpanded)}
          className="text-aviation-sky hover:text-blue-700 font-medium text-xs underline"
        >
          {isCustomExpanded ? 'Hide Bounds' : 'Edit Bounds'}
        </button>
      </div>

      {/* Custom Coordinates Editor */}
      {isCustomExpanded && (
        <div className="mt-3 p-3 rounded-xl bg-aviation-cloud/70 border border-aviation-border space-y-2.5">
          <div className="text-[11px] text-aviation-muted uppercase tracking-wider flex items-center justify-between font-medium">
            <span>Coordinates (WGS84 Degrees)</span>
            <span>
              Area: {((formBounds.lamax - formBounds.lamin) * (formBounds.lomax - formBounds.lomin)).toFixed(2)}°²
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[11px] text-aviation-muted block mb-0.5">South Lat</span>
              <input
                type="number"
                step="0.01"
                value={formBounds.lamin}
                onChange={(e) =>
                  setFormBounds({ ...formBounds, lamin: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-white border border-aviation-border rounded-lg px-2.5 py-1 text-xs text-aviation-navy font-mono focus:outline-none focus:border-aviation-sky"
              />
            </div>
            <div>
              <span className="text-[11px] text-aviation-muted block mb-0.5">North Lat</span>
              <input
                type="number"
                step="0.01"
                value={formBounds.lamax}
                onChange={(e) =>
                  setFormBounds({ ...formBounds, lamax: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-white border border-aviation-border rounded-lg px-2.5 py-1 text-xs text-aviation-navy font-mono focus:outline-none focus:border-aviation-sky"
              />
            </div>
            <div>
              <span className="text-[11px] text-aviation-muted block mb-0.5">West Lon</span>
              <input
                type="number"
                step="0.01"
                value={formBounds.lomin}
                onChange={(e) =>
                  setFormBounds({ ...formBounds, lomin: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-white border border-aviation-border rounded-lg px-2.5 py-1 text-xs text-aviation-navy font-mono focus:outline-none focus:border-aviation-sky"
              />
            </div>
            <div>
              <span className="text-[11px] text-aviation-muted block mb-0.5">East Lon</span>
              <input
                type="number"
                step="0.01"
                value={formBounds.lomax}
                onChange={(e) =>
                  setFormBounds({ ...formBounds, lomax: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-white border border-aviation-border rounded-lg px-2.5 py-1 text-xs text-aviation-navy font-mono focus:outline-none focus:border-aviation-sky"
              />
            </div>
          </div>

          {validationError && (
            <div className="text-xs text-aviation-red bg-red-50 border border-red-200 p-2 rounded-lg font-medium">
              {validationError}
            </div>
          )}

          <button
            onClick={handleApplyCustom}
            className="w-full mt-2 py-1.5 rounded-lg bg-aviation-navy hover:bg-aviation-midnight text-white font-medium text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
          >
            <Check className="w-3.5 h-3.5 text-aviation-sky" />
            Apply Sector Coordinates
          </button>
        </div>
      )}
    </div>
  );
};
