import React, { useState } from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { AircraftFilterCriteria, GroundFilter, VerticalFilter } from '../../types/filter';

interface FilterPanelProps {
  filters: AircraftFilterCriteria;
  onFilterChange: (partial: Partial<AircraftFilterCriteria>) => void;
  onResetFilters: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Check how many non-default filters are active
  const activeFilterCount =
    (filters.searchQuery ? 1 : 0) +
    (filters.groundState !== 'ALL' ? 1 : 0) +
    (filters.verticalState !== 'ALL' ? 1 : 0) +
    (filters.minAltitudeFt > 0 || filters.maxAltitudeFt < 55000 ? 1 : 0) +
    (filters.minVelocityKts > 0 || filters.maxVelocityKts < 700 ? 1 : 0) +
    (filters.originCountry ? 1 : 0);

  return (
    <div className="bg-atc-900 border-b border-atc-800 text-xs">
      {/* Search Bar */}
      <div className="p-3 pb-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search callsign, ICAO hex, or country..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-8 pr-3 py-1.5 bg-atc-950 border border-atc-700 rounded text-slate-200 placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-cyan-500 transition"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 font-mono text-xs"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Filter Toggle Header */}
      <div className="px-3 py-1.5 flex items-center justify-between border-t border-atc-850">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 hover:text-slate-200 uppercase font-semibold"
        >
          <Filter className="w-3 h-3 text-cyan-400" />
          TELEMETRY FILTERS
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 font-mono">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300"
              title="Reset all filters to defaults"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-slate-200"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Filter controls expandable body */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3 pt-1 border-t border-atc-850">
          {/* Ground state filter pills */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Flight State
            </label>
            <div className="grid grid-cols-3 gap-1 bg-atc-950 p-0.5 rounded border border-atc-800 text-center font-mono text-[11px]">
              {(['ALL', 'AIRBORNE', 'ON_GROUND'] as GroundFilter[]).map((state) => (
                <button
                  key={state}
                  onClick={() => onFilterChange({ groundState: state })}
                  className={`py-1 rounded transition ${
                    filters.groundState === state
                      ? 'bg-cyan-900/50 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {state === 'ALL' ? 'ALL' : state === 'AIRBORNE' ? 'AIR' : 'GROUND'}
                </button>
              ))}
            </div>
          </div>

          {/* Vertical state filter pills */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Vertical Trend
            </label>
            <div className="grid grid-cols-4 gap-1 bg-atc-950 p-0.5 rounded border border-atc-800 text-center font-mono text-[10px]">
              {(['ALL', 'CLIMBING', 'LEVEL', 'DESCENDING'] as VerticalFilter[]).map((vState) => (
                <button
                  key={vState}
                  onClick={() => onFilterChange({ verticalState: vState })}
                  className={`py-1 rounded flex items-center justify-center gap-0.5 transition ${
                    filters.verticalState === vState
                      ? 'bg-cyan-900/50 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {vState === 'CLIMBING' && <ArrowUpRight className="w-2.5 h-2.5 text-emerald-400" />}
                  {vState === 'DESCENDING' && <ArrowDownRight className="w-2.5 h-2.5 text-rose-400" />}
                  {vState === 'LEVEL' && <Minus className="w-2.5 h-2.5 text-cyan-400" />}
                  {vState}
                </button>
              ))}
            </div>
          </div>

          {/* Altitude Range Slider */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono mb-1">
              <span className="text-slate-400 uppercase tracking-wider">Altitude Ceiling</span>
              <span className="text-cyan-300 font-semibold">
                {filters.minAltitudeFt.toLocaleString()} — {filters.maxAltitudeFt >= 55000 ? '55k+ ft' : `${filters.maxAltitudeFt.toLocaleString()} ft`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="55000"
              step="1000"
              value={filters.maxAltitudeFt}
              onChange={(e) => onFilterChange({ maxAltitudeFt: parseInt(e.target.value, 10) })}
              className="w-full accent-cyan-400 bg-atc-950 h-1 rounded cursor-pointer"
            />
          </div>

          {/* Speed Range Slider */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono mb-1">
              <span className="text-slate-400 uppercase tracking-wider">Speed Range</span>
              <span className="text-cyan-300 font-semibold">
                {filters.minVelocityKts} — {filters.maxVelocityKts >= 700 ? '700+ kts' : `${filters.maxVelocityKts} kts`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="700"
              step="25"
              value={filters.maxVelocityKts}
              onChange={(e) => onFilterChange({ maxVelocityKts: parseInt(e.target.value, 10) })}
              className="w-full accent-cyan-400 bg-atc-950 h-1 rounded cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
