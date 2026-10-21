import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Aircraft, AircraftObservation } from '../../types/opensky';
import { BoundingBox, RegionPreset } from '../../types/geo';
import { MonitoringTarget } from '../../store/useAtcStore';
import { reverseGeocodeCoordinates } from '../../services/googleMapsLoader';
import { ATC_CONFIG } from '../../constants/config';
import { createAircraftDivIcon } from './mapIcons';
import { MapControls } from './MapControls';

interface RadarMapProps {
  aircraftList: Aircraft[];
  selectedIcao24: string | null;
  selectedHistory: AircraftObservation[];
  currentRegion: RegionPreset;
  activeBounds: BoundingBox;
  monitoringTarget?: MonitoringTarget | null;
  viewportSyncEnabled: boolean;
  tileProviderKey: 'osmDark' | 'osmStandard' | 'osmHot';
  showTrail: boolean;
  showBoundsRectangle: boolean;
  mapCenterTarget?: [number, number] | null;
  onSelectAircraft: (icao24: string | null) => void;
  onViewportChange: (bounds: BoundingBox) => void;
  onTileProviderChange: (key: 'osmDark' | 'osmStandard' | 'osmHot') => void;
  onToggleTrail: () => void;
  onToggleBoundsRectangle: () => void;
  onResetGlobalView?: () => void;
  onClearCenterTarget?: () => void;
  onMapClick?: (lat: number, lng: number, placeName?: string) => void;
}

function getMarkerTooltipHtml(ac: Aircraft): string {
  const alt = ac.onGround
    ? 'On Ground'
    : ac.baroAltitudeFeet !== null
    ? `${ac.baroAltitudeFeet.toLocaleString()} ft`
    : 'Alt unavailable';
  const spd = ac.velocityKnots !== null ? `${ac.velocityKnots} kt` : '-- kt';
  const trk = ac.heading !== null ? `${ac.heading}° ${ac.headingCardinal}` : '---';
  const vTrend =
    ac.verticalState === 'CLIMBING'
      ? 'Climbing'
      : ac.verticalState === 'DESCENDING'
      ? 'Descending'
      : 'Level';
  const isEmerg = ['7700', '7600', '7500'].includes(ac.squawk ?? '');

  return `
    <div class="px-3 py-2 rounded-lg bg-white/95 border border-slate-200/90 shadow-lg font-sans text-xs leading-tight select-none backdrop-blur-sm text-slate-800">
      <div class="flex items-center justify-between gap-3 font-semibold border-b border-slate-100 pb-1.5 mb-1.5">
        <span class="text-aviation-navy font-bold text-sm tracking-tight">${ac.callsign}</span>
        <span class="text-slate-500 text-xs font-normal">${ac.originCountry}</span>
      </div>
      <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <span class="text-slate-500">Altitude: <strong class="text-slate-800 font-medium">${alt}</strong></span>
        <span class="text-slate-500">Speed: <strong class="text-aviation-green font-medium">${spd}</strong></span>
        <span class="text-slate-500">Track: <strong class="text-slate-700 font-medium">${trk}</strong></span>
        <span class="text-slate-500">Trend: <strong class="${
          ac.verticalState === 'CLIMBING'
            ? 'text-aviation-green'
            : ac.verticalState === 'DESCENDING'
            ? 'text-aviation-amber'
            : 'text-slate-700'
        } font-medium">${vTrend}</strong></span>
      </div>
      ${
        isEmerg
          ? `<div class="mt-1.5 pt-1 border-t border-red-100 text-red-600 font-semibold text-[11px]">⚠️ Squawk ${ac.squawk} Emergency</div>`
          : ''
      }
    </div>
  `;
}

export const RadarMap: React.FC<RadarMapProps> = ({
  aircraftList,
  selectedIcao24,
  selectedHistory,
  currentRegion,
  activeBounds,
  viewportSyncEnabled,
  tileProviderKey,
  showTrail,
  showBoundsRectangle,
  mapCenterTarget,
  monitoringTarget,
  onSelectAircraft,
  onViewportChange,
  onTileProviderChange,
  onToggleTrail,
  onToggleBoundsRectangle,
  onResetGlobalView,
  onClearCenterTarget,
  onMapClick,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const trailPolylineRef = useRef<L.Polyline | null>(null);
  const boundsRectangleRef = useRef<L.Rectangle | null>(null);
  const rangeRingsRef = useRef<L.LayerGroup | null>(null);
  const monitorCircleRef = useRef<L.Circle | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: currentRegion.center,
      zoom: currentRegion.zoom,
      zoomControl: true,
      attributionControl: true,
    });

    mapInstanceRef.current = map;

    // Viewport listener
    map.on('moveend', () => {
      const b = map.getBounds();
      const newBounds: BoundingBox = {
        lamin: Number(b.getSouth().toFixed(4)),
        lomin: Number(b.getWest().toFixed(4)),
        lamax: Number(b.getNorth().toFixed(4)),
        lomax: Number(b.getEast().toFixed(4)),
      };
      onViewportChange(newBounds);
    });

    // Deselect on map click & trigger onMapClick for radius monitoring
    map.on('click', async (e: L.LeafletMouseEvent) => {
      if ((e.originalEvent.target as HTMLElement)?.classList.contains('leaflet-container')) {
        onSelectAircraft(null);
        if (onMapClick && e.latlng) {
          const placeName = await reverseGeocodeCoordinates(e.latlng.lat, e.latlng.lng);
          onMapClick(e.latlng.lat, e.latlng.lng, placeName);
        }
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sync Click-to-Monitor Radius Circle on Leaflet
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (monitorCircleRef.current) {
      monitorCircleRef.current.remove();
      monitorCircleRef.current = null;
    }

    if (!monitoringTarget) return;

    const circle = L.circle([monitoringTarget.lat, monitoringTarget.lng], {
      radius: monitoringTarget.radiusKm * 1000,
      color: '#2563EB',
      weight: 2,
      dashArray: '6, 6',
      fillColor: '#5B9BD5',
      fillOpacity: 0.1,
    }).addTo(map);

    monitorCircleRef.current = circle;
  }, [monitoringTarget]);

  // ResizeObserver to handle sidebar / drawer toggle without map distortion
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const ro = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });
    ro.observe(mapContainerRef.current);
    return () => ro.disconnect();
  }, []);

  // Sync Basemap Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const providerConfig = ATC_CONFIG.TILE_PROVIDERS[tileProviderKey] || ATC_CONFIG.TILE_PROVIDERS.osmDark;
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const tileLayer = L.tileLayer(providerConfig.url, {
      attribution: providerConfig.attribution,
      maxZoom: providerConfig.maxZoom,
      subdomains: 'subdomains' in providerConfig ? (providerConfig as any).subdomains : 'abc',
      className: 'className' in providerConfig ? (providerConfig as any).className : '',
    }).addTo(map);

    tileLayerRef.current = tileLayer;
  }, [tileProviderKey]);

  // Sync Map View when preset Region changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || viewportSyncEnabled) return;

    map.setView(currentRegion.center, currentRegion.zoom, { animate: true });
  }, [currentRegion, viewportSyncEnabled]);

  // Handle imperative Map Center Target
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapCenterTarget) return;

    map.panTo(mapCenterTarget, { animate: true });
    onClearCenterTarget?.();
  }, [mapCenterTarget, onClearCenterTarget]);

  // Tactical Range Rings Overlay around Sector Center (Suppressed in Global Mode)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (rangeRingsRef.current) {
      rangeRingsRef.current.remove();
    }

    if (currentRegion.id === 'global') {
      return;
    }

    const layer = L.layerGroup();
    const [cLat, cLon] = currentRegion.center;

    // 10 NM (18.52 km), 25 NM (46.3 km), 50 NM (92.6 km)
    const rings = [
      { radiusM: 18520, label: '10 NM' },
      { radiusM: 46300, label: '25 NM' },
      { radiusM: 92600, label: '50 NM' },
    ];

    for (const { radiusM, label } of rings) {
      L.circle([cLat, cLon], {
        radius: radiusM,
        color: '#17324D',
        weight: 1,
        dashArray: '4, 8',
        fill: false,
        opacity: 0.15,
      }).addTo(layer);

      // Label at north edge of ring
      const latOffset = (radiusM / 111139);
      L.marker([cLat + latOffset, cLon], {
        icon: L.divIcon({
          className: 'atc-range-label',
          html: `<span class="text-[9px] font-sans font-medium text-aviation-navy bg-white/90 px-1 py-0.5 rounded border border-slate-200 shadow-sm">${label}</span>`,
          iconSize: [40, 14],
          iconAnchor: [20, 7],
        }),
        interactive: false,
      }).addTo(layer);
    }

    layer.addTo(map);
    rangeRingsRef.current = layer;

    return () => {
      layer.remove();
    };
  }, [currentRegion]);

  // Sync Sector Bounds Rectangle Overlay (Suppressed in Global Mode)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!showBoundsRectangle || currentRegion.id === 'global') {
      if (boundsRectangleRef.current) {
        boundsRectangleRef.current.remove();
        boundsRectangleRef.current = null;
      }
      return;
    }

    const boundsCorner: L.LatLngBoundsExpression = [
      [activeBounds.lamin, activeBounds.lomin],
      [activeBounds.lamax, activeBounds.lomax],
    ];

    if (boundsRectangleRef.current) {
      boundsRectangleRef.current.setBounds(boundsCorner);
    } else {
      boundsRectangleRef.current = L.rectangle(boundsCorner, {
        color: '#2563EB',
        weight: 1.5,
        dashArray: '6, 6',
        fillColor: '#5B9BD5',
        fillOpacity: 0.05,
      }).addTo(map);
    }
  }, [activeBounds, showBoundsRectangle]);

  // High-performance Marker synchronization without full recreation
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const activeMarkers = markersRef.current;
    const currentIcaos = new Set<string>();

    for (const ac of aircraftList) {
      if (ac.latitude === null || ac.longitude === null) continue;

      const id = ac.icao24;
      currentIcaos.add(id);
      const isSelected = selectedIcao24 === id;
      const icon = createAircraftDivIcon(ac, isSelected);
      const tooltipHtml = getMarkerTooltipHtml(ac);

      const existingMarker = activeMarkers.get(id);
      if (existingMarker) {
        existingMarker.setLatLng([ac.latitude, ac.longitude]);
        existingMarker.setIcon(icon);
        existingMarker.setZIndexOffset(isSelected ? 1000 : 100);
        existingMarker.setTooltipContent(tooltipHtml);
      } else {
        const marker = L.marker([ac.latitude, ac.longitude], {
          icon,
          zIndexOffset: isSelected ? 1000 : 100,
        }).addTo(map);

        marker.bindTooltip(tooltipHtml, {
          direction: 'top',
          offset: [0, -18],
          className: 'atc-marker-tooltip',
          opacity: 0.98,
        });

        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          onSelectAircraft(id);
        });

        activeMarkers.set(id, marker);
      }
    }

    // Clean up markers that left the sector
    for (const [id, marker] of activeMarkers.entries()) {
      if (!currentIcaos.has(id)) {
        marker.remove();
        activeMarkers.delete(id);
      }
    }
  }, [aircraftList, selectedIcao24, onSelectAircraft]);

  // Synchronize Flight Path Trail Polyline for Selected Aircraft
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!showTrail || !selectedIcao24 || selectedHistory.length < 2) {
      if (trailPolylineRef.current) {
        trailPolylineRef.current.remove();
        trailPolylineRef.current = null;
      }
      return;
    }

    const latlngs: [number, number][] = selectedHistory.map((pt) => [
      pt.latitude,
      pt.longitude,
    ]);

    if (trailPolylineRef.current) {
      trailPolylineRef.current.setLatLngs(latlngs);
    } else {
      trailPolylineRef.current = L.polyline(latlngs, {
        color: '#00e5ff',
        weight: 3,
        opacity: 0.85,
        dashArray: '4, 6',
      }).addTo(map);
    }
  }, [selectedHistory, selectedIcao24, showTrail]);

  // Control Actions
  const handleFitAll = () => {
    const map = mapInstanceRef.current;
    if (!map || aircraftList.length === 0) return;

    const points: [number, number][] = aircraftList
      .filter((a) => a.latitude !== null && a.longitude !== null)
      .map((a) => [a.latitude!, a.longitude!]);

    if (points.length > 0) {
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 12 });
    }
  };

  const handleCenterSelected = () => {
    const map = mapInstanceRef.current;
    if (!map || !selectedIcao24) return;

    const selectedAc = aircraftList.find((a) => a.icao24 === selectedIcao24);
    if (selectedAc && selectedAc.latitude !== null && selectedAc.longitude !== null) {
      map.panTo([selectedAc.latitude, selectedAc.longitude], { animate: true });
    }
  };

  const handleResetSectorView = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setView(currentRegion.center, currentRegion.zoom, { animate: true });
  };

  const handleResetGlobalView = () => {
    if (onResetGlobalView) {
      onResetGlobalView();
    } else {
      const map = mapInstanceRef.current;
      if (map) {
        map.setView([20, 0], 2, { animate: true });
      }
    }
  };

  return (
    <div className="relative flex-1 w-full h-full bg-atc-950 overflow-hidden">
      {/* Leaflet Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Tactical Map Controls */}
      <MapControls
        tileProviderKey={tileProviderKey}
        showTrail={showTrail}
        showBoundsRectangle={showBoundsRectangle}
        hasSelectedAircraft={Boolean(selectedIcao24)}
        aircraftCount={aircraftList.length}
        onTileProviderChange={onTileProviderChange}
        onFitAllAircraft={handleFitAll}
        onCenterSelected={handleCenterSelected}
        onResetSectorView={handleResetSectorView}
        onResetGlobalView={handleResetGlobalView}
        onToggleTrail={onToggleTrail}
        onToggleBoundsRectangle={onToggleBoundsRectangle}
      />
    </div>
  );
};
