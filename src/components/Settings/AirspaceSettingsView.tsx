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
    <div className="flex-1 bg-aviation-cloud p-4 sm:p-6 lg:p-8 overflow-y-auto font-sans text-aviation-slate">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-aviation-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-aviation-sky" />
              <h2 className="text-xl font-bold tracking-tight text-aviation-navy">
                Airspace Surveillance Settings
              </h2>
            </div>
            <p className="text-xs text-aviation-muted mt-1">
              Configure telemetry refresh cycles, basemap layers, and API credentials
            </p>
          </div>
          <button
            onClick={onClose}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-aviation-border text-xs font-medium text-aviation-navy transition shadow-2xs"
          >
            ← Return to Live Radar Map
          </button>
        </div>

        {/* Setting 1: Refresh Polling Rate */}
        <div className="bg-white border border-aviation-border rounded-2xl p-6 space-y-4 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-aviation-navy">
              <Clock className="w-4 h-4 text-aviation-sky" />
              <span>Telemetry Polling Interval</span>
            </div>
            <p className="text-xs text-aviation-muted mt-1">
              Controls the automated radar sweep frequency. OpenSky anonymous usage policy allows a minimum of 10s.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            {ATC_CONFIG.POLLING_INTERVAL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPollingInterval(opt.value)}
                className={`py-2 px-3 rounded-xl border text-center transition font-medium ${
                  pollingIntervalMs === opt.value
                    ? 'bg-aviation-lightSky border-aviation-sky text-aviation-navy font-bold shadow-xs'
                    : 'bg-aviation-cloud border-aviation-border text-aviation-muted hover:text-aviation-navy hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Setting 2: Geospatial Engine & Google Maps Platform */}
        <div className="bg-white border border-aviation-border rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-aviation-navy">
                <Globe2 className="w-4 h-4 text-aviation-sky" />
                <span>Geospatial Cartography Engine</span>
              </div>
              <p className="text-xs text-aviation-muted mt-1">
                Choose between Google Maps Platform (with roadmap, satellite, hybrid, terrain, & geocoding) and Leaflet / OpenStreetMap.
              </p>
            </div>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full border self-start sm:self-auto ${
                isGoogleMapsConfigured()
                  ? 'bg-emerald-50 border-emerald-300 text-aviation-green'
                  : 'bg-aviation-cloud border-aviation-border text-aviation-muted'
              }`}
            >
              {isGoogleMapsConfigured() ? 'Google Maps Configured' : 'OSM Default Active'}
            </span>
          </div>

          {/* Engine Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <button
              onClick={() => setMapEngine('google')}
              className={`p-4 rounded-xl border text-left transition ${
                mapEngine === 'google'
                  ? 'bg-aviation-lightSky border-aviation-sky text-aviation-navy font-medium shadow-xs ring-1 ring-aviation-sky/30'
                  : 'bg-aviation-cloud border-aviation-border text-aviation-slate hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Globe2 className="w-4 h-4 text-aviation-sky" />
                <span className="font-bold text-aviation-navy">Google Maps Platform</span>
              </div>
              <p className="text-xs text-aviation-muted leading-relaxed">
                Official Google Maps JavaScript API with clean daylight roadmap, satellite imagery, hybrid, terrain, and geocoding search.
              </p>
            </button>

            <button
              onClick={() => setMapEngine('leaflet')}
              className={`p-4 rounded-xl border text-left transition ${
                mapEngine === 'leaflet'
                  ? 'bg-aviation-lightSky border-aviation-sky text-aviation-navy font-medium shadow-xs ring-1 ring-aviation-sky/30'
                  : 'bg-aviation-cloud border-aviation-border text-aviation-slate hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <MapIcon className="w-4 h-4 text-aviation-sky" />
                <span className="font-bold text-aviation-navy">OpenStreetMap / Leaflet</span>
              </div>
              <p className="text-xs text-aviation-muted leading-relaxed">
                Open-source geospatial visualization with clean daylight OSM and high-contrast basemaps with zero commercial watermarks.
              </p>
            </button>
          </div>

          {/* Key configuration */}
          <div className="p-4 rounded-xl bg-aviation-cloud/60 border border-aviation-border text-xs space-y-2.5">
            <label className="text-xs text-aviation-navy font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-aviation-sky" />
                Google Maps JavaScript API Key
              </span>
              <a
                href="https://console.cloud.google.com/google/maps-apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="text-aviation-sky hover:underline font-normal text-xs flex items-center gap-1"
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
                className="flex-1 bg-white border border-aviation-border rounded-xl px-3 py-2 text-xs text-aviation-navy focus:outline-none focus:border-aviation-sky"
              />
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 bg-aviation-navy hover:bg-aviation-midnight text-white font-medium rounded-xl transition text-xs shrink-0 flex items-center gap-1.5 shadow-xs"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-aviation-green" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Key</span>
                )}
              </button>
            </div>
            <p className="text-[11px] text-aviation-muted">
              Stored securely in your browser session/localStorage. Can also be provided at build-time via <code>VITE_GOOGLE_MAPS_API_KEY</code>.
            </p>
          </div>
        </div>

        {/* Setting 3: Basemap Provider */}
        <div className="bg-white border border-aviation-border rounded-2xl p-6 space-y-4 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-aviation-navy">
              <Layers className="w-4 h-4 text-aviation-sky" />
              <span>Basemap Cartography (OpenStreetMap)</span>
            </div>
            <p className="text-xs text-aviation-muted mt-1">
              Select between daylight aviation charts, high-contrast, or humanitarian styling. No watermarked commercial tiles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {Object.entries(ATC_CONFIG.TILE_PROVIDERS).map(([key, provider]) => (
              <button
                key={key}
                onClick={() => setTileProvider(key as any)}
                className={`p-4 rounded-xl border text-left transition ${
                  tileProviderKey === key
                    ? 'bg-aviation-lightSky border-aviation-sky text-aviation-navy font-medium shadow-xs ring-1 ring-aviation-sky/30'
                    : 'bg-aviation-cloud border-aviation-border text-aviation-slate hover:bg-slate-100'
                }`}
              >
                <span className="font-bold block text-aviation-navy mb-1">{provider.name}</span>
                <span className="text-[11px] text-aviation-muted leading-tight block">
                  Official OpenStreetMap tiles with verified CORS compliance.
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Setting 4: Radar Visual Overlays */}
        <div className="bg-white border border-aviation-border rounded-2xl p-6 space-y-4 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-aviation-navy">
              <Eye className="w-4 h-4 text-aviation-sky" />
              <span>Radar Visual Overlays</span>
            </div>
            <p className="text-xs text-aviation-muted mt-1">
              Toggle visual aids and historical breadcrumbs on the interactive map.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Trail */}
            <div
              onClick={toggleTrail}
              className={`p-3.5 rounded-xl border cursor-pointer select-none transition flex items-center justify-between ${
                showTrail
                  ? 'bg-aviation-lightSky border-aviation-sky text-aviation-navy font-semibold'
                  : 'bg-aviation-cloud border-aviation-border text-aviation-muted'
              }`}
            >
              <div className="flex items-center gap-2">
                <Spline className="w-4 h-4" />
                <span>Flight History Trail</span>
              </div>
              <span className="text-xs font-bold">{showTrail ? 'ON' : 'OFF'}</span>
            </div>

            {/* Labels */}
            <div
              onClick={toggleLabels}
              className={`p-3.5 rounded-xl border cursor-pointer select-none transition flex items-center justify-between ${
                showLabels
                  ? 'bg-aviation-lightSky border-aviation-sky text-aviation-navy font-semibold'
                  : 'bg-aviation-cloud border-aviation-border text-aviation-muted'
              }`}
            >
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>Callsign Labels</span>
              </div>
              <span className="text-xs font-bold">{showLabels ? 'ON' : 'OFF'}</span>
            </div>

            {/* Bounds Box */}
            <div
              onClick={toggleBoundsRectangle}
              className={`p-3.5 rounded-xl border cursor-pointer select-none transition flex items-center justify-between ${
                showBoundsRectangle
                  ? 'bg-aviation-lightSky border-aviation-sky text-aviation-navy font-semibold'
                  : 'bg-aviation-cloud border-aviation-border text-aviation-muted'
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Sector Bounds Box</span>
              </div>
              <span className="text-xs font-bold">{showBoundsRectangle ? 'ON' : 'OFF'}</span>
            </div>
          </div>
        </div>

        {/* Setting 5: OpenSky OAuth2 Setup Guide */}
        <div className="bg-white border border-aviation-border rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-aviation-navy">
                <Key className="w-4 h-4 text-aviation-sky" />
                <span>OpenSky Network OAuth2 Authentication</span>
              </div>
              <p className="text-xs text-aviation-muted mt-1">
                Configure your personal or organizational API credentials for higher rate limits.
              </p>
            </div>
            <a
              href="https://opensky-network.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-aviation-sky hover:underline text-xs flex items-center gap-1 font-medium"
            >
              OpenSky Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-4 rounded-xl bg-aviation-cloud/60 border border-aviation-border text-xs space-y-3">
            <div className="flex items-center gap-2 text-aviation-navy font-medium">
              <Shield className="w-4 h-4 text-aviation-green" />
              <span>Server-side Credential Protection (Zero client leaks)</span>
            </div>
            <p className="text-aviation-slate text-xs leading-relaxed">
              OpenSky Network utilizes an OAuth2 OpenID Connect Token Endpoint (<code>https://auth.opensky-network.org</code>).
              To authenticate your production deployment on Vercel:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-aviation-slate text-xs">
              <li>Register an account on <a href="https://opensky-network.org" target="_blank" rel="noopener noreferrer" className="text-aviation-sky underline">opensky-network.org</a>.</li>
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
