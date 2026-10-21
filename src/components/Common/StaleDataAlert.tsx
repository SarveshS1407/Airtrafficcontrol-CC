import React from 'react';
import { AlertTriangle, Compass } from 'lucide-react';
import { ApiStatus } from '../../types/telemetry';
import { AviationRefreshIcon } from '../AviationDesignSystem';

interface StaleDataAlertProps {
  apiStatus: ApiStatus;
  aircraftCount: number;
  onRetry: () => void;
  onSwitchToDemo: () => void;
}

export const StaleDataAlert: React.FC<StaleDataAlertProps> = ({
  apiStatus,
  aircraftCount,
  onRetry,
  onSwitchToDemo,
}) => {
  const { freshness, rateLimitBackoffUntil, status } = apiStatus;

  if (freshness !== 'STALE' && status !== 'ERROR' && status !== 'RATE_LIMITED') {
    return null;
  }

  const isRateLimited = status === 'RATE_LIMITED';
  const now = Date.now();
  const backoffSec = rateLimitBackoffUntil && rateLimitBackoffUntil > now
    ? Math.ceil((rateLimitBackoffUntil - now) / 1000)
    : 0;

  return (
    <div className="bg-[#FCFAF5] dark:bg-[#101E2B] border-b border-[#D6E0E7] dark:border-[#2D4B63] px-4 py-2.5 text-[#172D40] dark:text-[#E3ECF3] text-xs sm:text-sm flex flex-wrap items-center justify-between gap-3 shadow-sm backdrop-blur-sm z-30 transition-all font-sans">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 border border-[#C99B45] flex items-center justify-center shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 text-[#C99B45]" />
        </div>
        <div>
          <span className="font-bold text-[#172D40] dark:text-white">
            Live flight data is temporarily unavailable.
          </span>{' '}
          <span className="text-[#82909B] dark:text-[#8DB7D5]">
            You can continue exploring with demonstration flights{aircraftCount > 0 ? ` (showing ${aircraftCount} recent aircraft)` : ''}.
          </span>
          {isRateLimited && backoffSec > 0 && (
            <span className="font-mono text-xs font-bold text-[#C99B45] ml-1">
              [Auto-retry in {backoffSec}s]
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onRetry}
          disabled={status === 'FETCHING' || backoffSec > 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4F0E7] dark:bg-[#172D40] hover:bg-[#EBF3FA] dark:hover:bg-[#20394D] border border-[#D6E0E7] dark:border-[#2D4B63] text-[#172D40] dark:text-[#E3ECF3] font-semibold text-xs shadow-2xs transition disabled:opacity-50"
        >
          <AviationRefreshIcon size={14} className={status === 'FETCHING' ? 'animate-spin' : ''} />
          Try Again
        </button>
        <button
          onClick={onSwitchToDemo}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#20394D] dark:bg-[#D87C43] hover:bg-[#172D40] dark:hover:bg-[#C26B34] text-white font-semibold text-xs shadow-xs transition"
        >
          <Compass className="w-3.5 h-3.5 text-[#8DB7D5] dark:text-white" />
          Use Demonstration Data
        </button>
      </div>
    </div>
  );
};
