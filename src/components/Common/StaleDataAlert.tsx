import React from 'react';
import { AlertTriangle, RefreshCw, Compass } from 'lucide-react';
import { ApiStatus } from '../../types/telemetry';

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
  const { freshness, rateLimitBackoffUntil, status } =
    apiStatus;

  if (freshness !== 'STALE' && status !== 'ERROR' && status !== 'RATE_LIMITED') {
    return null;
  }

  const isRateLimited = status === 'RATE_LIMITED';
  const now = Date.now();
  const backoffSec = rateLimitBackoffUntil && rateLimitBackoffUntil > now
    ? Math.ceil((rateLimitBackoffUntil - now) / 1000)
    : 0;

  return (
    <div className="bg-amber-50/95 border-b border-amber-200 px-4 py-2.5 text-amber-900 text-xs sm:text-sm flex flex-wrap items-center justify-between gap-3 shadow-sm backdrop-blur-sm z-30 transition-all">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        </div>
        <div>
          <span className="font-semibold text-amber-950">
            Live flight data is temporarily unavailable.
          </span>{' '}
          <span className="text-amber-800">
            You can continue exploring with demonstration flights{aircraftCount > 0 ? ` (showing ${aircraftCount} recent aircraft)` : ''}.
          </span>
          {isRateLimited && backoffSec > 0 && (
            <span className="font-mono text-xs font-semibold text-amber-700 ml-1">
              [Auto-retry in {backoffSec}s]
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onRetry}
          disabled={status === 'FETCHING' || backoffSec > 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-amber-100/70 border border-amber-300 text-amber-900 font-medium text-xs shadow-sm transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${status === 'FETCHING' ? 'animate-spin' : ''}`} />
          Try Again
        </button>
        <button
          onClick={onSwitchToDemo}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-aviation-navy hover:bg-aviation-midnight text-white font-medium text-xs shadow-sm transition"
        >
          <Compass className="w-3.5 h-3.5 text-aviation-sky" />
          Use Demonstration Data
        </button>
      </div>
    </div>
  );
};
