import React, { useState } from 'react';
import {
  X,
  Crosshair,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Activity,
  Gauge,
  Layers,
  MapPin,
  Clock,
  Radio,
  Download,
  Flame,
} from 'lucide-react';
import { Aircraft, AircraftObservation } from '../../types/opensky';
import { AltitudeSpeedGraph } from './AltitudeSpeedGraph';
import { MovementHistoryLog } from './MovementHistoryLog';
import { formatCoordinates } from '../../services/geoUtils';

interface FlightDetailPanelProps {
  aircraft: Aircraft | null;
  history: AircraftObservation[];
  onClose: () => void;
  onCenterOnMap: (lat: number, lon: number) => void;
  onClearHistory: () => void;
}

export const FlightDetailPanel: React.FC<FlightDetailPanelProps> = ({
  aircraft,
  history,
  onClose,
  onCenterOnMap,
  onClearHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'history'>('telemetry');

  if (!aircraft) return null;

  const lastPositionTimeStr = aircraft.timePosition
    ? new Date(aircraft.timePosition * 1000).toLocaleTimeString()
    : 'Unknown';
  const lastContactTimeStr = new Date(aircraft.lastContact * 1000).toLocaleTimeString();

  // Aviation derived fields
  const machEstimate =
    aircraft.velocityKnots !== null && !aircraft.onGround && (aircraft.baroAltitudeFeet ?? 0) > 15000
      ? `M${(aircraft.velocityKnots / 573).toFixed(2)}`
      : null;

  const flightLevel =
    aircraft.baroAltitudeFeet !== null && !aircraft.onGround
      ? `FL${Math.round(aircraft.baroAltitudeFeet / 100)}`
      : null;

  const isEmergency = ['7700', '7600', '7500'].includes(aircraft.squawk ?? '');
  const emergencyLabel =
    aircraft.squawk === '7700'
      ? 'GENERAL EMERGENCY (MAYDAY)'
      : aircraft.squawk === '7600'
      ? 'RADIO COMM FAILURE (NORDO)'
      : aircraft.squawk === '7500'
      ? 'UNLAWFUL INTERFERENCE'
      : null;

  const handleExportGeoJSON = () => {
    if (history.length === 0) return;
    const geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            callsign: aircraft.callsign,
            icao24: aircraft.icao24,
            originCountry: aircraft.originCountry,
            pointsRecorded: history.length,
            exportedAt: new Date().toISOString(),
          },
          geometry: {
            type: 'LineString',
            coordinates: history.map((pt) => [
              pt.longitude,
              pt.latitude,
              pt.baroAltitudeMeters ?? 0,
            ]),
          },
        },
      ],
    };
    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
      type: 'application/geo+json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${aircraft.callsign.trim()}_${aircraft.icao24}_trail.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-atc-900 border-l border-atc-800 flex flex-col w-full md:w-96 h-full max-h-screen overflow-y-auto text-slate-100 shadow-2xl z-20">
      {/* Flight Detail Header */}
      <div className="p-4 bg-atc-950 border-b border-atc-800 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-mono text-xl font-bold text-cyan-400 tracking-wider">
              {aircraft.callsign}
            </h2>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-atc-800 border border-atc-700 text-slate-300 uppercase">
              {aircraft.icao24}
            </span>
            {flightLevel && (
              <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-indigo-950/70 border border-indigo-700/60 text-indigo-300 font-bold">
                {flightLevel}
              </span>
            )}
          </div>

          <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span>{aircraft.originCountry}</span>
            <span>•</span>
            <span className="font-mono text-slate-500">
              {aircraft.positionSource}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {aircraft.latitude !== null && aircraft.longitude !== null && (
            <button
              onClick={() => onCenterOnMap(aircraft.latitude!, aircraft.longitude!)}
              className="p-1.5 rounded bg-atc-800 hover:bg-cyan-950/80 hover:text-cyan-400 border border-atc-700 text-slate-300 transition"
              title="Center map on aircraft"
              aria-label="Center map on aircraft"
            >
              <Crosshair className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded bg-atc-800 hover:bg-atc-700 border border-atc-700 text-slate-400 hover:text-white transition"
            title="Close telemetry inspector (Esc)"
            aria-label="Close telemetry inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Emergency Alert Banner if Active */}
      {isEmergency && (
        <div className="bg-red-950 border-b border-red-500 px-4 py-2 flex items-center gap-2 text-xs text-red-200 animate-pulse font-mono">
          <Flame className="w-4 h-4 text-red-400 shrink-0" />
          <div>
            <strong className="text-red-300">ALERT SQUAWK {aircraft.squawk}:</strong> {emergencyLabel}
          </div>
        </div>
      )}

      {/* Flight State Alert / Status Strip */}
      <div className="px-4 py-2 bg-atc-950/60 border-b border-atc-850 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              aircraft.onGround ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
            }`}
          />
          <span className="font-semibold text-slate-200">
            {aircraft.onGround ? 'ON GROUND (TAXI/PARK)' : 'AIRBORNE'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {aircraft.squawk && (
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] ${
                isEmergency
                  ? 'bg-rose-950 text-rose-300 border border-rose-600 font-bold'
                  : 'bg-atc-800 text-slate-300 border border-atc-700'
              }`}
            >
              SQ: {aircraft.squawk}
            </span>
          )}
          {aircraft.isStale && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-700">
              STALE CONTACT
            </span>
          )}
        </div>
      </div>

      {/* Tabs: Telemetry vs History Log */}
      <div className="flex border-b border-atc-800 bg-atc-950/40 text-xs font-mono">
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 border-b-2 transition ${
            activeTab === 'telemetry'
              ? 'border-cyan-400 text-cyan-300 bg-atc-900/80 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Live Telemetry
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 border-b-2 transition ${
            activeTab === 'history'
              ? 'border-cyan-400 text-cyan-300 bg-atc-900/80 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Movement History ({history.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 space-y-4 flex-1">
        {activeTab === 'telemetry' ? (
          <>
            {/* Primary Telemetry Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Altitude Card */}
              <div className="p-2.5 rounded bg-atc-950/80 border border-atc-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Baro Altitude
                </span>
                <div className="text-lg font-bold font-mono text-cyan-300 mt-0.5">
                  {aircraft.baroAltitudeFeet !== null
                    ? `${aircraft.baroAltitudeFeet.toLocaleString()} ft`
                    : '---'}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5 flex justify-between">
                  <span>{aircraft.baroAltitudeMeters !== null ? `${aircraft.baroAltitudeMeters.toLocaleString()} m` : '---'}</span>
                  {flightLevel && <span className="text-indigo-400 font-semibold">{flightLevel}</span>}
                </div>
              </div>

              {/* Speed Card */}
              <div className="p-2.5 rounded bg-atc-950/80 border border-atc-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Ground Speed
                </span>
                <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                  {aircraft.velocityKnots !== null
                    ? `${aircraft.velocityKnots} kts`
                    : '---'}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5 flex justify-between">
                  <span>{aircraft.velocityMps !== null ? `${Math.round(aircraft.velocityMps * 3.6)} km/h` : '---'}</span>
                  {machEstimate && <span className="text-cyan-400 font-semibold">{machEstimate}</span>}
                </div>
              </div>

              {/* Heading Card with Compass Indicator */}
              <div className="p-2.5 rounded bg-atc-950/80 border border-atc-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  True Track
                </span>
                <div className="text-lg font-bold font-mono text-slate-200 mt-0.5 flex items-center gap-1.5">
                  <Compass
                    className="w-4 h-4 text-cyan-400 transition-transform duration-300"
                    style={{
                      transform: `rotate(${aircraft.heading ?? 0}deg)`,
                    }}
                  />
                  {aircraft.heading !== null
                    ? `${aircraft.heading}° ${aircraft.headingCardinal}`
                    : '---'}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  Heading Clockwise
                </div>
              </div>

              {/* Vertical Rate Card with Climb/Descent Indicator */}
              <div className="p-2.5 rounded bg-atc-950/80 border border-atc-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Vertical Speed
                </span>
                <div className="text-lg font-bold font-mono mt-0.5 flex items-center gap-1">
                  {aircraft.verticalState === 'CLIMBING' && (
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  )}
                  {aircraft.verticalState === 'DESCENDING' && (
                    <ArrowDownRight className="w-4 h-4 text-rose-400" />
                  )}
                  {aircraft.verticalState === 'LEVEL' && (
                    <Minus className="w-4 h-4 text-cyan-400" />
                  )}
                  <span
                    className={
                      aircraft.verticalState === 'CLIMBING'
                        ? 'text-emerald-400'
                        : aircraft.verticalState === 'DESCENDING'
                        ? 'text-rose-400'
                        : 'text-slate-200'
                    }
                  >
                    {aircraft.verticalRateFpm !== null
                      ? `${aircraft.verticalRateFpm > 0 ? '+' : ''}${aircraft.verticalRateFpm} fpm`
                      : '0 fpm'}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  {aircraft.verticalState}
                </div>
              </div>
            </div>

            {/* Position & Coordinate readouts */}
            <div className="p-3 rounded bg-atc-950/80 border border-atc-800 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  Coordinates
                </span>
                <span className="text-cyan-300 font-semibold">
                  {formatCoordinates(aircraft.latitude, aircraft.longitude)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-400 border-t border-atc-850 pt-2">
                <span className="flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-slate-500" />
                  Geometric Alt
                </span>
                <span className="text-slate-200">
                  {aircraft.geoAltitudeFeet !== null
                    ? `${aircraft.geoAltitudeFeet.toLocaleString()} ft`
                    : '---'}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-400 border-t border-atc-850 pt-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Last Position
                </span>
                <span className="text-slate-200">{lastPositionTimeStr}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400 border-t border-atc-850 pt-2">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-slate-500" />
                  Radar Contact
                </span>
                <span className="text-slate-200">{lastContactTimeStr}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400 border-t border-atc-850 pt-2">
                <span>Session Observations</span>
                <span className="text-cyan-400 font-semibold">
                  {aircraft.observationCount} hits
                </span>
              </div>
            </div>

            {/* Movement Profile Chart */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  Altitude & Velocity Profile
                </span>
                {history.length > 1 && (
                  <button
                    onClick={handleExportGeoJSON}
                    className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 transition"
                    title="Export waypoint path as GeoJSON"
                  >
                    <Download className="w-3 h-3" />
                    Export GeoJSON
                  </button>
                )}
              </div>
              <AltitudeSpeedGraph observations={history} />
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button
                onClick={handleExportGeoJSON}
                disabled={history.length === 0}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono hover:bg-cyan-900/60 transition disabled:opacity-40"
              >
                <Download className="w-3 h-3" />
                Export Trail (GeoJSON)
              </button>
            </div>
            <MovementHistoryLog
              observations={history}
              callsign={aircraft.callsign}
              onClearHistory={onClearHistory}
            />
          </div>
        )}
      </div>
    </div>
  );
};
