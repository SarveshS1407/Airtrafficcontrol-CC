import React from 'react';
import {
  Plane,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
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
    <div className="flex-1 flex flex-col min-h-0 bg-[#F4F0E7] font-sans">
      {/* Search Bar & Quick Filters */}
      {onSearchChange && (
        <div className="p-3 bg-[#FCFAF5] border-b border-[#D6E0E7]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#82909B]" />
            <input
              type="text"
              placeholder="Search callsign or country..."
              value={searchQuery ?? ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-[#F4F0E7] border border-[#D6E0E7] hover:border-[#8DB7D5] focus:border-[#20394D] focus:bg-[#FCFAF5] rounded-xl text-[#172D40] placeholder-[#82909B] text-xs font-medium focus:outline-none transition shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#82909B] hover:text-[#172D40] p-0.5"
                aria-label="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick filter pills */}
          {onGroundStateChange && (
            <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-[#D6E0E7] overflow-x-auto text-xs">
              <button
                onClick={() => onGroundStateChange('ALL')}
                className={`px-3 py-1 rounded-lg transition font-semibold text-xs ${
                  groundState === 'ALL' && !emergencyOnly
                    ? 'bg-[#20394D] text-white shadow-xs'
                    : 'bg-[#F4F0E7] text-[#172D40] hover:bg-[#EBF3FA] border border-[#D6E0E7]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => onGroundStateChange('AIRBORNE')}
                className={`px-3 py-1 rounded-lg transition font-semibold text-xs ${
                  groundState === 'AIRBORNE'
                    ? 'bg-[#467A67] text-white shadow-xs'
                    : 'bg-[#F4F0E7] text-[#172D40] hover:bg-[#EBF3FA] border border-[#D6E0E7]'
                }`}
              >
                Airborne
              </button>
              <button
                onClick={() => onGroundStateChange('ON_GROUND')}
                className={`px-3 py-1 rounded-lg transition font-semibold text-xs ${
                  groundState === 'ON_GROUND'
                    ? 'bg-[#C99B45] text-white shadow-xs'
                    : 'bg-[#F4F0E7] text-[#172D40] hover:bg-[#EBF3FA] border border-[#D6E0E7]'
                }`}
              >
                On Ground
              </button>
              {onToggleEmergency && (
                <button
                  onClick={onToggleEmergency}
                  className={`ml-auto flex items-center gap-1 px-2.5 py-1 rounded-lg transition font-bold text-xs ${
                    emergencyOnly
                      ? 'bg-[#C94C4C] text-white shadow-xs animate-pulse'
                      : 'bg-[#F4F0E7] text-[#C94C4C] hover:bg-red-50 border border-[#D6E0E7]'
                  }`}
                  title="Filter emergency squawk codes (7700, 7600, 7500)"
                >
                  <Flame className="w-3 h-3 text-[#C94C4C]" />
                  Emerg
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Flight Log Header / Sort Bar */}
      <div className="px-3 py-2 bg-[#F4F0E7] border-b border-[#D6E0E7] flex items-center justify-between text-xs text-[#82909B]">
        <div className="flex items-center gap-1.5">
          <span className="tech-stamp text-[10px] text-[#82909B] font-bold">NAVLOG</span>
          <span>•</span>
          <span className="font-mono text-xs text-[#172D40]">
            <strong className="font-black">{aircraftList.length}</strong> targets
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase tracking-wider text-[#82909B] mr-1">Sort:</span>
          {(['altitude', 'velocity', 'callsign'] as SortField[]).map((field) => (
            <button
              key={field}
              onClick={() => onSortChange(field)}
              className={`px-2 py-0.5 rounded-md capitalize transition text-xs font-mono ${
                sortConfig.field === field
                  ? 'bg-[#FCFAF5] text-[#172D40] font-bold border border-[#D6E0E7] shadow-2xs'
                  : 'text-[#82909B] hover:text-[#172D40]'
              }`}
            >
              {field === 'velocity' ? 'Speed' : field}
              {sortConfig.field === field && (
                <span className="ml-1 text-[10px] text-[#D87C43]">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Aircraft List Scroll Container (Styled like a flight navigation log) */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {aircraftList.length === 0 ? (
          <div className="p-6 text-center text-[#82909B] space-y-3 bg-[#FCFAF5] rounded-2xl border border-[#D6E0E7] my-2 shadow-2xs">
            {/* Subtle Aircraft Illustration */}
            <div className="w-12 h-12 mx-auto rounded-full bg-[#F4F0E7] border border-[#D6E0E7] flex items-center justify-center">
              <Plane className="w-6 h-6 text-[#82909B] transform -rotate-45" />
            </div>
            <div>
              <p className="font-bold text-[#172D40] text-sm font-sans">
                {isApiError ? 'Live flight data is temporarily unavailable.' : 'No aircraft found in this area.'}
              </p>
              <p className="text-[#82909B] text-xs mt-1.5 max-w-xs mx-auto leading-relaxed">
                {isApiError
                  ? 'OpenSky Network access is currently throttled by public cloud rate quotas. You can continue exploring with demonstration flights.'
                  : 'Try a wider search area or return to the global view.'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                onClick={onResetFilters}
                className="w-full sm:w-auto px-4 py-2 bg-[#FCFAF5] hover:bg-[#F4F0E7] border border-[#D6E0E7] text-[#172D40] rounded-xl text-xs font-semibold transition shadow-2xs"
              >
                Reset Filters
              </button>
              {isLive && onSwitchToDemo && (
                <button
                  onClick={onSwitchToDemo}
                  className="w-full sm:w-auto px-4 py-2 bg-[#20394D] hover:bg-[#172D40] text-white rounded-xl text-xs font-semibold transition shadow-xs"
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
                    ? 'bg-[#EBF3FA] border-l-4 border-l-[#D87C43] border-[#8DB7D5] shadow-xs'
                    : isEmergency
                    ? 'bg-red-50 border-[#C94C4C] hover:border-red-500'
                    : 'bg-[#FCFAF5] hover:bg-[#F4F0E7] border-[#D6E0E7] hover:border-[#8DB7D5] shadow-2xs'
                }`}
              >
                {/* Top Row: Callsign, Airplane Icon, Origin Country, Watchlist */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        isEmergency
                          ? 'bg-red-100 text-[#C94C4C] border-[#C94C4C]'
                          : isSelected
                          ? 'bg-[#D87C43] text-white border-[#D87C43]'
                          : ac.onGround
                          ? 'bg-[#F4F0E7] text-[#82909B] border-[#D6E0E7]'
                          : 'bg-[#F4F0E7] text-[#20394D] border-[#D6E0E7]'
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
                        <span className="text-[10px] text-[#82909B] font-mono uppercase">AIRCRAFT /</span>
                        <span className="font-mono font-bold text-sm text-[#172D40] tracking-tight">
                          {ac.callsign}
                        </span>
                        {isEmergency && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 border border-[#C94C4C] text-[#C94C4C] font-bold animate-pulse font-mono">
                            EMERG {ac.squawk}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#82909B] truncate max-w-[170px]">
                        {ac.originCountry}
                      </div>
                    </div>
                  </div>

                  {/* Right: Watchlist Pin & Altitude */}
                  <div className="text-right flex items-center gap-2">
                    {onToggleWatchlist && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(ac.icao24);
                        }}
                        className={`p-1 rounded-lg hover:bg-[#D6E0E7]/60 transition ${
                          watchlist?.includes(ac.icao24.toLowerCase())
                            ? 'text-[#C99B45]'
                            : 'text-[#D6E0E7] hover:text-[#82909B]'
                        }`}
                        title={
                          watchlist?.includes(ac.icao24.toLowerCase())
                            ? 'Remove from Watchlist'
                            : 'Pin to Watchlist'
                        }
                        aria-label="Toggle Watchlist"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            watchlist?.includes(ac.icao24.toLowerCase()) ? 'fill-[#C99B45]' : ''
                          }`}
                        />
                      </button>
                    )}
                    <div className="flex flex-col items-end">
                      {ac.onGround ? (
                        <span className="text-xs font-semibold text-[#82909B] bg-[#F4F0E7] px-2 py-0.5 rounded-md border border-[#D6E0E7] font-mono">
                          On Ground
                        </span>
                      ) : (
                        <div className="flex items-center gap-1 text-xs font-bold text-[#172D40] font-mono">
                          {ac.verticalState === 'CLIMBING' && (
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#467A67]" />
                          )}
                          {ac.verticalState === 'DESCENDING' && (
                            <ArrowDownRight className="w-3.5 h-3.5 text-[#C99B45]" />
                          )}
                          {ac.verticalState === 'LEVEL' && (
                            <Minus className="w-3.5 h-3.5 text-[#82909B]" />
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

                {/* Bottom Row: Speed, Heading, Vertical Rate (Pilot Log style) */}
                <div className="mt-2.5 pt-2 border-t border-[#D6E0E7] flex items-center justify-between text-xs text-[#82909B] font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#172D40]">
                      Speed: {ac.velocityKnots !== null ? `${ac.velocityKnots} kt` : '--'}
                    </span>
                    <span className="text-[#D6E0E7]">•</span>
                    <span className="flex items-center gap-1">
                      <Compass className="w-3 h-3 text-[#82909B]" />
                      {ac.heading !== null ? `${ac.heading}° ${ac.headingCardinal}` : '---'}
                    </span>
                  </div>

                  <div className="text-[11px]">
                    {ac.verticalRateFpm !== null && Math.abs(ac.verticalRateFpm) > 64 ? (
                      <span className={ac.verticalRateFpm > 0 ? 'text-[#467A67] font-semibold' : 'text-[#C99B45] font-semibold'}>
                        {ac.verticalRateFpm > 0 ? `+${ac.verticalRateFpm}` : ac.verticalRateFpm} fpm
                      </span>
                    ) : (
                      <span className="text-[#82909B]">Level</span>
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
