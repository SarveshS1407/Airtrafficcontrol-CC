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
  ShieldCheck,
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
    <div className="bg-[#FCFAF5] border-l border-[#D6E0E7] flex flex-col w-full md:w-96 h-full max-h-screen overflow-y-auto text-[#172D40] shadow-xl z-20 font-sans">
      {/* Flight Detail Header (Styled like a flight-plan document header) */}
      <div className="p-4 bg-[#20394D] text-white flex items-start justify-between shadow-xs">
        <div>
          <span className="text-[10px] text-[#8DB7D5] font-mono tracking-wider uppercase block tech-stamp">
            AIRCRAFT DOSSIER // ICAO {aircraft.icao24}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <h2 className="text-xl font-black tracking-tight text-white font-mono">
              {aircraft.callsign}
            </h2>
            {flightLevel && (
              <span className="text-xs px-2 py-0.5 rounded bg-[#D87C43] text-white font-bold font-mono">
                {flightLevel}
              </span>
            )}
          </div>

          <div className="text-xs text-[#8DB7D5] mt-1 flex items-center gap-2 font-medium">
            <span className="text-slate-200">{aircraft.originCountry}</span>
            <span className="text-[#456D8B]">•</span>
            <span className="text-slate-300 font-mono text-[11px]">
              {aircraft.positionSource}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {aircraft.latitude !== null && aircraft.longitude !== null && (
            <button
              onClick={() => onCenterOnMap(aircraft.latitude!, aircraft.longitude!)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              title="Center map on aircraft"
              aria-label="Center map on aircraft"
            >
              <Crosshair className="w-4 h-4 text-[#8DB7D5]" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            title="Close flight report"
            aria-label="Close flight report"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Emergency Alert Banner if Active */}
      {isEmergency && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2.5 flex items-center gap-2 text-xs text-[#C94C4C]">
          <Flame className="w-4 h-4 text-[#C94C4C] shrink-0" />
          <div>
            <strong className="font-bold text-red-900">Alert Squawk {aircraft.squawk}:</strong> {emergencyLabel}
          </div>
        </div>
      )}

      {/* Flight State Status Strip */}
      <div className="px-4 py-2.5 bg-[#F4F0E7] border-b border-[#D6E0E7] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              aircraft.onGround ? 'bg-[#82909B]' : 'bg-[#467A67]'
            }`}
          />
          <span className="font-semibold text-[#172D40]">
            {aircraft.onGround ? 'On Ground (Taxi / Apron)' : 'Airborne in Flight'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {aircraft.squawk && (
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                isEmergency
                  ? 'bg-red-100 text-[#C94C4C] font-bold border border-red-300'
                  : 'bg-[#FCFAF5] text-[#172D40] border border-[#D6E0E7] shadow-2xs'
              }`}
            >
              SQ: {aircraft.squawk}
            </span>
          )}
          {aircraft.isStale && (
            <span className="px-2 py-0.5 rounded text-[11px] bg-amber-50 text-[#C99B45] border border-amber-200 font-mono">
              Stale Data
            </span>
          )}
        </div>
      </div>

      {/* Navigation Tabs: Telemetry vs Flight Trail */}
      <div className="flex border-b border-[#D6E0E7] bg-[#F4F0E7] text-xs font-semibold">
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition ${
            activeTab === 'telemetry'
              ? 'border-[#20394D] text-[#172D40] bg-[#FCFAF5]'
              : 'border-transparent text-[#82909B] hover:text-[#172D40]'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-[#D87C43]" />
          Flight Dynamics
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition ${
            activeTab === 'history'
              ? 'border-[#20394D] text-[#172D40] bg-[#FCFAF5]'
              : 'border-transparent text-[#82909B] hover:text-[#172D40]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#456D8B]" />
          Waypoints ({history.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 space-y-4 flex-1">
        {activeTab === 'telemetry' ? (
          <>
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Altitude Card */}
              <div className="p-3.5 rounded-xl bg-[#F4F0E7] border border-[#D6E0E7] shadow-2xs">
                <span className="text-[10px] text-[#82909B] font-bold uppercase tracking-wider block tech-stamp">
                  Altitude (Baro)
                </span>
                <div className="text-lg font-bold text-[#172D40] font-mono mt-0.5">
                  {aircraft.baroAltitudeFeet !== null
                    ? `${aircraft.baroAltitudeFeet.toLocaleString()} ft`
                    : 'Unavailable'}
                </div>
                <div className="text-[11px] text-[#82909B] font-mono mt-1 flex justify-between">
                  <span>{aircraft.baroAltitudeMeters !== null ? `${aircraft.baroAltitudeMeters.toLocaleString()} m` : '---'}</span>
                  {flightLevel && <span className="text-[#D87C43] font-bold">{flightLevel}</span>}
                </div>
              </div>

              {/* Speed Card */}
              <div className="p-3.5 rounded-xl bg-[#F4F0E7] border border-[#D6E0E7] shadow-2xs">
                <span className="text-[10px] text-[#82909B] font-bold uppercase tracking-wider block tech-stamp">
                  Ground Speed
                </span>
                <div className="text-lg font-bold text-[#467A67] font-mono mt-0.5">
                  {aircraft.velocityKnots !== null
                    ? `${aircraft.velocityKnots} kt`
                    : 'Unavailable'}
                </div>
                <div className="text-[11px] text-[#82909B] font-mono mt-1 flex justify-between">
                  <span>{aircraft.velocityMps !== null ? `${Math.round(aircraft.velocityMps * 3.6)} km/h` : '---'}</span>
                  {machEstimate && <span className="text-[#20394D] font-bold">{machEstimate}</span>}
                </div>
              </div>

              {/* Heading Card with Compass Indicator */}
              <div className="p-3.5 rounded-xl bg-[#F4F0E7] border border-[#D6E0E7] shadow-2xs">
                <span className="text-[10px] text-[#82909B] font-bold uppercase tracking-wider block tech-stamp">
                  Heading / Track
                </span>
                <div className="text-lg font-bold text-[#172D40] font-mono mt-0.5 flex items-center gap-1.5">
                  <Compass
                    className="w-4 h-4 text-[#D87C43] transition-transform duration-300"
                    style={{
                      transform: `rotate(${aircraft.heading ?? 0}deg)`,
                    }}
                  />
                  {aircraft.heading !== null
                    ? `${aircraft.heading}° ${aircraft.headingCardinal}`
                    : '---'}
                </div>
                <div className="text-[11px] text-[#82909B] font-mono mt-1">
                  True Bearing
                </div>
              </div>

              {/* Vertical Rate Card with Indicator */}
              <div className="p-3.5 rounded-xl bg-[#F4F0E7] border border-[#D6E0E7] shadow-2xs">
                <span className="text-[10px] text-[#82909B] font-bold uppercase tracking-wider block tech-stamp">
                  Vertical Trend
                </span>
                <div className="text-lg font-bold font-mono mt-0.5 flex items-center gap-1">
                  {aircraft.verticalState === 'CLIMBING' && (
                    <ArrowUpRight className="w-4 h-4 text-[#467A67]" />
                  )}
                  {aircraft.verticalState === 'DESCENDING' && (
                    <ArrowDownRight className="w-4 h-4 text-[#C99B45]" />
                  )}
                  {aircraft.verticalState === 'LEVEL' && (
                    <Minus className="w-4 h-4 text-[#82909B]" />
                  )}
                  <span
                    className={
                      aircraft.verticalState === 'CLIMBING'
                        ? 'text-[#467A67]'
                        : aircraft.verticalState === 'DESCENDING'
                        ? 'text-[#C99B45]'
                        : 'text-[#172D40]'
                    }
                  >
                    {aircraft.verticalRateFpm !== null
                      ? `${aircraft.verticalRateFpm > 0 ? '+' : ''}${aircraft.verticalRateFpm} fpm`
                      : '0 fpm'}
                  </span>
                </div>
                <div className="text-[11px] text-[#82909B] font-mono mt-1 capitalize">
                  {aircraft.verticalState.toLowerCase()}
                </div>
              </div>
            </div>

            {/* Position & Technical Coordinate Readouts */}
            <div className="p-3.5 rounded-xl bg-[#FCFAF5] border border-[#D6E0E7] space-y-2.5 text-xs shadow-2xs">
              <div className="flex items-center justify-between text-[#82909B]">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#20394D]" />
                  Coordinates
                </span>
                <span className="text-[#172D40] font-mono font-bold">
                  {formatCoordinates(aircraft.latitude, aircraft.longitude)}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#82909B] border-t border-[#D6E0E7] pt-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <Gauge className="w-3.5 h-3.5 text-[#82909B]" />
                  Geometric Altitude
                </span>
                <span className="text-[#172D40] font-mono font-medium">
                  {aircraft.geoAltitudeFeet !== null
                    ? `${aircraft.geoAltitudeFeet.toLocaleString()} ft`
                    : '---'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#82909B] border-t border-[#D6E0E7] pt-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#82909B]" />
                  Position Timestamp
                </span>
                <span className="text-[#172D40] font-mono font-medium">{lastPositionTimeStr}</span>
              </div>

              <div className="flex items-center justify-between text-[#82909B] border-t border-[#D6E0E7] pt-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <Radio className="w-3.5 h-3.5 text-[#82909B]" />
                  Signal Contact
                </span>
                <span className="text-[#172D40] font-mono font-medium">{lastContactTimeStr}</span>
              </div>

              <div className="flex items-center justify-between text-[#82909B] border-t border-[#D6E0E7] pt-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#467A67]" />
                  Telemetry Source
                </span>
                <span className="text-[#20394D] font-mono font-bold text-[11px]">
                  OpenSky Network ADS-B
                </span>
              </div>
            </div>

            {/* Altitude & Speed Profile Graph */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#172D40] font-bold uppercase tracking-wider tech-stamp">
                  Altitude &amp; Airspeed Profile
                </span>
                {history.length > 1 && (
                  <button
                    onClick={handleExportGeoJSON}
                    className="inline-flex items-center gap-1 text-xs text-[#D87C43] hover:text-[#20394D] font-semibold transition font-mono"
                    title="Export waypoint path as GeoJSON"
                  >
                    <Download className="w-3 h-3" />
                    Export GeoJSON
                  </button>
                )}
              </div>
              <AltitudeSpeedGraph observations={history} />
            </div>

            {/* Return to Flight Log Action */}
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-[#F4F0E7] hover:bg-[#EBF3FA] border border-[#D6E0E7] text-[#172D40] font-semibold text-xs transition shadow-2xs"
              >
                ← Return to Flight Log
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button
                onClick={handleExportGeoJSON}
                disabled={history.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EBF3FA] border border-[#8DB7D5] text-[#172D40] text-xs font-semibold hover:bg-[#D6E0E7] transition disabled:opacity-40 font-mono"
              >
                <Download className="w-3.5 h-3.5 text-[#D87C43]" />
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
