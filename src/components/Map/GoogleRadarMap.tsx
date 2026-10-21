import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  loadGoogleMaps,
  isGoogleMapsConfigured,
  saveUserGoogleMapsApiKey,
  GOOGLE_MAPS_TACTICAL_STYLE,
  reverseGeocodeCoordinates,
} from '../../services/googleMapsLoader';
import { Aircraft, AircraftObservation } from '../../types/opensky';
import { BoundingBox, RegionPreset } from '../../types/geo';
import { MonitoringTarget } from '../../store/useAtcStore';
import {
  Key,
  Layers,
  Compass,
  Globe2,
} from 'lucide-react';

interface GoogleRadarMapProps {
  aircraftList: Aircraft[];
  selectedIcao24: string | null;
  selectedHistory: AircraftObservation[];
  currentRegion: RegionPreset;
  activeBounds: BoundingBox;
  monitoringTarget: MonitoringTarget | null;
  viewportSyncEnabled: boolean;
  showTrail: boolean;
  mapCenterTarget?: [number, number] | null;
  onSelectAircraft: (icao24: string | null) => void;
  onViewportChange: (bounds: BoundingBox) => void;
  onMapClick?: (lat: number, lng: number, placeName?: string) => void;
  onClearCenterTarget?: () => void;
  onSwitchToLeaflet?: () => void;
}

// Plane SVG path for Google Maps Marker icon (24x24 viewport, centered at 12,12)
const AIRPLANE_SVG_PATH =
  'M 12 2 L 14 9 L 22 13 L 22 15 L 14 13 L 14 20 L 17 22 L 17 23 L 12 21.5 L 7 23 L 7 22 L 10 20 L 10 13 L 2 15 L 2 13 L 10 9 Z';

export const GoogleRadarMap: React.FC<GoogleRadarMapProps> = ({
  aircraftList,
  selectedIcao24,
  selectedHistory,
  currentRegion,
  monitoringTarget,
  viewportSyncEnabled,
  showTrail,
  mapCenterTarget,
  onSelectAircraft,
  onViewportChange,
  onMapClick,
  onClearCenterTarget,
  onSwitchToLeaflet,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersMapRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const trailPolylineRef = useRef<google.maps.Polyline | null>(null);
  const monitorCircleRef = useRef<google.maps.Circle | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');

  // Initialize Google Maps instance
  const initMap = useCallback(async () => {
    setLoadError(null);
    const gmaps = await loadGoogleMaps();
    if (!gmaps || !mapContainerRef.current) {
      if (!isGoogleMapsConfigured()) {
        setLoadError('KEY_MISSING');
      } else {
        setLoadError('LOAD_FAILED');
      }
      return;
    }

    try {
      const map = new gmaps.Map(mapContainerRef.current, {
        center: { lat: currentRegion.center[0], lng: currentRegion.center[1] },
        zoom: currentRegion.zoom,
        styles: GOOGLE_MAPS_TACTICAL_STYLE,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        backgroundColor: '#060b13',
      });

      mapInstanceRef.current = map;
      infoWindowRef.current = new gmaps.InfoWindow({ disableAutoPan: true });

      // Viewport change listener on idle
      map.addListener('idle', () => {
        const b = map.getBounds();
        if (!b) return;
        const sw = b.getSouthWest();
        const ne = b.getNorthEast();
        onViewportChange({
          lamin: Number(sw.lat().toFixed(4)),
          lomin: Number(sw.lng().toFixed(4)),
          lamax: Number(ne.lat().toFixed(4)),
          lomax: Number(ne.lng().toFixed(4)),
        });
      });

      // Map click listener for click-to-monitor
      map.addListener('click', async (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        infoWindowRef.current?.close();

        // Deselect current aircraft on background click
        onSelectAircraft(null);

        if (onMapClick) {
          const placeName = await reverseGeocodeCoordinates(lat, lng);
          onMapClick(lat, lng, placeName);
        }
      });

      setMapLoaded(true);
    } catch (err: any) {
      setLoadError(err?.message || 'Failed to initialize Google Maps');
    }
  }, [currentRegion, onSelectAircraft, onViewportChange, onMapClick]);

  useEffect(() => {
    initMap();
    return () => {
      // Clean up markers and overlays
      markersMapRef.current.forEach((m) => m.setMap(null));
      markersMapRef.current.clear();
      trailPolylineRef.current?.setMap(null);
      monitorCircleRef.current?.setMap(null);
      infoWindowRef.current?.close();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Map Center / Preset Region change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded || viewportSyncEnabled) return;

    map.setCenter({ lat: currentRegion.center[0], lng: currentRegion.center[1] });
    map.setZoom(currentRegion.zoom);
  }, [currentRegion, mapLoaded, viewportSyncEnabled]);

  // Imperative pan to target coordinate
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded || !mapCenterTarget) return;

    map.panTo({ lat: mapCenterTarget[0], lng: mapCenterTarget[1] });
    if ((map.getZoom() ?? 0) < 8) {
      map.setZoom(8);
    }
    onClearCenterTarget?.();
  }, [mapCenterTarget, mapLoaded, onClearCenterTarget]);

  // Switch Google Map Type (Roadmap / Satellite / Hybrid / Terrain)
  const handleMapTypeChange = (type: 'roadmap' | 'satellite' | 'hybrid' | 'terrain') => {
    setMapTypeId(type);
    const map = mapInstanceRef.current;
    if (!map) return;

    map.setMapTypeId(type);
    if (type === 'roadmap') {
      map.setOptions({ styles: GOOGLE_MAPS_TACTICAL_STYLE });
    } else {
      map.setOptions({ styles: [] });
    }
  };

  // Sync Aircraft Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded || !window.google?.maps) return;

    const gmaps = window.google.maps;
    const markers = markersMapRef.current;
    const currentIcaos = new Set<string>();

    for (const ac of aircraftList) {
      if (ac.latitude === null || ac.longitude === null) continue;
      const icao = ac.icao24;
      currentIcaos.add(icao);

      const isSelected = selectedIcao24 === icao;
      const isEmergency = ['7700', '7600', '7500'].includes(ac.squawk ?? '');

      let fillColor = '#20394D'; // Deep cockpit navy for cruise
      if (isEmergency) {
        fillColor = '#C94C4C'; // Alert red for emergency
      } else if (isSelected) {
        fillColor = '#D87C43'; // Flight-path orange for selected target
      } else if (ac.verticalState === 'CLIMBING') {
        fillColor = '#467A67'; // Runway green for climb
      } else if (ac.verticalState === 'DESCENDING') {
        fillColor = '#C99B45'; // Warning amber for descent
      }

      const icon: google.maps.Symbol = {
        path: AIRPLANE_SVG_PATH,
        fillColor,
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 1.5,
        scale: isSelected ? 1.3 : 1.0,
        rotation: ac.heading ?? 0,
        anchor: new gmaps.Point(12, 12),
      };

      const pos = { lat: ac.latitude, lng: ac.longitude };
      let marker = markers.get(icao);

      if (!marker) {
        marker = new gmaps.Marker({
          position: pos,
          map,
          icon,
          title: `${ac.callsign} (${ac.originCountry})`,
          zIndex: isSelected ? 1000 : isEmergency ? 900 : 100,
        });

        marker.addListener('click', () => {
          onSelectAircraft(icao);
        });

        marker.addListener('mouseover', () => {
          if (!infoWindowRef.current) return;
          const altStr = ac.onGround
            ? 'On Ground'
            : ac.baroAltitudeFeet !== null
            ? `${ac.baroAltitudeFeet.toLocaleString()} ft`
            : 'Alt unavailable';
          const spdStr = ac.velocityKnots !== null ? `${ac.velocityKnots} kt` : '-- kt';
          const trkStr = ac.heading !== null ? `${ac.heading}° ${ac.headingCardinal}` : '---';

          infoWindowRef.current.setContent(`
            <div style="background:#FCFAF5;color:#172D40;padding:12px;border-radius:10px;border:1px solid #D6E0E7;font-family:Inter,system-ui,sans-serif;font-size:12px;min-width:200px;box-shadow:0 4px 12px rgba(23,45,64,0.12);">
              <div style="font-weight:700;color:#172D40;font-size:14px;display:flex;justify-content:space-between;border-bottom:1px solid #D6E0E7;padding-bottom:6px;margin-bottom:6px;">
                <span>${ac.callsign}</span>
                <span style="font-size:11px;color:#82909B;font-weight:normal;">${ac.originCountry}</span>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px;color:#172D40;">
                <div>Altitude: <strong style="color:#172D40;">${altStr}</strong></div>
                <div>Speed: <strong style="color:#467A67;">${spdStr}</strong></div>
                <div>Heading: <strong style="color:#172D40;">${trkStr}</strong></div>
                <div>Trend: <strong style="color:#172D40;">${ac.verticalState === 'CLIMBING' ? 'Climbing' : ac.verticalState === 'DESCENDING' ? 'Descending' : 'Level'}</strong></div>
              </div>
              ${isEmergency ? `<div style="margin-top:8px;color:#C94C4C;font-weight:600;font-size:11px;">⚠️ Squawk ${ac.squawk} Emergency</div>` : ''}
            </div>
          `);
          infoWindowRef.current.open(map, marker);
        });

        marker.addListener('mouseout', () => {
          infoWindowRef.current?.close();
        });

        markers.set(icao, marker);
      } else {
        marker.setPosition(pos);
        marker.setIcon(icon);
        marker.setZIndex(isSelected ? 1000 : isEmergency ? 900 : 100);
      }
    }

    // Remove markers that are no longer present
    for (const [icao, marker] of markers.entries()) {
      if (!currentIcaos.has(icao)) {
        marker.setMap(null);
        markers.delete(icao);
      }
    }
  }, [aircraftList, selectedIcao24, mapLoaded, onSelectAircraft]);

  // Sync Flight Breadcrumb Path (Trajectory)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded || !window.google?.maps) return;

    if (trailPolylineRef.current) {
      trailPolylineRef.current.setMap(null);
      trailPolylineRef.current = null;
    }

    if (!showTrail || !selectedIcao24 || selectedHistory.length < 2) {
      return;
    }

    const path = selectedHistory
      .filter((p) => p.latitude !== null && p.longitude !== null)
      .map((p) => ({ lat: p.latitude, lng: p.longitude }));

    if (path.length >= 2) {
      trailPolylineRef.current = new window.google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#D87C43',
        strokeOpacity: 0.85,
        strokeWeight: 3,
        map,
      });
    }
  }, [showTrail, selectedIcao24, selectedHistory, mapLoaded]);

  // Sync Click-to-Monitor Radius Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded || !window.google?.maps) return;

    if (monitorCircleRef.current) {
      monitorCircleRef.current.setMap(null);
      monitorCircleRef.current = null;
    }

    if (!monitoringTarget) return;

    monitorCircleRef.current = new window.google.maps.Circle({
      strokeColor: '#2563EB',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#5B9BD5',
      fillOpacity: 0.1,
      map,
      center: { lat: monitoringTarget.lat, lng: monitoringTarget.lng },
      radius: monitoringTarget.radiusKm * 1000, // convert km to meters
    });
  }, [monitoringTarget, mapLoaded]);

  // Handle User submitting API key in-app
  const handleSaveApiKey = () => {
    if (!apiKeyInput.trim()) return;
    saveUserGoogleMapsApiKey(apiKeyInput.trim());
    window.location.reload();
  };

  return (
    <div className="relative w-full h-full bg-[#EBF3FA] overflow-hidden">
      {/* Map DOM Target */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Tactical Layer Switcher */}
      {mapLoaded && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-md font-sans text-xs">
          <div className="px-2 py-1 text-slate-500 flex items-center gap-1 font-medium">
            <Layers className="w-3.5 h-3.5 text-aviation-navy" />
            <span className="hidden sm:inline">Layer:</span>
          </div>
          {(['roadmap', 'satellite', 'hybrid', 'terrain'] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleMapTypeChange(type)}
              className={`px-2.5 py-1 rounded-lg capitalize transition font-medium ${
                mapTypeId === type
                  ? 'bg-aviation-navy text-white shadow-sm'
                  : 'text-slate-600 hover:text-aviation-navy hover:bg-slate-100'
              }`}
            >
              {type === 'roadmap' ? 'Standard' : type}
            </button>
          ))}
        </div>
      )}

      {/* Google Maps Configuration / Key Setup Prompt (if missing or error) */}
      {loadError && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl font-sans text-xs text-slate-700 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-aviation-sky/15 text-aviation-navy border border-aviation-sky/30">
                <Globe2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-aviation-navy tracking-tight">
                  Google Maps Platform Engine
                </h3>
                <p className="text-[11px] text-slate-500">
                  {loadError === 'KEY_MISSING'
                    ? 'An API key is required to use Google Maps cartography'
                    : 'Unable to load Google Maps with current key'}
                </p>
              </div>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed">
              AirTrafficControl-CC supports both <strong>Google Maps Platform</strong> and <strong>OpenStreetMap</strong>.
              You can explore immediately with OpenStreetMap, or enter your personal Google Maps API key below.
            </p>

            <div className="space-y-2">
              <label className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-aviation-navy" />
                Google Maps API Key (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Paste AIzaSy... key"
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-aviation-navy"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="px-4 py-2 bg-aviation-navy hover:bg-aviation-midnight text-white font-medium rounded-lg transition"
                >
                  Save &amp; Load
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                API keys are stored locally in your browser.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={onSwitchToLeaflet}
                className="w-full py-2.5 rounded-lg bg-aviation-sky/10 hover:bg-aviation-sky/20 border border-aviation-sky/30 text-aviation-navy font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-aviation-navy" />
                Switch to OpenStreetMap Engine (Free)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
