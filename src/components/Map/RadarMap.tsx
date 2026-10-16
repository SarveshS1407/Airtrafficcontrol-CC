import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Aircraft, AircraftObservation } from '../../types/opensky';
import { BoundingBox, RegionPreset } from '../../types/geo';
import { ATC_CONFIG } from '../../constants/config';
import { createAircraftDivIcon } from './mapIcons';
import { MapControls } from './MapControls';

interface RadarMapProps {
  aircraftList: Aircraft[];
  selectedIcao24: string | null;
  selectedHistory: AircraftObservation[];
  currentRegion: RegionPreset;
  activeBounds: BoundingBox;
  viewportSyncEnabled: boolean;
  tileProviderKey: 'cartoDark' | 'osmStandard' | 'cartoPositron';
  showTrail: boolean;
  showBoundsRectangle: boolean;
  onSelectAircraft: (icao24: string | null) => void;
  onViewportChange: (bounds: BoundingBox) => void;
  onTileProviderChange: (key: 'cartoDark' | 'osmStandard' | 'cartoPositron') => void;
  onToggleTrail: () => void;
  onToggleBoundsRectangle: () => void;
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
  onSelectAircraft,
  onViewportChange,
  onTileProviderChange,
  onToggleTrail,
  onToggleBoundsRectangle,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const trailPolylineRef = useRef<L.Polyline | null>(null);
  const boundsRectangleRef = useRef<L.Rectangle | null>(null);

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

    // Deselect on map click
    map.on('click', (e) => {
      // If clicking directly on map canvas, deselect
      if ((e.originalEvent.target as HTMLElement)?.classList.contains('leaflet-container')) {
        onSelectAircraft(null);
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); // Run once on mount

  // Sync Basemap Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const providerConfig = ATC_CONFIG.TILE_PROVIDERS[tileProviderKey];
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const tileLayer = L.tileLayer(providerConfig.url, {
      attribution: providerConfig.attribution,
      maxZoom: providerConfig.maxZoom,
      subdomains: 'subdomains' in providerConfig ? providerConfig.subdomains : 'abc',
    }).addTo(map);

    tileLayerRef.current = tileLayer;
  }, [tileProviderKey]);

  // Sync Map View when preset Region changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || viewportSyncEnabled) return;

    map.setView(currentRegion.center, currentRegion.zoom, { animate: true });
  }, [currentRegion, viewportSyncEnabled]);

  // Sync Sector Bounds Rectangle Overlay
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!showBoundsRectangle) {
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
        color: '#06b6d4',
        weight: 1.5,
        dashArray: '6, 6',
        fillColor: '#06b6d4',
        fillOpacity: 0.03,
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

      const existingMarker = activeMarkers.get(id);
      if (existingMarker) {
        existingMarker.setLatLng([ac.latitude, ac.longitude]);
        existingMarker.setIcon(icon);
        existingMarker.setZIndexOffset(isSelected ? 1000 : 100);
      } else {
        const marker = L.marker([ac.latitude, ac.longitude], {
          icon,
          zIndexOffset: isSelected ? 1000 : 100,
        }).addTo(map);

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
        onToggleTrail={onToggleTrail}
        onToggleBoundsRectangle={onToggleBoundsRectangle}
      />
    </div>
  );
};
