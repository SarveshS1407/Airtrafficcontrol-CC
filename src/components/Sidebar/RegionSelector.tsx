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
    <div className="p-3 bg-[#FCFAF5] border-b border-[#D6E0E7] text-xs font-sans">
      <div className="flex items-center justify-between mb-2">
        <label className="text-[10px] text-[#82909B] uppercase tracking-wider flex items-center gap-1.5 font-bold tech-stamp">
          <MapPin className="w-3.5 h-3.5 text-[#D87C43]" />
          Geographic Airspace Sector
        </label>
        {validationError && (
          <span className="text-[11px] text-[#C94C4C] flex items-center gap-1 font-medium font-mono">
            <AlertCircle className="w-3.5 h-3.5" /> Error
          </span>
        )}
      </div>

      {/* Preset Region Dropdown */}
      <select
        value={currentRegionId}
        onChange={handleRegionChange}
        className="w-full bg-[#F4F0E7] border border-[#D6E0E7] hover:border-[#8DB7D5] focus:border-[#20394D] rounded-xl px-3 py-2 text-[#172D40] text-xs font-semibold focus:outline-none transition shadow-2xs cursor-pointer"
      >
        {PRESET_REGIONS.map((region) => (
          <option key={region.id} value={region.id} className="bg-[#FCFAF5] text-[#172D40]">
            {region.name} — {region.country}
          </option>
        ))}
      </select>

      {/* Viewport Sync Checkbox */}
      <div className="mt-2.5 flex items-center justify-between text-xs text-[#172D40]">
        <label
          htmlFor="viewportSyncToggle"
          className="flex items-center gap-2 cursor-pointer select-none text-[#82909B] hover:text-[#172D40]"
        >
          <input
            id="viewportSyncToggle"
            type="checkbox"
            checked={viewportSyncEnabled}
            onChange={(e) => onToggleViewportSync(e.target.checked)}
            className="rounded border-[#D6E0E7] text-[#20394D] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#20394D]"
          />
          <span className="flex items-center gap-1 font-medium">
            <Eye className="w-3.5 h-3.5 text-[#456D8B]" />
            Sync sector to map viewport
          </span>
        </label>
        <button
          onClick={() => setIsCustomExpanded(!isCustomExpanded)}
          className="text-[#D87C43] hover:text-[#20394D] font-bold text-xs underline font-mono"
        >
          {isCustomExpanded ? 'Hide Bounds' : 'Edit Bounds'}
        </button>
      </div>

      {/* Custom Coordinates Editor */}
      {isCustomExpanded && (
        <div className="mt-3 p-3 rounded-xl bg-[#F4F0E7] border border-[#D6E0E7] space-y-2.5">
          <div className="text-[10px] text-[#82909B] uppercase tracking-wider flex items-center justify-between font-mono font-bold">
            <span>Coordinates (WGS84 Degrees)</span>
            <span>
              Area: {((formBounds.lamax - formBounds.lamin) * (formBounds.lomax - formBounds.lomin)).toFixed(2)}°²
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono">
            <div>
              <span className="text-[10px] text-[#82909B] block mb-0.5">South Lat</span>
              <input
                type="number"
                step="0.01"
                value={formBounds.lamin}
                onChange={(e) =>
                  setFormBounds({ ...formBounds, lamin: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-[#FCFAF5] border border-[#D6E0E7] rounded-lg px-2.5 py-1 text-xs text-[#172D40] focus:outline-none focus:border-[#D87C43]"
              />
            </div>
            <div>
              <span className="text-[10px] text-[#82909B] block mb-0.5">North Lat</span>
              <input
                type="number"
                step="0.01"
                value={formBounds.lamax}
                onChange={(e) =>
                  setFormBounds({ ...formBounds, lamax: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-[#FCFAF5] border border-[#D6E0E7] rounded-lg px-2.5 py-1 text-xs text-[#172D40] focus:outline-none focus:border-[#D87C43]"
              />
            </div>
            <div>
              <span className="text-[10px] text-[#82909B] block mb-0.5">West Lon</span>
              <input
                type="number"
                step="0.01"
                value={formBounds.lomin}
                onChange={(e) =>
                  setFormBounds({ ...formBounds, lomin: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-[#FCFAF5] border border-[#D6E0E7] rounded-lg px-2.5 py-1 text-xs text-[#172D40] focus:outline-none focus:border-[#D87C43]"
              />
            </div>
            <div>
              <span className="text-[10px] text-[#82909B] block mb-0.5">East Lon</span>
              <input
                type="number"
                step="0.01"
                value={formBounds.lomax}
                onChange={(e) =>
                  setFormBounds({ ...formBounds, lomax: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-[#FCFAF5] border border-[#D6E0E7] rounded-lg px-2.5 py-1 text-xs text-[#172D40] focus:outline-none focus:border-[#D87C43]"
              />
            </div>
          </div>

          {validationError && (
            <div className="text-xs text-[#C94C4C] bg-red-50 border border-red-200 p-2 rounded-lg font-mono">
              {validationError}
            </div>
          )}

          <button
            onClick={handleApplyCustom}
            className="w-full mt-2 py-1.5 rounded-lg bg-[#20394D] hover:bg-[#172D40] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
          >
            <Check className="w-3.5 h-3.5 text-[#8DB7D5]" />
            Apply Sector Coordinates
          </button>
        </div>
      )}
    </div>
  );
};
