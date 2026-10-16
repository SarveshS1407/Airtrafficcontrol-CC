import React from 'react';
import { ApiStatus, DataSource } from '../../types/telemetry';

interface StatusBadgeProps {
  apiStatus: ApiStatus;
  isPaused: boolean;
  onToggleSource: (source: DataSource) => void;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  apiStatus,
  isPaused,
  onToggleSource,
}) => {
  const { source, status, freshness, rateLimitBackoffUntil } = apiStatus;

  const now = Date.now();
  const isBackoff =
    rateLimitBackoffUntil !== null && rateLimitBackoffUntil > now;
  const backoffRemainingSec = isBackoff
    ? Math.max(0, Math.ceil((rateLimitBackoffUntil - now) / 1000))
    : 0;

  return (
    <div className="flex items-center gap-2">
      {/* Source Toggle */}
      <div className="inline-flex rounded-md p-0.5 bg-atc-950 border border-atc-700 text-xs">
        <button
          onClick={() => onToggleSource('LIVE')}
          className={`px-2.5 py-1 rounded font-mono font-medium transition-colors ${
            source === 'LIVE'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Connect to OpenSky Network live REST API"
        >
          LIVE OPENSKY
        </button>
        <button
          onClick={() => onToggleSource('DEMO')}
          className={`px-2.5 py-1 rounded font-mono font-medium transition-colors ${
            source === 'DEMO'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Recorded flight vectors with physics simulation (offline friendly)"
        >
          DEMO FIXTURES
        </button>
      </div>

      {/* Freshness / Polling status indicator */}
      {source === 'DEMO' ? (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono bg-amber-950/60 border border-amber-600/40 text-amber-300">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          DEMO SIMULATION
        </span>
      ) : isBackoff ? (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono bg-rose-950/60 border border-rose-600/40 text-rose-300">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          429 RATE LIMIT ({backoffRemainingSec}s)
        </span>
      ) : status === 'FETCHING' ? (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono bg-cyan-950/60 border border-cyan-600/40 text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          RADAR SCANNING...
        </span>
      ) : freshness === 'STALE' ? (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono bg-amber-950/60 border border-amber-600/40 text-amber-300">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          STALE SNAPSHOT
        </span>
      ) : isPaused ? (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono bg-slate-800 border border-slate-600 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          PAUSED
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono bg-emerald-950/60 border border-emerald-600/40 text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          LIVE RADAR ACTIVE
        </span>
      )}
    </div>
  );
};
