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
    <div className="flex-1 bg-aviation-cloud p-4 sm:p-6 lg:p-8 overflow-y-auto font-sans text-aviation-slate">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-aviation-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-aviation-sky" />
              <h2 className="text-xl font-bold tracking-tight text-aviation-navy">
                Fleet Telemetry & Operational Analytics
              </h2>
            </div>
            <p className="text-xs text-aviation-muted mt-1">
              Statistical summary of active flight vectors in current airspace
            </p>
          </div>
          <button
            onClick={onClose}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-aviation-border text-xs font-medium text-aviation-navy transition shadow-2xs"
          >
            ← Return to Live Radar Map
          </button>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-aviation-border rounded-2xl p-5 shadow-2xs">
            <span className="text-xs text-aviation-muted uppercase tracking-wider font-semibold block">Total Active Feed</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-aviation-navy mt-1">{total}</div>
            <span className="text-xs text-aviation-sky flex items-center gap-1 mt-1 font-medium">
              <Activity className="w-3.5 h-3.5" /> State vectors tracked
            </span>
          </div>

          <div className="bg-white border border-aviation-border rounded-2xl p-5 shadow-2xs">
            <span className="text-xs text-aviation-muted uppercase tracking-wider font-semibold block">Airborne Flights</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-aviation-green mt-1">{airborne}</div>
            <span className="text-xs text-aviation-muted mt-1 block font-medium">{airbornePct}% of total volume</span>
          </div>

          <div className="bg-white border border-aviation-border rounded-2xl p-5 shadow-2xs">
            <span className="text-xs text-aviation-muted uppercase tracking-wider font-semibold block">On Ground</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-aviation-amber mt-1">{onGround}</div>
            <span className="text-xs text-aviation-muted mt-1 block font-medium">{groundPct}% taxiing / parked</span>
          </div>

          <div className="bg-white border border-aviation-border rounded-2xl p-5 shadow-2xs">
            <span className="text-xs text-aviation-muted uppercase tracking-wider font-semibold block">Emergencies</span>
            <div className={`text-2xl sm:text-3xl font-extrabold mt-1 ${emergencies.length > 0 ? 'text-aviation-red animate-pulse' : 'text-aviation-muted'}`}>
              {emergencies.length}
            </div>
            <span className="text-xs text-aviation-muted mt-1 block font-medium">Squawk 7700 / 7600</span>
          </div>
        </div>

        {/* Emergency Alert Banner if any */}
        {emergencies.length > 0 && (
          <div className="p-4 rounded-2xl bg-red-50 border border-aviation-red text-xs text-aviation-red shadow-xs">
            <div className="flex items-center gap-2 font-bold mb-2">
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
                  className="p-3 rounded-xl bg-white border border-red-200 text-left transition flex items-center justify-between shadow-2xs hover:border-aviation-red"
                >
                  <div>
                    <span className="font-bold text-aviation-navy block">{em.callsign}</span>
                    <span className="text-[11px] text-aviation-muted">{em.originCountry} • SQUAWK {em.squawk}</span>
                  </div>
                  <span className="text-xs text-aviation-sky font-semibold underline">Track &rarr;</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Breakdown Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Altitude Profile Distribution */}
          <div className="bg-white border border-aviation-border rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-aviation-navy flex items-center gap-2">
                <Layers className="w-4 h-4 text-aviation-sky" />
                Altitude Stratification
              </h3>
              <span className="text-xs text-aviation-muted">Feet AMSL</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-aviation-muted">Low Altitude (&le; 10,000 ft)</span>
                  <span className="text-aviation-navy font-semibold">{altLow} ({total > 0 ? Math.round((altLow / total) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-aviation-cloud h-2 rounded-full overflow-hidden">
                  <div className="bg-aviation-sky h-full rounded-full" style={{ width: `${total > 0 ? (altLow / total) * 100 : 0}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-aviation-muted">Mid Levels (10,000 – 25,000 ft)</span>
                  <span className="text-aviation-navy font-semibold">{altMid} ({total > 0 ? Math.round((altMid / total) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-aviation-cloud h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-400 h-full rounded-full" style={{ width: `${total > 0 ? (altMid / total) * 100 : 0}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-aviation-muted">High Cruise (25,000 – 40,000 ft)</span>
                  <span className="text-aviation-navy font-semibold">{altHigh} ({total > 0 ? Math.round((altHigh / total) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-aviation-cloud h-2 rounded-full overflow-hidden">
                  <div className="bg-aviation-green h-full rounded-full" style={{ width: `${total > 0 ? (altHigh / total) * 100 : 0}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-aviation-muted">Upper Stratosphere (FL400+)</span>
                  <span className="text-aviation-navy font-semibold">{altVeryHigh} ({total > 0 ? Math.round((altVeryHigh / total) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-aviation-cloud h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${total > 0 ? (altVeryHigh / total) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Profile & Climb/Descent */}
          <div className="bg-white border border-aviation-border rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-aviation-navy flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-aviation-green" />
                Vertical Rate Trends
              </h3>
              <span className="text-xs text-aviation-muted">Climb vs Descent</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-aviation-cloud/70 border border-aviation-border">
                  <div className="flex items-center justify-center gap-1 text-aviation-green mb-1 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Climb</span>
                  </div>
                  <div className="text-xl font-bold text-aviation-navy">{climbing}</div>
                  <span className="text-[11px] text-aviation-muted">
                    {total > 0 ? Math.round((climbing / total) * 100) : 0}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-aviation-cloud/70 border border-aviation-border">
                  <div className="flex items-center justify-center gap-1 text-aviation-sky mb-1 font-semibold">
                    <Minus className="w-3.5 h-3.5" />
                    <span>Level</span>
                  </div>
                  <div className="text-xl font-bold text-aviation-navy">{level}</div>
                  <span className="text-[11px] text-aviation-muted">
                    {total > 0 ? Math.round((level / total) * 100) : 0}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-aviation-cloud/70 border border-aviation-border">
                  <div className="flex items-center justify-center gap-1 text-aviation-amber mb-1 font-semibold">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Desc</span>
                  </div>
                  <div className="text-xl font-bold text-aviation-navy">{descending}</div>
                  <span className="text-[11px] text-aviation-muted">
                    {total > 0 ? Math.round((descending / total) * 100) : 0}%
                  </span>
                </div>
              </div>

              {/* Speed Distribution breakdown */}
              <div className="pt-2 border-t border-aviation-border/60">
                <span className="text-xs text-aviation-muted block mb-2 font-semibold uppercase">
                  Airspeed Spectrum
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-aviation-cloud/70 border border-aviation-border">
                    <span className="text-aviation-muted text-[11px] block">&lt; 180 kt</span>
                    <strong className="text-aviation-navy">{spdSlow} flights</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-aviation-cloud/70 border border-aviation-border">
                    <span className="text-aviation-muted text-[11px] block">180 – 480 kt</span>
                    <strong className="text-aviation-navy">{spdCruise} flights</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-aviation-cloud/70 border border-aviation-border">
                    <span className="text-aviation-muted text-[11px] block">&gt; 480 kt</span>
                    <strong className="text-aviation-navy">{spdFast} flights</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Flag Registrations */}
        <div className="bg-white border border-aviation-border rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-aviation-navy flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-aviation-sky" />
              Active Origin State Registrations
            </h3>
            <span className="text-xs text-aviation-muted">Top Nations</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {topCountries.map(([country, count]) => (
              <div key={country} className="p-3 rounded-xl bg-aviation-cloud/70 border border-aviation-border">
                <span className="text-aviation-muted text-xs truncate block" title={country}>
                  {country}
                </span>
                <div className="text-lg font-bold text-aviation-navy mt-1">{count}</div>
                <span className="text-[11px] text-aviation-muted">
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
