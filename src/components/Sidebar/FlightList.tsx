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
    <div className="flex-1 flex flex-col min-h-0 bg-aviation-cloud/30 font-sans">
      {/* Search Bar & Quick Filters */}
      {onSearchChange && (
        <div className="p-3 bg-white border-b border-aviation-border">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-aviation-muted" />
            <input
              type="text"
              placeholder="Search callsign or country..."
              value={searchQuery ?? ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-aviation-cloud/50 border border-aviation-border hover:border-slate-300 focus:border-aviation-sky focus:bg-white rounded-xl text-aviation-navy placeholder-aviation-muted text-xs font-medium focus:outline-none transition shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-aviation-muted hover:text-aviation-navy p-0.5"
                aria-label="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick filter pills */}
          {onGroundStateChange && (
            <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-aviation-border/60 overflow-x-auto text-xs">
              <button
                onClick={() => onGroundStateChange('ALL')}
                className={`px-3 py-1 rounded-lg transition font-medium text-xs ${
                  groundState === 'ALL' && !emergencyOnly
                    ? 'bg-aviation-navy text-white shadow-xs'
                    : 'bg-aviation-cloud text-aviation-slate hover:bg-slate-200/70 border border-aviation-border'
                }`}
              >
                All
              </button>
              <button
                onClick={() => onGroundStateChange('AIRBORNE')}
                className={`px-3 py-1 rounded-lg transition font-medium text-xs ${
                  groundState === 'AIRBORNE'
                    ? 'bg-aviation-green text-white shadow-xs'
                    : 'bg-aviation-cloud text-aviation-slate hover:bg-slate-200/70 border border-aviation-border'
                }`}
              >
                Airborne
              </button>
              <button
                onClick={() => onGroundStateChange('ON_GROUND')}
                className={`px-3 py-1 rounded-lg transition font-medium text-xs ${
                  groundState === 'ON_GROUND'
                    ? 'bg-aviation-amber text-white shadow-xs'
                    : 'bg-aviation-cloud text-aviation-slate hover:bg-slate-200/70 border border-aviation-border'
                }`}
              >
                On Ground
              </button>
              {onToggleEmergency && (
                <button
                  onClick={onToggleEmergency}
                  className={`ml-auto flex items-center gap-1 px-2.5 py-1 rounded-lg transition font-medium text-xs ${
                    emergencyOnly
                      ? 'bg-aviation-red text-white shadow-xs animate-pulse font-bold'
                      : 'bg-aviation-cloud text-aviation-red hover:bg-red-50 border border-aviation-border'
                  }`}
                  title="Filter emergency squawk codes (7700, 7600, 7500)"
                >
                  <Flame className="w-3 h-3 text-aviation-red" />
                  Emerg
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Sort Bar */}
      <div className="px-3 py-2 bg-aviation-cloud/70 border-b border-aviation-border flex items-center justify-between text-xs text-aviation-muted">
        <span>
          Showing <strong className="text-aviation-navy font-semibold">{aircraftList.length}</strong> aircraft
        </span>

        <div className="flex items-center gap-1">
          <span className="text-[11px] uppercase tracking-wider text-aviation-muted mr-1">Sort:</span>
          {(['altitude', 'velocity', 'callsign'] as SortField[]).map((field) => (
            <button
              key={field}
              onClick={() => onSortChange(field)}
              className={`px-2 py-0.5 rounded-md capitalize transition text-xs ${
                sortConfig.field === field
                  ? 'bg-white text-aviation-navy font-semibold border border-aviation-border shadow-2xs'
                  : 'text-aviation-muted hover:text-aviation-navy'
              }`}
            >
              {field === 'velocity' ? 'Speed' : field}
              {sortConfig.field === field && (
                <span className="ml-1 text-[10px]">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Aircraft List Scroll Container */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {aircraftList.length === 0 ? (
          <div className="p-6 text-center text-aviation-muted space-y-3 bg-white rounded-2xl border border-aviation-border my-2">
            <AlertCircle className="w-10 h-10 mx-auto text-aviation-sky" />
            <div>
              <p className="font-semibold text-aviation-navy text-sm">
                {isApiError ? 'Live flight data temporarily unavailable' : 'No aircraft found in this area'}
              </p>
              <p className="text-aviation-muted text-xs mt-1.5 max-w-xs mx-auto leading-relaxed">
                {isApiError
                  ? 'OpenSky Network access is currently throttled. You can continue exploring with demonstration flights.'
                  : 'Try zooming out or clearing your search filters to find aircraft.'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                onClick={onResetFilters}
                className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-slate-50 border border-aviation-border text-aviation-navy rounded-xl text-xs font-medium transition shadow-2xs"
              >
                Reset Filters
              </button>
              {isLive && onSwitchToDemo && (
                <button
                  onClick={onSwitchToDemo}
                  className="w-full sm:w-auto px-4 py-2 bg-aviation-navy hover:bg-aviation-midnight text-white rounded-xl text-xs font-medium transition shadow-xs"
                >
                  Explore with Demonstration Flights
                </button>
              )}
            </div>
          </div>
        ) : (
          aircraftList.map((ac) => {
            const isSelected = selectedIcao24 === ac.icao24;
            const isEmergency = ['7700', '7600', '7500'].includes(ac.squawk ?? '');

            return (
              <div
                key={ac.icao24}
                onClick={() => onSelectAircraft(ac.icao24)}
                className={`p-3 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-aviation-lightSky/90 border-aviation-sky ring-2 ring-aviation-sky/30 shadow-xs'
                    : isEmergency
                    ? 'bg-red-50/90 border-aviation-red hover:border-red-500'
                    : 'bg-white hover:bg-slate-50/90 border-aviation-border hover:border-slate-300 shadow-2xs'
                }`}
              >
                {/* Top Row: Callsign, Icon, Origin & Watchlist */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isEmergency
                          ? 'bg-red-100 text-aviation-red border border-aviation-red'
                          : ac.onGround
                          ? 'bg-amber-100/70 text-aviation-amber border border-amber-200'
                          : 'bg-aviation-lightSky text-aviation-sky border border-blue-200'
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
                        <span className="font-bold text-sm text-aviation-navy font-sans tracking-tight">
                          {ac.callsign}
                        </span>
                        {isEmergency && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 border border-aviation-red text-aviation-red font-bold animate-pulse">
                            EMERGENCY
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-aviation-muted truncate max-w-[170px]">
                        {ac.originCountry}
                      </div>
                    </div>
                  </div>

                  {/* Right: Watchlist & Altitude */}
                  <div className="text-right flex items-center gap-2">
                    {onToggleWatchlist && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(ac.icao24);
                        }}
                        className={`p-1 rounded-lg hover:bg-aviation-cloud transition ${
                          watchlist?.includes(ac.icao24.toLowerCase())
                            ? 'text-aviation-amber'
                            : 'text-slate-300 hover:text-slate-500'
                        }`}
                        title={
                          watchlist?.includes(ac.icao24.toLowerCase())
                            ? 'Remove from Watchlist'
                            : 'Add to Watchlist'
                        }
                        aria-label="Toggle Watchlist"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            watchlist?.includes(ac.icao24.toLowerCase()) ? 'fill-aviation-amber' : ''
                          }`}
                        />
                      </button>
                    )}
                    <div className="flex flex-col items-end">
                      {ac.onGround ? (
                        <span className="text-xs font-semibold text-aviation-amber bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          On Ground
                        </span>
                      ) : (
                        <div className="flex items-center gap-1 text-xs font-semibold text-aviation-navy">
                          {ac.verticalState === 'CLIMBING' && (
                            <ArrowUpRight className="w-3.5 h-3.5 text-aviation-green" />
                          )}
                          {ac.verticalState === 'DESCENDING' && (
                            <ArrowDownRight className="w-3.5 h-3.5 text-aviation-amber" />
                          )}
                          {ac.verticalState === 'LEVEL' && (
                            <Minus className="w-3.5 h-3.5 text-aviation-muted" />
                          )}
                          <span>
                            {ac.baroAltitudeFeet !== null
                              ? `Altitude: ${ac.baroAltitudeFeet.toLocaleString()} ft`
                              : 'Altitude: --'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Speed, Heading, Vertical Rate */}
                <div className="mt-2.5 pt-2 border-t border-aviation-border/60 flex items-center justify-between text-xs text-aviation-muted">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-aviation-slate">
                      Speed: {ac.velocityKnots !== null ? `${ac.velocityKnots} kt` : '--'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Compass className="w-3 h-3 text-aviation-muted" />
                      {ac.heading !== null ? `${ac.heading}° ${ac.headingCardinal}` : '---'}
                    </span>
                  </div>

                  <div className="text-[11px]">
                    {ac.verticalRateFpm !== null && Math.abs(ac.verticalRateFpm) > 64 ? (
                      <span className={ac.verticalRateFpm > 0 ? 'text-aviation-green font-medium' : 'text-aviation-amber font-medium'}>
                        {ac.verticalRateFpm > 0 ? `+${ac.verticalRateFpm}` : ac.verticalRateFpm} fpm
                      </span>
                    ) : (
                      <span className="text-aviation-muted">Level</span>
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
