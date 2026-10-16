import React from 'react';
import { AircraftObservation } from '../../types/opensky';

interface AltitudeSpeedGraphProps {
  observations: AircraftObservation[];
}

export const AltitudeSpeedGraph: React.FC<AltitudeSpeedGraphProps> = ({ observations }) => {
  if (observations.length < 2) {
    return (
      <div className="p-4 rounded bg-atc-950/60 border border-atc-800 text-center font-mono text-xs text-slate-500">
        <p className="text-slate-400 font-semibold mb-1">Telemetry History Profile</p>
        <p>Accumulating observations... ({observations.length}/2 points)</p>
      </div>
    );
  }

  // Filter valid points with altitudes
  const validPoints = observations.filter(
    (pt) => pt.baroAltitudeFeet !== null && pt.velocityKnots !== null
  );

  if (validPoints.length < 2) {
    return (
      <div className="p-3 rounded bg-atc-950/60 border border-atc-800 text-center font-mono text-xs text-slate-500">
        Insufficient altitude telemetry recorded yet.
      </div>
    );
  }

  const altitudes = validPoints.map((p) => p.baroAltitudeFeet!);
  const speeds = validPoints.map((p) => p.velocityKnots!);

  const minAlt = Math.max(0, Math.min(...altitudes) - 500);
  const maxAlt = Math.max(...altitudes) + 500;
  const altRange = Math.max(1000, maxAlt - minAlt);

  const minSpeed = Math.max(0, Math.min(...speeds) - 20);
  const maxSpeed = Math.max(...speeds) + 20;
  const speedRange = Math.max(50, maxSpeed - minSpeed);

  const width = 320;
  const height = 90;
  const padding = 15;

  const pointsCount = validPoints.length;
  const dx = (width - padding * 2) / (pointsCount - 1);

  // SVG path for altitude (cyan)
  const altPathD = validPoints
    .map((pt, i) => {
      const x = padding + i * dx;
      const y = height - padding - ((pt.baroAltitudeFeet! - minAlt) / altRange) * (height - padding * 2);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  // SVG path for speed (emerald)
  const speedPathD = validPoints
    .map((pt, i) => {
      const x = padding + i * dx;
      const y = height - padding - ((pt.velocityKnots! - minSpeed) / speedRange) * (height - padding * 2);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  const latestAlt = altitudes[altitudes.length - 1];
  const latestSpeed = speeds[speeds.length - 1];

  return (
    <div className="p-2.5 rounded bg-atc-950/80 border border-atc-800 space-y-1.5">
      <div className="flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
            ALT: {latestAlt.toLocaleString()} ft
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            SPD: {latestSpeed} kts
          </span>
        </div>
        <span className="text-slate-500">{validPoints.length} updates</span>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-24 overflow-visible"
        >
          {/* Grid lines */}
          <line
            x1={padding}
            y1={padding}
            x2={width - padding}
            y2={padding}
            stroke="#1e293b"
            strokeDasharray="2,2"
          />
          <line
            x1={padding}
            y1={height / 2}
            x2={width - padding}
            y2={height / 2}
            stroke="#1e293b"
            strokeDasharray="2,2"
          />
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#1e293b"
            strokeDasharray="2,2"
          />

          {/* Altitude Curve */}
          <path
            d={altPathD}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Speed Curve */}
          <path
            d={speedPathD}
            fill="none"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="3,3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};
