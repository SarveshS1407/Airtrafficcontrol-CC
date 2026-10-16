import React from 'react';
import {
  Plane,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertCircle,
  Compass,
} from 'lucide-react';
import { Aircraft } from '../../types/opensky';
import { AircraftSortConfig, SortField } from '../../types/filter';

interface FlightListProps {
  aircraftList: Aircraft[];
  selectedIcao24: string | null;
  sortConfig: AircraftSortConfig;
  onSelectAircraft: (icao24: string) => void;
  onSortChange: (field: SortField) => void;
  onResetFilters: () => void;
}

export const FlightList: React.FC<FlightListProps> = ({
  aircraftList,
  selectedIcao24,
  sortConfig,
  onSelectAircraft,
  onSortChange,
  onResetFilters,
}) => {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-atc-950">
      {/* Sort Toolbar */}
      <div className="px-3 py-1.5 bg-atc-900/60 border-b border-atc-800 flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-400">
          Showing <strong className="text-cyan-300">{aircraftList.length}</strong> targets
        </span>

        <div className="flex items-center gap-1">
          <span className="text-slate-500 uppercase text-[10px]">Sort:</span>
          {(['altitude', 'velocity', 'callsign'] as SortField[]).map((field) => (
            <button
              key={field}
              onClick={() => onSortChange(field)}
              className={`px-1.5 py-0.5 rounded capitalize transition ${
                sortConfig.field === field
                  ? 'bg-atc-800 text-cyan-300 font-semibold border border-atc-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {field}
              {sortConfig.field === field && (
                <span className="ml-0.5 text-[9px]">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Aircraft List scroll container */}
      <div className="flex-1 overflow-y-auto divide-y divide-atc-850 p-1.5 space-y-1">
        {aircraftList.length === 0 ? (
          <div className="p-6 text-center text-slate-400 space-y-3">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-500" />
            <div className="font-mono text-xs">
              <p className="font-semibold text-slate-300">No Aircraft in Sector</p>
              <p className="text-slate-500 mt-1">
                No aircraft match the current sector bounds and filters.
              </p>
            </div>
            <button
              onClick={onResetFilters}
              className="px-3 py-1.5 bg-cyan-900/40 border border-cyan-500/40 text-cyan-300 rounded font-mono text-xs hover:bg-cyan-800/60 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          aircraftList.map((ac) => {
            const isSelected = selectedIcao24 === ac.icao24;
            return (
              <div
                key={ac.icao24}
                onClick={() => onSelectAircraft(ac.icao24)}
                className={`p-2.5 rounded cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-cyan-950/70 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'bg-atc-900/70 hover:bg-atc-850 border-atc-800/80 hover:border-atc-700'
                }`}
              >
                {/* Top Row: Callsign, ICAO, Country & Stale badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center ${
                        ac.onGround
                          ? 'bg-amber-950/70 text-amber-400 border border-amber-600/40'
                          : 'bg-cyan-950/70 text-cyan-400 border border-cyan-600/40'
                      }`}
                    >
                      <Plane
                        className="w-3.5 h-3.5"
                        style={{
                          transform: `rotate(${ac.heading !== null ? ac.heading - 45 : 0}deg)`,
                          transition: 'transform 0.3s ease',
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-sm text-slate-100 tracking-wide">
                          {ac.callsign}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500 uppercase">
                          {ac.icao24}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                        {ac.originCountry}
                      </div>
                    </div>
                  </div>

                  {/* Flight state badge */}
                  <div className="text-right flex flex-col items-end">
                    {ac.isStale && (
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800">
                        STALE
                      </span>
                    )}
                    {ac.onGround ? (
                      <span className="text-[10px] font-mono font-semibold text-amber-400">
                        ON GROUND
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-400">
                        {ac.verticalState === 'CLIMBING' && (
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        {ac.verticalState === 'DESCENDING' && (
                          <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                        )}
                        {ac.verticalState === 'LEVEL' && (
                          <Minus className="w-3 h-3 text-cyan-400" />
                        )}
                        <span>
                          {ac.baroAltitudeFeet !== null
                            ? `${ac.baroAltitudeFeet.toLocaleString()} ft`
                            : 'FL --'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Speed, Heading, Vertical Rate, Coordinates */}
                <div className="mt-2 pt-1.5 border-t border-atc-850 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-2.5">
                    <span title="Ground Speed">
                      {ac.velocityKnots !== null ? `${ac.velocityKnots} kts` : '-- kts'}
                    </span>
                    <span>•</span>
                    <span
                      title="True Track Heading"
                      className="flex items-center gap-0.5"
                    >
                      <Compass className="w-3 h-3 text-slate-500" />
                      {ac.heading !== null ? `${ac.heading}° ${ac.headingCardinal}` : '---'}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-500">
                    {ac.verticalRateFpm !== null && ac.verticalRateFpm !== 0 ? (
                      <span>{ac.verticalRateFpm > 0 ? `+${ac.verticalRateFpm}` : ac.verticalRateFpm} fpm</span>
                    ) : (
                      <span>Squawk: {ac.squawk ?? '---'}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
