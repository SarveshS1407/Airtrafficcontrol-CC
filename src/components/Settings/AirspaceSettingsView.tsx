import React, { useState } from 'react';
import {
  Settings,
  Layers,
  Clock,
  Key,
  Shield,
  Spline,
  Eye,
  ExternalLink,
  Globe2,
  Map as MapIcon,
  CheckCircle2,
} from 'lucide-react';
import { ATC_CONFIG } from '../../constants/config';
import { useAtcStore } from '../../store/useAtcStore';
import {
  getGoogleMapsApiKey,
  saveUserGoogleMapsApiKey,
  isGoogleMapsConfigured,
} from '../../services/googleMapsLoader';

interface AirspaceSettingsViewProps {
  onClose: () => void;
}

export const AirspaceSettingsView: React.FC<AirspaceSettingsViewProps> = ({ onClose }) => {
  const {
    pollingIntervalMs,
    tileProviderKey,
    showTrail,
    showLabels,
    showBoundsRectangle,
    mapEngine,
    setMapEngine,
    setPollingInterval,
    setTileProvider,
    toggleTrail,
    toggleLabels,
    toggleBoundsRectangle,
  } = useAtcStore();

  const [customKey, setCustomKey] = useState(getGoogleMapsApiKey());
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveKey = () => {
    saveUserGoogleMapsApiKey(customKey);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="flex-1 bg-slate-950 p-4 sm:p-6 lg:p-8 overflow-y-auto font-sans text-slate-100">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold font-mono tracking-tight text-white uppercase">
                Airspace Surveillance Settings
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Configure telemetry refresh cycles, basemap layers, and API credentials
            </p>
          </div>
          <button
            onClick={onClose}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-400 transition"
          >
            ← Return to Live Radar Map
          </button>
        </div>

        {/* Setting 1: Refresh Polling Rate */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>TELEMETRY POLLING INTERVAL</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Controls the automated radar sweep frequency. OpenSky anonymous usage policy allows a minimum of 10s.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
            {ATC_CONFIG.POLLING_INTERVAL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPollingInterval(opt.value)}
                className={`py-2 px-3 rounded-lg border text-center transition ${
                  pollingIntervalMs === opt.value
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Setting 2: Geospatial Engine & Google Maps Platform */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span>GEOSPATIAL CARTOGRAPHY ENGINE</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Choose between Google Maps Platform (with dark tactical styling, satellite &amp; geocoding) and Leaflet / OpenStreetMap.
              </p>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border self-start sm:self-auto ${
                isGoogleMapsConfigured()
                  ? 'bg-emerald-950 border-emerald-500/50 text-emerald-400'
                  : 'bg-slate-950 border-slate-700 text-slate-400'
              }`}
            >
              {isGoogleMapsConfigured() ? 'GOOGLE MAPS CONFIGURED' : 'OSM DEFAULT ACTIVE'}
            </span>
          </div>

          {/* Engine Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <button
              onClick={() => setMapEngine('google')}
              className={`p-3 rounded-xl border text-left transition ${
                mapEngine === 'google'
                  ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 font-semibold shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white">Google Maps Platform</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Official Google Maps JavaScript API with dark tactical roadmap, satellite imagery, hybrid, terrain, and geocoding search.
              </p>
            </button>

            <button
              onClick={() => setMapEngine('leaflet')}
              className={`p-3 rounded-xl border text-left transition ${
                mapEngine === 'leaflet'
                  ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 font-semibold shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <MapIcon className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white">OpenStreetMap / Leaflet</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Open-source geospatial visualization with high-contrast Carto Dark (CORS compliant) and standard OSM basemaps.
              </p>
            </button>
          </div>

          {/* Key configuration */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2.5">
            <label className="text-[11px] text-slate-300 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                Google Maps JavaScript API Key
              </span>
              <a
                href="https://console.cloud.google.com/google/maps-apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline font-normal text-[10px] flex items-center gap-1"
              >
                Get API Key <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                placeholder="Paste API Key (AIzaSy...)"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition text-xs shrink-0 flex items-center gap-1.5"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Key</span>
                )}
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Stored securely in your browser session/localStorage. Can also be provided at build-time via <code>VITE_GOOGLE_MAPS_API_KEY</code>.
            </p>
          </div>
        </div>

        {/* Setting 3: Basemap Provider */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>BASEMAP CARTOGRAPHY (OPENSTREETMAP)</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select between high-contrast tactical night radar, daylight aviation chart, or humanitarian styling. No watermarked commercial tiles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            {Object.entries(ATC_CONFIG.TILE_PROVIDERS).map(([key, provider]) => (
              <button
                key={key}
                onClick={() => setTileProvider(key as any)}
                className={`p-3 rounded-xl border text-left transition ${
                  tileProviderKey === key
                    ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 font-semibold shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span className="font-bold block text-white mb-1">{provider.name}</span>
                <span className="text-[10px] text-slate-500 leading-tight block">
                  Official OpenStreetMap tiles with verified CORS compliance.
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Setting 3: Radar Overlays & Preferences */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>RADAR VISUAL OVERLAYS</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Toggle visual aids and historical breadcrumbs on the interactive map.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            {/* Trail */}
            <div
              onClick={toggleTrail}
              className={`p-3 rounded-xl border cursor-pointer select-none transition flex items-center justify-between ${
                showTrail
                  ? 'bg-slate-950 border-cyan-500/60 text-cyan-300'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Spline className="w-4 h-4" />
                <span>Flight History Trail</span>
              </div>
              <span className="text-[10px] font-bold">{showTrail ? 'ON' : 'OFF'}</span>
            </div>

            {/* Labels */}
            <div
              onClick={toggleLabels}
              className={`p-3 rounded-xl border cursor-pointer select-none transition flex items-center justify-between ${
                showLabels
                  ? 'bg-slate-950 border-cyan-500/60 text-cyan-300'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>Callsign Labels</span>
              </div>
              <span className="text-[10px] font-bold">{showLabels ? 'ON' : 'OFF'}</span>
            </div>

            {/* Bounds Box */}
            <div
              onClick={toggleBoundsRectangle}
              className={`p-3 rounded-xl border cursor-pointer select-none transition flex items-center justify-between ${
                showBoundsRectangle
                  ? 'bg-slate-950 border-cyan-500/60 text-cyan-300'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Sector Bounds Box</span>
              </div>
              <span className="text-[10px] font-bold">{showBoundsRectangle ? 'ON' : 'OFF'}</span>
            </div>
          </div>
        </div>

        {/* Setting 4: OpenSky OAuth2 Setup Guide */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                <Key className="w-4 h-4 text-cyan-400" />
                <span>OPENSKY NETWORK OAUTH2 AUTHENTICATION</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Configure your personal or organizational API credentials for higher rate limits.
              </p>
            </div>
            <a
              href="https://opensky-network.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 text-xs font-mono flex items-center gap-1"
            >
              OpenSky Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-300">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Server-side Credential Protection (Zero client leaks)</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              OpenSky Network utilizes an OAuth2 OpenID Connect Token Endpoint (<code>https://auth.opensky-network.org</code>).
              To authenticate your production deployment on Vercel:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
              <li>Register an account on <a href="https://opensky-network.org" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">opensky-network.org</a>.</li>
              <li>Open your <strong>Vercel Project Settings &rarr; Environment Variables</strong>.</li>
              <li>Add <code>OPENSKY_CLIENT_ID</code> with your client ID.</li>
              <li>Add <code>OPENSKY_CLIENT_SECRET</code> with your client secret.</li>
              <li>Redeploy the application. The serverless proxy will automatically acquire bearer tokens.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
