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
    <div className="bg-white border-l border-slate-200/90 flex flex-col w-full md:w-96 h-full max-h-screen overflow-y-auto text-slate-800 shadow-xl z-20 font-sans">
      {/* Flight Detail Header */}
      <div className="p-4 bg-aviation-navy text-white flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white">
              {aircraft.callsign}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded bg-white/15 text-slate-200 font-mono">
              {aircraft.icao24}
            </span>
            {flightLevel && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-aviation-sky text-white font-semibold">
                {flightLevel}
              </span>
            )}
          </div>

          <div className="text-xs text-slate-300 mt-1 flex items-center gap-2 font-medium">
            <span>{aircraft.originCountry}</span>
            <span>•</span>
            <span className="text-slate-400">
              {aircraft.positionSource}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {aircraft.latitude !== null && aircraft.longitude !== null && (
            <button
              onClick={() => onCenterOnMap(aircraft.latitude!, aircraft.longitude!)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              title="Center map on flight"
              aria-label="Center map on flight"
            >
              <Crosshair className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            title="Close flight details"
            aria-label="Close flight details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Emergency Alert Banner if Active */}
      {isEmergency && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2.5 flex items-center gap-2 text-xs text-red-800">
          <Flame className="w-4 h-4 text-red-600 shrink-0" />
          <div>
            <strong className="font-semibold text-red-900">Alert Squawk {aircraft.squawk}:</strong> {emergencyLabel}
          </div>
        </div>
      )}

      {/* Flight State Status Strip */}
      <div className="px-4 py-2.5 bg-aviation-cloud/70 border-b border-slate-200/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              aircraft.onGround ? 'bg-aviation-amber' : 'bg-aviation-green'
            }`}
          />
          <span className="font-semibold text-slate-700">
            {aircraft.onGround ? 'On Ground (Taxi / Gate)' : 'Airborne in Flight'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {aircraft.squawk && (
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                isEmergency
                  ? 'bg-red-100 text-red-800 font-bold border border-red-200'
                  : 'bg-white text-slate-600 border border-slate-200 shadow-sm'
              }`}
            >
              Squawk: {aircraft.squawk}
            </span>
          )}
          {aircraft.isStale && (
            <span className="px-2 py-0.5 rounded text-[11px] bg-amber-50 text-amber-800 border border-amber-200">
              Stale Data
            </span>
          )}
        </div>
      </div>

      {/* Tabs: Flight Data vs History Log */}
      <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-medium">
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition ${
            activeTab === 'telemetry'
              ? 'border-aviation-navy text-aviation-navy bg-white font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Flight Information
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition ${
            activeTab === 'history'
              ? 'border-aviation-navy text-aviation-navy bg-white font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Recent Trail ({history.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 space-y-4 flex-1">
        {activeTab === 'telemetry' ? (
          <>
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Altitude Card */}
              <div className="p-3 rounded-xl bg-aviation-cloud/80 border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium block">
                  Current Altitude
                </span>
                <div className="text-lg font-bold text-slate-900 mt-0.5">
                  {aircraft.baroAltitudeFeet !== null
                    ? `${aircraft.baroAltitudeFeet.toLocaleString()} ft`
                    : 'Unavailable'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                  <span>{aircraft.baroAltitudeMeters !== null ? `${aircraft.baroAltitudeMeters.toLocaleString()} m` : '---'}</span>
                  {flightLevel && <span className="text-aviation-navy font-semibold">{flightLevel}</span>}
                </div>
              </div>

              {/* Speed Card */}
              <div className="p-3 rounded-xl bg-aviation-cloud/80 border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium block">
                  Ground Speed
                </span>
                <div className="text-lg font-bold text-aviation-green mt-0.5">
                  {aircraft.velocityKnots !== null
                    ? `${aircraft.velocityKnots} kt`
                    : 'Unavailable'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                  <span>{aircraft.velocityMps !== null ? `${Math.round(aircraft.velocityMps * 3.6)} km/h` : '---'}</span>
                  {machEstimate && <span className="text-aviation-navy font-semibold">{machEstimate}</span>}
                </div>
              </div>

              {/* Heading Card with Compass Indicator */}
              <div className="p-3 rounded-xl bg-aviation-cloud/80 border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium block">
                  Direction / Heading
                </span>
                <div className="text-lg font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <Compass
                    className="w-4 h-4 text-aviation-navy transition-transform duration-300"
                    style={{
                      transform: `rotate(${aircraft.heading ?? 0}deg)`,
                    }}
                  />
                  {aircraft.heading !== null
                    ? `${aircraft.heading}° ${aircraft.headingCardinal}`
                    : '---'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Compass Bearing
                </div>
              </div>

              {/* Vertical Rate Card with Indicator */}
              <div className="p-3 rounded-xl bg-aviation-cloud/80 border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium block">
                  Vertical Trend
                </span>
                <div className="text-lg font-bold mt-0.5 flex items-center gap-1">
                  {aircraft.verticalState === 'CLIMBING' && (
                    <ArrowUpRight className="w-4 h-4 text-aviation-green" />
                  )}
                  {aircraft.verticalState === 'DESCENDING' && (
                    <ArrowDownRight className="w-4 h-4 text-aviation-amber" />
                  )}
                  {aircraft.verticalState === 'LEVEL' && (
                    <Minus className="w-4 h-4 text-slate-400" />
                  )}
                  <span
                    className={
                      aircraft.verticalState === 'CLIMBING'
                        ? 'text-aviation-green'
                        : aircraft.verticalState === 'DESCENDING'
                        ? 'text-aviation-amber'
                        : 'text-slate-800'
                    }
                  >
                    {aircraft.verticalRateFpm !== null
                      ? `${aircraft.verticalRateFpm > 0 ? '+' : ''}${aircraft.verticalRateFpm} ft/min`
                      : 'Level (0 ft/min)'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 capitalize">
                  {aircraft.verticalState.toLowerCase()}
                </div>
              </div>
            </div>

            {/* Position & Coordinate readouts */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-aviation-navy" />
                  Coordinates
                </span>
                <span className="text-slate-900 font-mono font-medium">
                  {formatCoordinates(aircraft.latitude, aircraft.longitude)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600 border-t border-slate-200/80 pt-2">
                <span className="flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-slate-400" />
                  Geometric Altitude
                </span>
                <span className="text-slate-800 font-medium">
                  {aircraft.geoAltitudeFeet !== null
                    ? `${aircraft.geoAltitudeFeet.toLocaleString()} ft`
                    : '---'}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600 border-t border-slate-200/80 pt-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Last Position Reported
                </span>
                <span className="text-slate-800 font-medium">{lastPositionTimeStr}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 border-t border-slate-200/80 pt-2">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-slate-400" />
                  Signal Contact
                </span>
                <span className="text-slate-800 font-medium">{lastContactTimeStr}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 border-t border-slate-200/80 pt-2">
                <span>Session Observations</span>
                <span className="text-aviation-navy font-semibold">
                  {aircraft.observationCount} points
                </span>
              </div>
            </div>

            {/* Movement Profile Chart */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-700 font-bold">
                  Altitude &amp; Speed Profile
                </span>
                {history.length > 1 && (
                  <button
                    onClick={handleExportGeoJSON}
                    className="inline-flex items-center gap-1 text-xs text-aviation-navy hover:text-aviation-sky font-semibold transition"
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-aviation-sky/15 border border-aviation-sky/30 text-aviation-navy text-xs font-semibold hover:bg-aviation-sky/25 transition disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
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
