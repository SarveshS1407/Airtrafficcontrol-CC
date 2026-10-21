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
      <div className="inline-flex rounded-lg p-0.5 bg-[#F4F0E7] border border-[#D6E0E7] text-xs">
        <button
          onClick={() => onToggleSource('LIVE')}
          className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
            source === 'LIVE'
              ? 'bg-[#FCFAF5] text-[#172D40] shadow-2xs font-bold'
              : 'text-[#82909B] hover:text-[#172D40]'
          }`}
          title="Connect to OpenSky Network live REST API"
        >
          Live OpenSky
        </button>
        <button
          onClick={() => onToggleSource('DEMO')}
          className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
            source === 'DEMO'
              ? 'bg-amber-100 text-[#C99B45] shadow-2xs font-bold'
              : 'text-[#82909B] hover:text-[#172D40]'
          }`}
          title="Recorded flight vectors with physics simulation (offline friendly)"
        >
          Demo Fixtures
        </button>
      </div>

      {/* Freshness / Polling status indicator */}
      {source === 'DEMO' ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-amber-50 border border-amber-200 text-[#C99B45] font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#C99B45] animate-pulse"></span>
          Demo Mode
        </span>
      ) : isBackoff ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-red-50 border border-red-200 text-[#C94C4C] font-semibold font-mono">
          <span className="w-2 h-2 rounded-full bg-[#C94C4C] animate-ping"></span>
          Rate Limited ({backoffRemainingSec}s)
        </span>
      ) : status === 'FETCHING' ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-blue-50 border border-blue-200 text-[#456D8B] font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#456D8B] animate-pulse"></span>
          Scanning...
        </span>
      ) : freshness === 'STALE' ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-amber-50 border border-amber-200 text-[#C99B45] font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#C99B45]"></span>
          Stale Data
        </span>
      ) : isPaused ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-[#F4F0E7] border border-[#D6E0E7] text-[#82909B] font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#82909B]"></span>
          Paused
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-emerald-50 border border-emerald-200 text-[#467A67] font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#467A67] animate-pulse"></span>
          Live Feed Active
        </span>
      )}
    </div>
  );
};
