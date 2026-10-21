import React from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Globe2,
  AlertTriangle,
  Layers,
  Activity,
} from 'lucide-react';
import { Aircraft } from '../../types/opensky';

interface FleetAnalyticsViewProps {
  aircraftList: Aircraft[];
  onSelectAircraft: (icao24: string) => void;
  onClose: () => void;
}

export const FleetAnalyticsView: React.FC<FleetAnalyticsViewProps> = ({
  aircraftList,
  onSelectAircraft,
  onClose,
}) => {
  const total = aircraftList.length;

  // Airborne vs Ground
  const airborne = aircraftList.filter((a) => !a.onGround).length;
  const onGround = aircraftList.filter((a) => a.onGround).length;
  const airbornePct = total > 0 ? Math.round((airborne / total) * 100) : 0;
  const groundPct = total > 0 ? 100 - airbornePct : 0;

  // Altitude Distribution
  const altLow = aircraftList.filter((a) => (a.baroAltitudeFeet ?? 0) <= 10000 && !a.onGround).length;
  const altMid = aircraftList.filter((a) => (a.baroAltitudeFeet ?? 0) > 10000 && (a.baroAltitudeFeet ?? 0) <= 25000).length;
  const altHigh = aircraftList.filter((a) => (a.baroAltitudeFeet ?? 0) > 25000 && (a.baroAltitudeFeet ?? 0) <= 40000).length;
  const altVeryHigh = aircraftList.filter((a) => (a.baroAltitudeFeet ?? 0) > 40000).length;

  // Vertical Trends
  const climbing = aircraftList.filter((a) => a.verticalState === 'CLIMBING').length;
  const level = aircraftList.filter((a) => a.verticalState === 'LEVEL').length;
  const descending = aircraftList.filter((a) => a.verticalState === 'DESCENDING').length;

  // Speed Distribution
  const spdSlow = aircraftList.filter((a) => (a.velocityKnots ?? 0) < 180 && !a.onGround).length;
  const spdCruise = aircraftList.filter((a) => (a.velocityKnots ?? 0) >= 180 && (a.velocityKnots ?? 0) <= 480).length;
  const spdFast = aircraftList.filter((a) => (a.velocityKnots ?? 0) > 480).length;

  // Emergency Squawks
  const emergencies = aircraftList.filter((a) => ['7700', '7600', '7500'].includes(a.squawk ?? ''));

  // Country counts
  const countryMap: Record<string, number> = {};
  for (const ac of aircraftList) {
    const c = ac.originCountry || 'Unknown';
    countryMap[c] = (countryMap[c] || 0) + 1;
  }
  const topCountries = Object.entries(countryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div className="flex-1 bg-slate-950 p-4 sm:p-6 lg:p-8 overflow-y-auto font-sans text-slate-100">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold font-mono tracking-tight text-white uppercase">
                Fleet Telemetry & Operational Analytics
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Real-time statistical synthesis of active flight vectors in current airspace
            </p>
          </div>
          <button
            onClick={onClose}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-400 transition"
          >
            ← Return to Live Radar Map
          </button>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Active Feed</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{total}</div>
            <span className="text-[10px] text-cyan-400 flex items-center gap-1 mt-1">
              <Activity className="w-3 h-3" /> State vectors tracked
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Airborne Flights</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">{airborne}</div>
            <span className="text-[10px] text-slate-400 mt-1 block">{airbornePct}% of total volume</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Ground / Surface</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">{onGround}</div>
            <span className="text-[10px] text-slate-400 mt-1 block">{groundPct}% taxiing / parked</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Special Emergencies</span>
            <div className={`text-2xl sm:text-3xl font-extrabold mt-1 ${emergencies.length > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`}>
              {emergencies.length}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Squawk 7700 / 7600</span>
          </div>
        </div>

        {/* Emergency Alert Banner if any */}
        {emergencies.length > 0 && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/60 font-mono text-xs text-rose-200">
            <div className="flex items-center gap-2 font-bold text-rose-400 mb-2">
              <AlertTriangle className="w-4 h-4 animate-ping" />
              <span>ACTIVE TRANSPONDER EMERGENCIES DETECTED ({emergencies.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {emergencies.map((em) => (
                <button
                  key={em.icao24}
                  onClick={() => {
                    onSelectAircraft(em.icao24);
                    onClose();
                  }}
                  className="p-2 rounded bg-rose-900/40 hover:bg-rose-900/80 border border-rose-500/40 text-left transition flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-white block">{em.callsign}</span>
                    <span className="text-[10px] text-rose-300">{em.originCountry} • SQUAWK {em.squawk}</span>
                  </div>
                  <span className="text-[10px] text-cyan-300 underline">Track &rarr;</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Breakdown Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Altitude Profile Distribution */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Altitude Stratification
              </h3>
              <span className="font-mono text-[11px] text-slate-500">Feet AMSL</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Low Altitude (&le; 10,000 ft)</span>
                  <span className="text-white font-semibold">{altLow} ({total > 0 ? Math.round((altLow / total) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${total > 0 ? (altLow / total) * 100 : 0}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Mid Levels (10,000 – 25,000 ft)</span>
                  <span className="text-white font-semibold">{altMid} ({total > 0 ? Math.round((altMid / total) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-400 h-full rounded-full" style={{ width: `${total > 0 ? (altMid / total) * 100 : 0}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">High Altitude Cruise (25,000 – 40,000 ft)</span>
                  <span className="text-white font-semibold">{altHigh} ({total > 0 ? Math.round((altHigh / total) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${total > 0 ? (altHigh / total) * 100 : 0}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Upper Stratosphere (FL400+)</span>
                  <span className="text-white font-semibold">{altVeryHigh} ({total > 0 ? Math.round((altVeryHigh / total) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-400 h-full rounded-full" style={{ width: `${total > 0 ? (altVeryHigh / total) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Profile & Climb/Descent */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Vertical Rate Trends
              </h3>
              <span className="font-mono text-[11px] text-slate-500">Climb vs Descent</span>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-bold">CLIMB</span>
                  </div>
                  <div className="text-xl font-bold text-white">{climbing}</div>
                  <span className="text-[10px] text-slate-500">
                    {total > 0 ? Math.round((climbing / total) * 100) : 0}%
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-center gap-1 text-cyan-400 mb-1">
                    <Minus className="w-4 h-4" />
                    <span className="text-xs font-bold">LEVEL</span>
                  </div>
                  <div className="text-xl font-bold text-white">{level}</div>
                  <span className="text-[10px] text-slate-500">
                    {total > 0 ? Math.round((level / total) * 100) : 0}%
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-center gap-1 text-rose-400 mb-1">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-xs font-bold">DESC</span>
                  </div>
                  <div className="text-xl font-bold text-white">{descending}</div>
                  <span className="text-[10px] text-slate-500">
                    {total > 0 ? Math.round((descending / total) * 100) : 0}%
                  </span>
                </div>
              </div>

              {/* Speed Distribution breakdown */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-2 font-bold uppercase">
                  Airspeed Spectrum
                </span>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">&lt; 180 kts</span>
                    <strong className="text-slate-200 text-xs">{spdSlow} flights</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">180 – 480 kts</span>
                    <strong className="text-cyan-300 text-xs">{spdCruise} flights</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">&gt; 480 kts</span>
                    <strong className="text-emerald-300 text-xs">{spdFast} flights</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Flag Registrations */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-cyan-400" />
              Active Origin State Registrations
            </h3>
            <span className="font-mono text-[11px] text-slate-500">Top Nations</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
            {topCountries.map(([country, count]) => (
              <div key={country} className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[11px] truncate block" title={country}>
                  {country}
                </span>
                <div className="text-lg font-bold text-cyan-300 mt-1">{count}</div>
                <span className="text-[10px] text-slate-500">
                  {total > 0 ? Math.round((count / total) * 100) : 0}% of feed
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
