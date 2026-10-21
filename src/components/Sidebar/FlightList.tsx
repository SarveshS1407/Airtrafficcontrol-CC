import React from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Search,
  Flame,
  X,
  Star,
} from 'lucide-react';
import { Aircraft } from '../../types/opensky';
import { AircraftSortConfig, SortField } from '../../types/filter';
import { ApiStatus } from '../../types/telemetry';
import {
  CommercialAircraftIcon,
  AltimeterIcon,
  AirspeedIcon,
  CompassHeadingIcon,
  NoAircraftEmptyState,
  OfflineOrBlockedEmptyState,
} from '../AviationDesignSystem';

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
          <div className="my-2 bg-[#FCFAF5] dark:bg-[#172D40] rounded-2xl border border-[#D6E0E7] dark:border-[#2D4B63] shadow-2xs">
            {apiStatus?.status === 'RATE_LIMITED' || apiStatus?.status === 'ERROR' ? (
              <OfflineOrBlockedEmptyState onLoadDemo={onSwitchToDemo} />
            ) : (
              <>
                <NoAircraftEmptyState onReset={onResetFilters} />
                {isLive && onSwitchToDemo && (
                  <div className="pb-6 text-center">
                    <button
                      onClick={onSwitchToDemo}
                      className="px-4 py-2 bg-[#20394D] hover:bg-[#172D40] text-white rounded-xl text-xs font-semibold font-mono transition shadow-xs"
                    >
                      Explore with Demonstration Flights
                    </button>
                  </div>
                )}
              </>
            )}
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
                    ? 'bg-[#EBF3FA] dark:bg-[#20394D] border-l-4 border-l-[#D87C43] border-[#8DB7D5] dark:border-[#D87C43] shadow-xs'
                    : isEmergency
                    ? 'bg-red-50 dark:bg-red-950/30 border-[#C94C4C] hover:border-red-500'
                    : 'bg-[#FCFAF5] dark:bg-[#172D40] hover:bg-[#F4F0E7] dark:hover:bg-[#20394D]/70 border-[#D6E0E7] dark:border-[#2D4B63] hover:border-[#8DB7D5] shadow-2xs'
                }`}
              >
                {/* Top Row: Callsign, Airplane Icon, Origin Country, Watchlist */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-transform hover:scale-105 ${
                        isEmergency
                          ? 'bg-red-100 text-[#C94C4C] border-[#C94C4C]'
                          : isSelected
                          ? 'bg-[#D87C43] text-white border-[#D87C43]'
                          : ac.onGround
                          ? 'bg-[#F4F0E7] dark:bg-[#101E2B] text-[#82909B] border-[#D6E0E7] dark:border-[#2D4B63]'
                          : 'bg-[#F4F0E7] dark:bg-[#101E2B] text-[#20394D] dark:text-[#8DB7D5] border-[#D6E0E7] dark:border-[#2D4B63]'
                      }`}
                    >
                      <CommercialAircraftIcon
                        size={16}
                        style={{
                          transform: `rotate(${ac.heading !== null ? ac.heading : 0}deg)`,
                          transition: 'transform 0.4s cubic-bezier(0.2, 0, 0, 1)',
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#82909B] dark:text-[#8DB7D5] font-mono uppercase">AIRCRAFT /</span>
                        <span className="font-mono font-bold text-sm text-[#172D40] dark:text-[#E3ECF3] tracking-tight">
                          {ac.callsign}
                        </span>
                        {isEmergency && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950 border border-[#C94C4C] text-[#C94C4C] font-bold animate-pulse font-mono">
                            EMERG {ac.squawk}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#82909B] dark:text-[#8DB7D5] truncate max-w-[170px]">
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
                        className={`p-1 rounded-lg hover:bg-[#D6E0E7]/60 dark:hover:bg-[#2D4B63] transition ${
                          watchlist?.includes(ac.icao24.toLowerCase())
                            ? 'text-[#C99B45]'
                            : 'text-[#D6E0E7] dark:text-[#456D8B] hover:text-[#82909B]'
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
                        <span className="text-xs font-semibold text-[#82909B] bg-[#F4F0E7] dark:bg-[#101E2B] px-2 py-0.5 rounded-md border border-[#D6E0E7] dark:border-[#2D4B63] font-mono">
                          On Ground
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#172D40] dark:text-[#E3ECF3] font-mono">
                          <AltimeterIcon size={13} color="#82909B" />
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

                {/* Bottom Row: Speed, Dynamic Rotating Heading, Vertical Rate */}
                <div className="mt-2.5 pt-2 border-t border-[#D6E0E7] dark:border-[#2D4B63] flex items-center justify-between text-xs text-[#82909B] dark:text-[#8DB7D5] font-mono">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center gap-1 font-medium text-[#172D40] dark:text-[#E3ECF3]">
                      <AirspeedIcon size={13} color="#82909B" />
                      Speed: {ac.velocityKnots !== null ? `${ac.velocityKnots} kt` : '--'}
                    </span>
                    <span className="text-[#D6E0E7] dark:text-[#2D4B63]">•</span>
                    <span className="flex items-center gap-1 text-[#20394D] dark:text-[#E3ECF3]">
                      <CompassHeadingIcon size={14} heading={ac.heading ?? 0} color="#D87C43" />
                      {ac.heading !== null ? `${ac.heading}° ${ac.headingCardinal}` : '---'}
                    </span>
                  </div>

                  <div className="text-[11px]">
                    {ac.verticalRateFpm !== null && Math.abs(ac.verticalRateFpm) > 64 ? (
                      <span className={ac.verticalRateFpm > 0 ? 'text-[#467A67] font-semibold' : 'text-[#C99B45] font-semibold'}>
                        {ac.verticalRateFpm > 0 ? `+${ac.verticalRateFpm}` : ac.verticalRateFpm} fpm
                      </span>
                    ) : (
                      <span className="text-[#82909B] dark:text-[#8DB7D5]">Level</span>
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
