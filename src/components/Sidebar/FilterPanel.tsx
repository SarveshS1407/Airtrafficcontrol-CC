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
    <div className="bg-[#FCFAF5] border-b border-[#D6E0E7] text-xs font-sans">
      {/* Search Bar */}
      <div className="p-3 pb-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#82909B]" />
          <input
            type="text"
            placeholder="Search callsign, ICAO hex, or country..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-9 pr-7 py-2 bg-[#F4F0E7] border border-[#D6E0E7] hover:border-[#8DB7D5] focus:border-[#20394D] focus:bg-[#FCFAF5] rounded-xl text-[#172D40] placeholder-[#82909B] text-xs font-medium focus:outline-none transition shadow-2xs"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#82909B] hover:text-[#172D40] text-xs font-bold p-0.5"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Filter Toggle Header */}
      <div className="px-3 py-2 flex items-center justify-between border-t border-[#D6E0E7]">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 text-xs text-[#172D40] hover:text-[#D87C43] font-bold uppercase tracking-wider tech-stamp"
        >
          <Filter className="w-3.5 h-3.5 text-[#D87C43]" />
          Telemetry Filters
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#EBF3FA] text-[#172D40] border border-[#8DB7D5] font-bold font-mono">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs font-semibold text-[#D87C43] hover:text-[#20394D]"
              title="Reset all filters to defaults"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#82909B] hover:text-[#172D40] p-1"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Filter controls expandable body */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3 pt-1 border-t border-[#D6E0E7]/60">
          {/* Ground state filter pills */}
          <div>
            <label className="text-[10px] font-bold text-[#82909B] uppercase tracking-wider block mb-1 tech-stamp">
              Flight State
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#F4F0E7] p-1 rounded-xl border border-[#D6E0E7] text-center text-xs">
              {(['ALL', 'AIRBORNE', 'ON_GROUND'] as GroundFilter[]).map((state) => (
                <button
                  key={state}
                  onClick={() => onFilterChange({ groundState: state })}
                  className={`py-1.5 rounded-lg transition font-semibold text-xs ${
                    filters.groundState === state
                      ? 'bg-[#20394D] text-white shadow-xs'
                      : 'text-[#82909B] hover:text-[#172D40]'
                  }`}
                >
                  {state === 'ALL' ? 'All' : state === 'AIRBORNE' ? 'Airborne' : 'On Ground'}
                </button>
              ))}
            </div>
          </div>

          {/* Vertical state filter pills */}
          <div>
            <label className="text-[10px] font-bold text-[#82909B] uppercase tracking-wider block mb-1 tech-stamp">
              Vertical Trend
            </label>
            <div className="grid grid-cols-4 gap-1 bg-[#F4F0E7] p-1 rounded-xl border border-[#D6E0E7] text-center text-xs font-mono">
              {(['ALL', 'CLIMBING', 'LEVEL', 'DESCENDING'] as VerticalFilter[]).map((vState) => (
                <button
                  key={vState}
                  onClick={() => onFilterChange({ verticalState: vState })}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition font-semibold text-xs ${
                    filters.verticalState === vState
                      ? 'bg-[#20394D] text-white shadow-xs'
                      : 'text-[#82909B] hover:text-[#172D40]'
                  }`}
                >
                  {vState === 'CLIMBING' && <ArrowUpRight className="w-3 h-3 text-[#467A67]" />}
                  {vState === 'DESCENDING' && <ArrowDownRight className="w-3 h-3 text-[#C99B45]" />}
                  {vState === 'LEVEL' && <Minus className="w-3 h-3 text-[#82909B]" />}
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
                  ? 'bg-red-50 border-[#C94C4C] text-[#C94C4C] font-bold'
                  : 'bg-[#F4F0E7] border-[#D6E0E7] text-[#172D40] hover:border-[#8DB7D5]'
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    filters.emergencyOnly ? 'bg-[#C94C4C] animate-ping' : 'bg-[#82909B]'
                  }`}
                />
                Emergency Squawk (7700/7600/7500)
              </span>
              <span className="text-[10px] uppercase font-bold font-mono">
                {filters.emergencyOnly ? 'Active' : 'Off'}
              </span>
            </button>
          </div>

          {/* Altitude Range Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1 font-mono">
              <span className="text-[#82909B]">Altitude Ceiling</span>
              <span className="text-[#172D40] font-bold">
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
              className="w-full accent-[#D87C43] bg-[#D6E0E7] h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Speed Range Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1 font-mono">
              <span className="text-[#82909B]">Speed Range</span>
              <span className="text-[#172D40] font-bold">
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
              className="w-full accent-[#D87C43] bg-[#D6E0E7] h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
