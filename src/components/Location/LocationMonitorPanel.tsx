import React from 'react';
import { Radio, Crosshair, X, Globe2, Compass, ArrowUpRight } from 'lucide-react';
import { MonitoringTarget } from '../../store/useAtcStore';
import { Aircraft } from '../../types/opensky';
import { calculateDistanceKm } from '../../services/geoUtils';

interface LocationMonitorPanelProps {
  target: MonitoringTarget | null;
  aircraftList: Aircraft[];
  onSelectRadius: (radiusKm: number) => void;
  onClear: () => void;
  onSelectAircraft?: (icao24: string) => void;
}

const RADIUS_OPTIONS = [25, 50, 100, 250];

export const LocationMonitorPanel: React.FC<LocationMonitorPanelProps> = ({
  target,
  aircraftList,
  onSelectRadius,
  onClear,
  onSelectAircraft,
}) => {
  if (!target) return null;

  // Calculate aircraft within target radius and find closest
  let closestAircraft: { aircraft: Aircraft; distanceKm: number } | null = null;
  let inRadiusCount = 0;

  for (const ac of aircraftList) {
    if (ac.latitude !== null && ac.longitude !== null) {
      const dist = calculateDistanceKm(target.lat, target.lng, ac.latitude, ac.longitude);
      if (dist <= target.radiusKm) {
        inRadiusCount++;
        if (!closestAircraft || dist < closestAircraft.distanceKm) {
          closestAircraft = { aircraft: ac, distanceKm: dist };
        }
      }
    }
  }

  const formatCoord = (val: number, isLat: boolean) => {
    const dir = isLat ? (val >= 0 ? 'N' : 'S') : val >= 0 ? 'E' : 'W';
    return `${Math.abs(val).toFixed(4)}° ${dir}`;
  };

  return (
    <div className="bg-slate-950/90 border border-cyan-500/50 rounded-xl p-3 shadow-2xl backdrop-blur-md font-mono text-xs text-slate-100 max-w-sm w-full select-none animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative">
            <Radio className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="w-2 h-2 rounded-full bg-cyan-400 absolute -top-0.5 -right-0.5 animate-ping" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-xs truncate">{target.name}</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold">
                MONITORED
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              {formatCoord(target.lat, true)}, {formatCoord(target.lng, false)}
            </div>
          </div>
        </div>

        <button
          onClick={onClear}
          className="text-slate-400 hover:text-rose-400 p-1 rounded hover:bg-slate-900 transition shrink-0"
          title="Clear monitoring sector (Return to global overview)"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Radius Controls */}
      <div className="mb-2.5">
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
          <span className="flex items-center gap-1">
            <Crosshair className="w-3 h-3 text-cyan-400" />
            SURVEILLANCE RADIUS
          </span>
          <span className="text-cyan-300 font-bold">{target.radiusKm} KM ({Math.round(target.radiusKm * 0.539957)} NM)</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {RADIUS_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => onSelectRadius(r)}
              className={`py-1 rounded text-center transition font-bold text-[10px] ${
                target.radiusKm === r
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {r} km
            </button>
          ))}
        </div>
      </div>

      {/* Target Airspace Live Stats */}
      <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-[10px] mb-2">
        <div>
          <span className="text-slate-400 block">SECTOR TRAFFIC</span>
          <span className="text-cyan-300 font-bold text-sm">{inRadiusCount}</span>
          <span className="text-slate-500 text-[9px] block">aircraft detected</span>
        </div>

        <div>
          <span className="text-slate-400 block">CLOSEST TARGET</span>
          {closestAircraft ? (
            <button
              onClick={() => onSelectAircraft?.(closestAircraft!.aircraft.icao24)}
              className="text-left group flex items-center gap-1 font-bold text-white hover:text-cyan-300 transition"
              title="Inspect closest aircraft"
            >
              <span>{closestAircraft.aircraft.callsign}</span>
              <span className="text-emerald-400 font-normal">
                ({closestAircraft.distanceKm.toFixed(1)} km)
              </span>
              <ArrowUpRight className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition" />
            </button>
          ) : (
            <span className="text-slate-500">None in perimeter</span>
          )}
        </div>
      </div>

      {/* Quick Action Footer */}
      <div className="flex items-center justify-between text-[10px] pt-1">
        <span className="text-slate-400 flex items-center gap-1">
          <Compass className="w-3 h-3 text-cyan-400" />
          Click any map point to re-anchor
        </span>
        <button
          onClick={onClear}
          className="text-cyan-400 hover:text-cyan-300 underline font-semibold flex items-center gap-1"
        >
          <Globe2 className="w-3 h-3" />
          Reset Global
        </button>
      </div>
    </div>
  );
};
