import React from 'react';
import {
  EditorialCloud,
  AirportControlTowerIllustration,
  GlobeRouteIllustration,
} from './AviationIllustrations';
import { CommercialAircraftIcon } from './AviationIcons';

/**
 * 1. Empty State: No Aircraft in Area
 */
export const NoAircraftEmptyState: React.FC<{
  onReset?: () => void;
  className?: string;
}> = ({ onReset, className = '' }) => (
  <div className={`text-center py-10 px-4 flex flex-col items-center justify-center ${className}`}>
    {/* Illustration: Cloud + Tiny Aircraft flying along dotted arc */}
    <div className="relative w-44 h-24 mb-4 flex items-center justify-center">
      <EditorialCloud width={110} height={58} className="absolute top-2 left-3 opacity-90" />
      <svg
        width="160"
        height="70"
        viewBox="0 0 160 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-1"
      >
        <path
          d="M10 55 C 40 15, 110 10, 150 45"
          stroke="#D87C43"
          strokeWidth="1.75"
          strokeDasharray="4 3"
          strokeLinecap="round"
        />
        {/* Tiny plane flying past */}
        <g transform="translate(118, 22) rotate(25)">
          <path
            d="M0 -7 C-0.5 -7 -0.8 -6 -0.8 -5 V-1 L-6 2 V3 L-0.8 1.8 V5.5 L-2.5 7 V8 L0 7.2 L2.5 8 V7 L0.8 5.5 V1.8 L6 3 V2 L0.8 -1 V-5 C0.8 -6 0.5 -7 0 -7 Z"
            fill="#D87C43"
          />
        </g>
      </svg>
    </div>

    {/* Message from prompt requirements */}
    <h4 className="text-base font-bold text-[#172D40] dark:text-[#E3ECF3] font-mono">
      No Aircraft In View
    </h4>
    <p className="text-xs text-[#456D8B] dark:text-[#8DB7D5] max-w-xs mt-1.5 leading-relaxed">
      Nothing passing through here just yet. Try widening your search area or explore the global view.
    </p>

    {onReset && (
      <button
        onClick={onReset}
        className="mt-4 px-4 py-2 rounded bg-[#FCFAF5] dark:bg-[#20394D] border border-[#D6E0E7] dark:border-[#2D4B63] hover:border-[#D87C43] text-xs font-mono font-bold text-[#20394D] dark:text-[#E3ECF3] transition shadow-2xs"
      >
        Return to Global View
      </button>
    )}
  </div>
);

/**
 * 2. Empty State: Unavailable Live Data / Cloud Blocked
 */
export const OfflineOrBlockedEmptyState: React.FC<{
  onLoadDemo?: () => void;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
}> = ({ onLoadDemo, onRetry, isRetrying = false, className = '' }) => (
  <div className={`p-6 bg-[#FCFAF5] dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] rounded-xl text-center flex flex-col items-center ${className}`}>
    <AirportControlTowerIllustration width={64} height={80} className="mb-3" />

    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#F4F0E7] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] text-[10px] font-mono text-[#D87C43] font-bold uppercase mb-2">
      FEED STATUS: RESTRICTED
    </div>

    <h4 className="text-sm font-bold text-[#172D40] dark:text-[#E3ECF3] font-mono">
      Live Flight Feed Temporarily Throttled
    </h4>

    <p className="text-xs text-[#456D8B] dark:text-[#8DB7D5] max-w-sm mt-1.5 leading-relaxed">
      OpenSky Network public cloud rate limits are currently active. You can continue monitoring with authentic demonstration flights or retry the live connection.
    </p>

    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
      {onLoadDemo && (
        <button
          onClick={onLoadDemo}
          className="px-3.5 py-2 rounded bg-[#D87C43] hover:bg-[#C26B34] text-white text-xs font-mono font-bold transition shadow-xs"
        >
          Explore Demonstration Flights
        </button>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="px-3 py-2 rounded bg-white dark:bg-[#20394D] border border-[#D6E0E7] dark:border-[#2D4B63] hover:border-[#456D8B] text-xs font-mono text-[#20394D] dark:text-[#E3ECF3] transition"
        >
          {isRetrying ? 'Connecting...' : 'Retry Live Sweep'}
        </button>
      )}
    </div>
  </div>
);

/**
 * 3. Empty State: Location Search Prompt
 */
export const LocationPromptEmptyState: React.FC<{
  onSelectHub?: (hub: { name: string; lat: number; lng: number }) => void;
  className?: string;
}> = ({ onSelectHub, className = '' }) => {
  const popularHubs = [
    { code: 'LHR', name: 'London Heathrow', lat: 51.47, lng: -0.4543 },
    { code: 'JFK', name: 'New York JFK', lat: 40.6413, lng: -73.7781 },
    { code: 'HND', name: 'Tokyo Haneda', lat: 35.5494, lng: 139.7798 },
    { code: 'DXB', name: 'Dubai Intl', lat: 25.2532, lng: 55.3657 },
    { code: 'SIN', name: 'Singapore Changi', lat: 1.3644, lng: 103.9915 },
  ];

  return (
    <div className={`text-center py-6 px-4 flex flex-col items-center ${className}`}>
      <GlobeRouteIllustration size={80} className="mb-2" />

      <h4 className="text-sm font-bold text-[#172D40] dark:text-[#E3ECF3] font-mono">
        Choose a place to begin exploring.
      </h4>

      <p className="text-xs text-[#456D8B] dark:text-[#8DB7D5] max-w-xs mt-1 leading-relaxed">
        Search for any city, aerodrome, or landmark above, or quickly jump to a featured hub below.
      </p>

      {onSelectHub && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 max-w-sm">
          {popularHubs.map((hub) => (
            <button
              key={hub.code}
              onClick={() => onSelectHub(hub)}
              className="px-2.5 py-1 rounded bg-[#FCFAF5] dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] hover:border-[#D87C43] text-[11px] font-mono font-bold text-[#20394D] dark:text-[#E3ECF3] transition"
            >
              [ {hub.code} ]
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * 4. Loading State: Lightweight Radar Sweep
 */
export const RadarLoadingState: React.FC<{
  label?: string;
  className?: string;
}> = ({ label = 'Performing Airspace Radar Sweep...', className = '' }) => (
  <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
    <div className="relative w-16 h-16 mb-3">
      {/* Outer compass ring */}
      <div className="w-16 h-16 rounded-full border-2 border-[#D6E0E7] dark:border-[#2D4B63] relative flex items-center justify-center">
        {/* Radar beam rotating */}
        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[#D87C43] animate-spin" />
        <CommercialAircraftIcon size={22} color="#D87C43" className="transform -rotate-45" />
      </div>
    </div>
    <span className="text-xs font-mono font-bold text-[#172D40] dark:text-[#E3ECF3] tracking-wide">
      {label}
    </span>
    <span className="text-[10px] font-mono text-[#82909B] mt-0.5">
      INTERROGATING TRANSPONDER SIGNALS
    </span>
  </div>
);
