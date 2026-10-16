import React from 'react';
import { History, Info, Trash2 } from 'lucide-react';
import { AircraftObservation } from '../../types/opensky';
import { ATC_CONFIG } from '../../constants/config';
import { formatCoordinates } from '../../services/geoUtils';

interface MovementHistoryLogProps {
  observations: AircraftObservation[];
  callsign: string;
  onClearHistory: () => void;
}

export const MovementHistoryLog: React.FC<MovementHistoryLogProps> = ({
  observations,
  callsign,
  onClearHistory,
}) => {
  return (
    <div className="space-y-2.5">
      {/* Required Disclaimer Banner */}
      <div className="p-2.5 rounded bg-amber-950/40 border border-amber-600/30 text-[11px] text-amber-200/90 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {ATC_CONFIG.HISTORY_DISCLAIMER}
        </p>
      </div>

      <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5 font-semibold text-slate-300">
          <History className="w-3.5 h-3.5 text-cyan-400" />
          TRACKED WAYPOINTS ({observations.length})
        </span>
        {observations.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-rose-400 transition"
            title="Clear local movement history for this session"
          >
            <Trash2 className="w-3 h-3" />
            Clear Log
          </button>
        )}
      </div>

      {observations.length === 0 ? (
        <div className="p-4 rounded bg-atc-950/60 border border-atc-800 text-center font-mono text-xs text-slate-500">
          No movement points recorded for {callsign} yet.
        </div>
      ) : (
        <div className="max-h-48 overflow-y-auto rounded bg-atc-950/80 border border-atc-800 divide-y divide-atc-850 font-mono text-[10px]">
          {observations
            .slice()
            .reverse()
            .map((obs, idx) => {
              const timeStr = new Date(obs.timestamp).toLocaleTimeString();
              return (
                <div
                  key={`${obs.timestamp}-${idx}`}
                  className="px-2.5 py-1.5 flex items-center justify-between text-slate-300 hover:bg-atc-900/60 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{timeStr}</span>
                    <span className="text-cyan-400">
                      {formatCoordinates(obs.latitude, obs.longitude)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-right">
                    <span>
                      {obs.baroAltitudeFeet !== null
                        ? `${obs.baroAltitudeFeet.toLocaleString()} ft`
                        : 'GND'}
                    </span>
                    <span className="text-emerald-400">
                      {obs.velocityKnots !== null ? `${obs.velocityKnots} kts` : '--'}
                    </span>
                    <span className="text-slate-500 w-7">
                      {obs.heading !== null ? `${obs.heading}°` : '--'}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
