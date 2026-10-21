import React from 'react';
import {
  Plane,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertCircle,
  Compass,
  Search,
  Flame,
  X,
  Star,
} from 'lucide-react';
import { Aircraft } from '../../types/opensky';
import { AircraftSortConfig, SortField } from '../../types/filter';
import { ApiStatus } from '../../types/telemetry';

interface FlightListProps {
  aircraftList: Aircraft[];
  selectedIcao24: string | null;
  sortConfig: AircraftSortConfig;
  isLive?: boolean;
  onSelectAircraft: (icao24: string) => void;
  onSortChange: (field: SortField) => void;
  onResetFilters: () => void;
  onSwitchToDemo?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  groundState?: 'ALL' | 'AIRBORNE' | 'ON_GROUND';
  onGroundStateChange?: (state: 'ALL' | 'AIRBORNE' | 'ON_GROUND') => void;
  emergencyOnly?: boolean;
  onToggleEmergency?: () => void;
  apiStatus?: ApiStatus;
  watchlist?: string[];
  onToggleWatchlist?: (icao24: string) => void;
}

export const FlightList: React.FC<FlightListProps> = ({
  aircraftList,
  selectedIcao24,
  sortConfig,
  isLive,
  onSelectAircraft,
  onSortChange,
  onResetFilters,
  onSwitchToDemo,
  searchQuery,
  onSearchChange,
  groundState,
  onGroundStateChange,
  emergencyOnly,
  onToggleEmergency,
  apiStatus,
  watchlist,
  onToggleWatchlist,
}) => {
  const isApiError = apiStatus?.status === 'ERROR' || apiStatus?.status === 'RATE_LIMITED';

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-atc-950">
      {/* Search Input Bar (if onSearchChange provided) */}
      {onSearchChange && (
        <div className="p-2.5 pb-2 bg-atc-900 border-b border-atc-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search callsign, ICAO hex, or country..."
              value={searchQuery ?? ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 bg-atc-950 border border-atc-700/80 rounded-md text-slate-200 placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-cyan-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                aria-label="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick filter buttons */}
          {onGroundStateChange && (
            <div className="flex items-center gap-1 mt-2 pt-1.5 border-t border-atc-800/80 overflow-x-auto text-[11px] font-mono">
              <button
                onClick={() => onGroundStateChange('ALL')}
                className={`px-2 py-0.5 rounded transition ${
                  groundState === 'ALL' && !emergencyOnly
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ALL
              </button>
              <button
                onClick={() => onGroundStateChange('AIRBORNE')}
                className={`px-2 py-0.5 rounded transition ${
                  groundState === 'AIRBORNE'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                AIRBORNE
              </button>
              <button
                onClick={() => onGroundStateChange('ON_GROUND')}
                className={`px-2 py-0.5 rounded transition ${
                  groundState === 'ON_GROUND'
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/50 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                GROUND
              </button>
              {onToggleEmergency && (
                <button
                  onClick={onToggleEmergency}
                  className={`ml-auto flex items-center gap-1 px-2 py-0.5 rounded transition ${
                    emergencyOnly
                      ? 'bg-red-950 text-red-300 border border-red-500 font-bold animate-pulse'
                      : 'text-slate-400 hover:text-red-400'
                  }`}
                  title="Filter emergency squawk codes (7700, 7600, 7500)"
                >
                  <Flame className="w-3 h-3 text-red-400" />
                  EMERG
                </button>
              )}
            </div>
          )}
        </div>
      )}

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
      <div className="flex-1 overflow-y-auto divide-y divide-atc-850/60 p-2 space-y-1.5">
        {aircraftList.length === 0 ? (
          <div className="p-6 text-center text-slate-400 space-y-3">
            <AlertCircle className="w-9 h-9 mx-auto text-slate-500" />
            <div className="font-mono text-xs">
              <p className="font-semibold text-slate-200 text-sm">
                {isApiError ? 'Live Surveillance Inactive' : 'No Aircraft in Sector'}
              </p>
              <p className="text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                {isApiError
                  ? 'OpenSky Network restrict cloud provider IPs (AWS/Vercel) without OAuth2. Explore live radar kinematics via Demo Fixtures or run locally.'
                  : 'No aircraft match the current sector bounds and filters.'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                onClick={onResetFilters}
                className="w-full sm:w-auto px-3.5 py-1.5 bg-cyan-900/40 border border-cyan-500/40 text-cyan-300 rounded font-mono text-xs hover:bg-cyan-800/60 transition"
              >
                Reset Filters
              </button>
              {isLive && onSwitchToDemo && (
                <button
                  onClick={onSwitchToDemo}
                  className="w-full sm:w-auto px-3.5 py-1.5 bg-amber-950/70 border border-amber-500/50 text-amber-300 rounded font-mono text-xs hover:bg-amber-900/80 transition shadow-lg"
                >
                  Explore with Demo Fixtures
                </button>
              )}
            </div>
          </div>
        ) : (
          aircraftList.map((ac) => {
            const isSelected = selectedIcao24 === ac.icao24;
            const isEmergency = ['7700', '7600', '7500'].includes(ac.squawk ?? '');
            const flightLevel =
              ac.baroAltitudeFeet !== null && ac.baroAltitudeFeet >= 18000
                ? `FL${Math.round(ac.baroAltitudeFeet / 100)}`
                : null;

            return (
              <div
                key={ac.icao24}
                onClick={() => onSelectAircraft(ac.icao24)}
                className={`p-2.5 rounded-lg cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.25)]'
                    : isEmergency
                    ? 'bg-red-950/60 border-red-500/80 hover:border-red-400'
                    : 'bg-atc-900/80 hover:bg-atc-850 border-atc-800/80 hover:border-atc-700'
                }`}
              >
                {/* Top Row: Callsign, ICAO, Country & Badges */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                        isEmergency
                          ? 'bg-red-950 border border-red-500 text-red-300 animate-pulse'
                          : ac.onGround
                          ? 'bg-amber-950/70 text-amber-400 border border-amber-600/40'
                          : 'bg-cyan-950/80 text-cyan-400 border border-cyan-600/40'
                      }`}
                    >
                      <Plane
                        className="w-4 h-4"
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
                        <span className="font-mono text-[10px] text-slate-400 uppercase">
                          {ac.icao24}
                        </span>
                        {flightLevel && (
                          <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-indigo-950 border border-indigo-700/60 text-indigo-300 font-semibold">
                            {flightLevel}
                          </span>
                        )}
                        {isEmergency && (
                          <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-red-950 border border-red-500 text-red-300 font-bold animate-pulse">
                            {ac.squawk}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {ac.originCountry}
                      </div>
                    </div>
                  </div>

                  {/* Flight state & altitude with Watchlist Action */}
                  <div className="text-right flex items-center gap-2">
                    {onToggleWatchlist && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(ac.icao24);
                        }}
                        className={`p-1 rounded hover:bg-atc-800 transition ${
                          watchlist?.includes(ac.icao24.toLowerCase())
                            ? 'text-amber-400'
                            : 'text-slate-600 hover:text-slate-300'
                        }`}
                        title={
                          watchlist?.includes(ac.icao24.toLowerCase())
                            ? 'Remove from Watchlist'
                            : 'Pin to Watchlist'
                        }
                        aria-label="Toggle Watchlist"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            watchlist?.includes(ac.icao24.toLowerCase()) ? 'fill-amber-400' : ''
                          }`}
                        />
                      </button>
                    )}
                    <div className="flex flex-col items-end">
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
                </div>

                {/* Bottom Row: Speed, Heading, Vertical Rate */}
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
                      <span className={ac.verticalRateFpm > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {ac.verticalRateFpm > 0 ? `+${ac.verticalRateFpm}` : ac.verticalRateFpm} fpm
                      </span>
                    ) : (
                      <span>SQ: {ac.squawk ?? '---'}</span>
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
