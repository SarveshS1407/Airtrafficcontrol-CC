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
    (filters.originCountry ? 1 : 0) +
    (filters.emergencyOnly ? 1 : 0);

  return (
    <div className="bg-white border-b border-aviation-border text-xs font-sans">
      {/* Search Bar */}
      <div className="p-3 pb-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-aviation-muted" />
          <input
            type="text"
            placeholder="Search callsign, ICAO hex, or country..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-9 pr-7 py-2 bg-aviation-cloud/50 border border-aviation-border hover:border-slate-300 focus:border-aviation-sky focus:bg-white rounded-xl text-aviation-navy placeholder-aviation-muted text-xs font-medium focus:outline-none transition shadow-2xs"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-aviation-muted hover:text-aviation-navy text-xs font-bold p-0.5"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Filter Toggle Header */}
      <div className="px-3 py-2 flex items-center justify-between border-t border-aviation-border/60">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 text-xs text-aviation-slate hover:text-aviation-navy font-semibold uppercase tracking-wider"
        >
          <Filter className="w-3.5 h-3.5 text-aviation-sky" />
          Telemetry Filters
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-aviation-lightSky text-aviation-navy border border-blue-200 font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs font-medium text-aviation-sky hover:text-blue-700"
              title="Reset all filters to defaults"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-aviation-muted hover:text-aviation-navy p-1"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Filter controls expandable body */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3 pt-1 border-t border-aviation-border/60">
          {/* Ground state filter pills */}
          <div>
            <label className="text-[11px] font-semibold text-aviation-muted uppercase tracking-wider block mb-1">
              Flight State
            </label>
            <div className="grid grid-cols-3 gap-1 bg-aviation-cloud p-1 rounded-xl border border-aviation-border text-center text-xs">
              {(['ALL', 'AIRBORNE', 'ON_GROUND'] as GroundFilter[]).map((state) => (
                <button
                  key={state}
                  onClick={() => onFilterChange({ groundState: state })}
                  className={`py-1.5 rounded-lg transition font-medium text-xs ${
                    filters.groundState === state
                      ? 'bg-white text-aviation-navy shadow-xs font-semibold'
                      : 'text-aviation-muted hover:text-aviation-navy'
                  }`}
                >
                  {state === 'ALL' ? 'All' : state === 'AIRBORNE' ? 'Airborne' : 'On Ground'}
                </button>
              ))}
            </div>
          </div>

          {/* Vertical state filter pills */}
          <div>
            <label className="text-[11px] font-semibold text-aviation-muted uppercase tracking-wider block mb-1">
              Vertical Trend
            </label>
            <div className="grid grid-cols-4 gap-1 bg-aviation-cloud p-1 rounded-xl border border-aviation-border text-center text-xs">
              {(['ALL', 'CLIMBING', 'LEVEL', 'DESCENDING'] as VerticalFilter[]).map((vState) => (
                <button
                  key={vState}
                  onClick={() => onFilterChange({ verticalState: vState })}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition font-medium text-xs ${
                    filters.verticalState === vState
                      ? 'bg-white text-aviation-navy shadow-xs font-semibold'
                      : 'text-aviation-muted hover:text-aviation-navy'
                  }`}
                >
                  {vState === 'CLIMBING' && <ArrowUpRight className="w-3 h-3 text-aviation-green" />}
                  {vState === 'DESCENDING' && <ArrowDownRight className="w-3 h-3 text-aviation-amber" />}
                  {vState === 'LEVEL' && <Minus className="w-3 h-3 text-aviation-muted" />}
                  {vState === 'ALL' ? 'All' : vState.slice(0, 5)}
                </button>
              ))}
            </div>
          </div>

          {/* Emergency Squawk Filter */}
          <div>
            <button
              onClick={() => onFilterChange({ emergencyOnly: !filters.emergencyOnly })}
              className={`w-full py-2 px-3 rounded-xl border flex items-center justify-between text-xs transition shadow-2xs ${
                filters.emergencyOnly
                  ? 'bg-red-50 border-aviation-red text-aviation-red font-semibold'
                  : 'bg-aviation-cloud border-aviation-border text-aviation-slate hover:border-slate-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    filters.emergencyOnly ? 'bg-aviation-red animate-ping' : 'bg-slate-400'
                  }`}
                />
                Emergency Squawk Only (7700/7600/7500)
              </span>
              <span className="text-[11px] uppercase font-bold">
                {filters.emergencyOnly ? 'Active' : 'Off'}
              </span>
            </button>
          </div>

          {/* Altitude Range Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-aviation-muted">Altitude Ceiling</span>
              <span className="text-aviation-navy font-semibold">
                {filters.minAltitudeFt.toLocaleString()} — {filters.maxAltitudeFt >= 55000 ? '55,000+ ft' : `${filters.maxAltitudeFt.toLocaleString()} ft`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="55000"
              step="1000"
              value={filters.maxAltitudeFt}
              onChange={(e) => onFilterChange({ maxAltitudeFt: parseInt(e.target.value, 10) })}
              className="w-full accent-aviation-sky bg-aviation-cloud h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Speed Range Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-aviation-muted">Speed Range</span>
              <span className="text-aviation-navy font-semibold">
                {filters.minVelocityKts} — {filters.maxVelocityKts >= 700 ? '700+ kt' : `${filters.maxVelocityKts} kt`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="700"
              step="25"
              value={filters.maxVelocityKts}
              onChange={(e) => onFilterChange({ maxVelocityKts: parseInt(e.target.value, 10) })}
              className="w-full accent-aviation-sky bg-aviation-cloud h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
