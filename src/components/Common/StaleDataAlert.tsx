import React from 'react';
import { AlertTriangle, RefreshCw, Database } from 'lucide-react';
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
  const { freshness, lastError, lastSuccessfulFetch, rateLimitBackoffUntil, status } =
    apiStatus;

  if (freshness !== 'STALE' && status !== 'ERROR' && status !== 'RATE_LIMITED') {
    return null;
  }

  const lastTimeString = lastSuccessfulFetch
    ? new Date(lastSuccessfulFetch).toLocaleTimeString()
    : 'Unknown';

  const isRateLimited = status === 'RATE_LIMITED';
  const now = Date.now();
  const backoffSec = rateLimitBackoffUntil && rateLimitBackoffUntil > now
    ? Math.ceil((rateLimitBackoffUntil - now) / 1000)
    : 0;

  return (
    <div className="bg-amber-950/80 border-b border-amber-500/40 px-4 py-2 text-amber-200 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
        <div>
          <span className="font-semibold uppercase tracking-wider text-amber-300">
            {isRateLimited ? 'OpenSky Rate Limit Throttled (HTTP 429)' : 'Telemetry Refresh Interrupted'}:
          </span>{' '}
          <span className="text-amber-100/90">
            {lastError || 'Network request failed.'}
          </span>{' '}
          {aircraftCount > 0 && (
            <span className="text-amber-300/80">
              Preserving last verified snapshot ({aircraftCount} aircraft, updated {lastTimeString}).
            </span>
          )}
          {isRateLimited && backoffSec > 0 && (
            <span className="font-mono font-bold text-amber-300 ml-1">
              [Auto-retry in {backoffSec}s]
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onRetry}
          disabled={status === 'FETCHING' || backoffSec > 0}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-200 font-mono text-xs transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${status === 'FETCHING' ? 'animate-spin' : ''}`} />
          Retry
        </button>
        <button
          onClick={onSwitchToDemo}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-500/40 text-cyan-200 font-mono text-xs transition"
        >
          <Database className="w-3.5 h-3.5" />
          Switch to Demo Fixtures
        </button>
      </div>
    </div>
  );
};
