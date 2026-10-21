import React from 'react';
import { MapPin, X, Globe2, ArrowUpRight } from 'lucide-react';
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
    return `${Math.abs(val).toFixed(2)}° ${dir}`;
  };

  return (
    <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-4 shadow-xl backdrop-blur-md font-sans text-xs text-slate-700 max-w-sm w-full select-none animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-aviation-sky/15 flex items-center justify-center text-aviation-navy shrink-0">
            <MapPin className="w-4 h-4 text-aviation-navy" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-aviation-navy uppercase tracking-wider font-semibold block">
              Monitored Airspace
            </span>
            <h4 className="font-bold text-slate-900 text-sm truncate">{target.name}</h4>
            <span className="text-[11px] text-slate-400">
              {formatCoord(target.lat, true)}, {formatCoord(target.lng, false)}
            </span>
          </div>
        </div>

        <button
          onClick={onClear}
          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition shrink-0"
          title="Return to global view"
          aria-label="Close location monitoring"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Radius Controls */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
          <span>Surveillance radius</span>
          <span className="text-aviation-navy font-semibold">{target.radiusKm} km</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {RADIUS_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => onSelectRadius(r)}
              className={`py-1.5 rounded-lg text-center transition font-semibold text-xs ${
                target.radiusKm === r
                  ? 'bg-aviation-navy text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-aviation-navy'
              }`}
            >
              {r} km
            </button>
          ))}
        </div>
      </div>

      {/* Target Airspace Live Stats */}
      <div className="grid grid-cols-2 gap-2 bg-aviation-cloud/70 p-2.5 rounded-xl border border-slate-200/60 text-xs mb-3">
        <div>
          <span className="text-slate-500 block text-[11px]">Aircraft nearby</span>
          <span className="text-aviation-navy font-bold text-base">{inRadiusCount}</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[11px]">Closest aircraft</span>
          {closestAircraft ? (
            <button
              onClick={() => onSelectAircraft?.(closestAircraft!.aircraft.icao24)}
              className="text-left group flex items-center gap-1 font-semibold text-aviation-navy hover:text-aviation-sky transition mt-0.5"
              title="Inspect closest aircraft"
            >
              <span className="truncate">{closestAircraft.aircraft.callsign}</span>
              <span className="text-aviation-green font-normal text-[11px]">
                ({closestAircraft.distanceKm.toFixed(0)} km)
              </span>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
            </button>
          ) : (
            <span className="text-slate-400 text-xs">None in radius</span>
          )}
        </div>
      </div>

      {/* Quick Action Footer */}
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="text-slate-400 text-[11px]">
          Click map to relocate
        </span>
        <button
          onClick={onClear}
          className="text-aviation-navy hover:text-aviation-sky font-semibold flex items-center gap-1.5 text-xs transition"
        >
          <Globe2 className="w-3.5 h-3.5" />
          <span>Back to global view</span>
        </button>
      </div>
    </div>
  );
};
