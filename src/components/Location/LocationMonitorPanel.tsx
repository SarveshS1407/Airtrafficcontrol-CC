import React from 'react';
import { MapPin, X, Globe2, ArrowUpRight, Compass } from 'lucide-react';
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
    <div className="bg-[#FCFAF5]/95 border border-[#D6E0E7] rounded-2xl p-4 shadow-xl backdrop-blur-md font-sans text-xs text-[#172D40] max-w-sm w-full select-none animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-[#D6E0E7] pb-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#20394D] flex items-center justify-center text-white shrink-0 shadow-xs">
            <Compass className="w-4 h-4 text-[#8DB7D5]" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-[#D87C43] uppercase tracking-wider font-bold block tech-stamp">
              Explore traffic around here
            </span>
            <h4 className="font-bold text-[#172D40] text-sm truncate">{target.name}</h4>
            <span className="text-[10px] text-[#82909B] font-mono block">
              LAT {formatCoord(target.lat, true)} • LON {formatCoord(target.lng, false)}
            </span>
          </div>
        </div>

        <button
          onClick={onClear}
          className="text-[#82909B] hover:text-[#172D40] p-1.5 rounded-lg hover:bg-[#F4F0E7] transition shrink-0"
          title="Return to global view"
          aria-label="Close location monitoring"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Radius Controls */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-[#82909B] mb-1.5 font-medium">
          <span>Surveillance radius</span>
          <span className="text-[#172D40] font-bold font-mono">{target.radiusKm} km</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {RADIUS_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => onSelectRadius(r)}
              className={`py-1.5 rounded-lg text-center transition font-semibold text-xs ${
                target.radiusKm === r
                  ? 'bg-[#20394D] text-white shadow-xs'
                  : 'bg-[#F4F0E7] hover:bg-[#EBF3FA] border border-[#D6E0E7] text-[#172D40]'
              }`}
            >
              {r} km
            </button>
          ))}
        </div>
      </div>

      {/* Target Airspace Live Stats */}
      <div className="grid grid-cols-2 gap-2 bg-[#F4F0E7] p-2.5 rounded-xl border border-[#D6E0E7] text-xs mb-3">
        <div>
          <span className="text-[#82909B] block text-[11px]">Aircraft in radius</span>
          <span className="text-[#172D40] font-bold text-base font-mono">{inRadiusCount}</span>
        </div>

        <div>
          <span className="text-[#82909B] block text-[11px]">Closest aircraft</span>
          {closestAircraft ? (
            <button
              onClick={() => onSelectAircraft?.(closestAircraft!.aircraft.icao24)}
              className="text-left group flex items-center gap-1 font-semibold text-[#172D40] hover:text-[#D87C43] transition mt-0.5"
              title="Inspect closest aircraft"
            >
              <span className="truncate">{closestAircraft.aircraft.callsign}</span>
              <span className="text-[#467A67] font-normal text-[11px] font-mono">
                ({closestAircraft.distanceKm.toFixed(0)} km)
              </span>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
            </button>
          ) : (
            <span className="text-[#82909B] text-xs">None in radius</span>
          )}
        </div>
      </div>

      {/* Quick Action Footer */}
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="text-[#82909B] text-[11px] flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#D87C43]" />
          Click map to relocate
        </span>
        <button
          onClick={onClear}
          className="text-[#D87C43] hover:text-[#20394D] font-semibold flex items-center gap-1.5 text-xs transition"
        >
          <Globe2 className="w-3.5 h-3.5" />
          <span>Back to global view</span>
        </button>
      </div>
    </div>
  );
};
