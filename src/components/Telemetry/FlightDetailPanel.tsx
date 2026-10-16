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
            >
              <Crosshair className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded bg-atc-800 hover:bg-atc-700 border border-atc-700 text-slate-400 hover:text-white transition"
            title="Close telemetry inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

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
                aircraft.squawk === '7700'
                  ? 'bg-rose-950 text-rose-300 border border-rose-600 animate-bounce'
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
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  {aircraft.baroAltitudeMeters !== null
                    ? `${aircraft.baroAltitudeMeters.toLocaleString()} m`
                    : '---'}
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
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  {aircraft.velocityMps !== null
                    ? `${Math.round(aircraft.velocityMps * 3.6)} km/h`
                    : '---'}
                </div>
              </div>

              {/* Heading Card */}
              <div className="p-2.5 rounded bg-atc-950/80 border border-atc-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  True Track
                </span>
                <div className="text-lg font-bold font-mono text-slate-200 mt-0.5 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  {aircraft.heading !== null
                    ? `${aircraft.heading}° ${aircraft.headingCardinal}`
                    : '---'}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  Heading Clockwise
                </div>
              </div>

              {/* Vertical Rate Card */}
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
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5 font-semibold">
                Altitude & Velocity Profile
              </span>
              <AltitudeSpeedGraph observations={history} />
            </div>
          </>
        ) : (
          <MovementHistoryLog
            observations={history}
            callsign={aircraft.callsign}
            onClearHistory={onClearHistory}
          />
        )}
      </div>
    </div>
  );
};
