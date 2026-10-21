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
    <div className="flex items-center gap-2 font-sans">
      {/* Source Toggle */}
      <div className="inline-flex rounded-lg p-0.5 bg-aviation-cloud border border-aviation-border text-xs">
        <button
          onClick={() => onToggleSource('LIVE')}
          className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors ${
            source === 'LIVE'
              ? 'bg-white text-aviation-navy shadow-xs font-semibold'
              : 'text-aviation-muted hover:text-aviation-navy'
          }`}
          title="Connect to OpenSky Network live REST API"
        >
          Live OpenSky
        </button>
        <button
          onClick={() => onToggleSource('DEMO')}
          className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors ${
            source === 'DEMO'
              ? 'bg-amber-100 text-aviation-amber shadow-xs font-semibold'
              : 'text-aviation-muted hover:text-aviation-navy'
          }`}
          title="Recorded flight vectors with physics simulation (offline friendly)"
        >
          Demo Fixtures
        </button>
      </div>

      {/* Freshness / Polling status indicator */}
      {source === 'DEMO' ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-amber-50 border border-amber-200 text-aviation-amber font-medium">
          <span className="w-2 h-2 rounded-full bg-aviation-amber animate-pulse"></span>
          Demo Mode
        </span>
      ) : isBackoff ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-red-50 border border-red-200 text-aviation-red font-medium">
          <span className="w-2 h-2 rounded-full bg-aviation-red animate-ping"></span>
          Rate Limited ({backoffRemainingSec}s)
        </span>
      ) : status === 'FETCHING' ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-blue-50 border border-blue-200 text-aviation-sky font-medium">
          <span className="w-2 h-2 rounded-full bg-aviation-sky animate-pulse"></span>
          Scanning...
        </span>
      ) : freshness === 'STALE' ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-amber-50 border border-amber-200 text-aviation-amber font-medium">
          <span className="w-2 h-2 rounded-full bg-aviation-amber"></span>
          Stale Data
        </span>
      ) : isPaused ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-100 border border-slate-200 text-aviation-muted font-medium">
          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          Paused
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-emerald-50 border border-emerald-200 text-aviation-green font-medium">
          <span className="w-2 h-2 rounded-full bg-aviation-green animate-pulse"></span>
          Live Feed Active
        </span>
      )}
    </div>
  );
};
