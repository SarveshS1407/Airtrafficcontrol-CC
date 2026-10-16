import React from 'react';
import { Plane, Compass, Navigation } from 'lucide-react';
import { ATCStatistics } from '../../types/telemetry';

interface MetricsBannerProps {
  stats: ATCStatistics;
}

export const MetricsBanner: React.FC<MetricsBannerProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-1.5 p-2 bg-atc-950/80 border-b border-atc-800">
      {/* Total & Filtered */}
      <div className="bg-atc-900/90 border border-atc-800 rounded p-1.5 flex flex-col justify-between">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Navigation className="w-3 h-3 text-cyan-400" />
          TOTAL
        </span>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-base font-bold font-mono text-cyan-300">
            {stats.filteredCount}
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            /{stats.totalTracked}
          </span>
        </div>
      </div>

      {/* Airborne */}
      <div className="bg-atc-900/90 border border-atc-800 rounded p-1.5 flex flex-col justify-between">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Plane className="w-3 h-3 text-emerald-400" />
          AIRBORNE
        </span>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-base font-bold font-mono text-emerald-400">
            {stats.airborneCount}
          </span>
          <span className="text-[10px] font-mono text-emerald-500/70">
            FLYING
          </span>
        </div>
      </div>

      {/* On Ground */}
      <div className="bg-atc-900/90 border border-atc-800 rounded p-1.5 flex flex-col justify-between">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Compass className="w-3 h-3 text-amber-400" />
          GROUND
        </span>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-base font-bold font-mono text-amber-400">
            {stats.onGroundCount}
          </span>
          <span className="text-[10px] font-mono text-amber-500/70">
            TAXI/PARK
          </span>
        </div>
      </div>
    </div>
  );
};
