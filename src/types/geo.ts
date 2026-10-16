/**
 * Geographic models, bounding box and region types
 */

export interface BoundingBox {
  lamin: number; // South latitude (-90 to 90)
  lomin: number; // West longitude (-180 to 180)
  lamax: number; // North latitude (-90 to 90)
  lomax: number; // East longitude (-180 to 180)
}

export interface RegionPreset {
  id: string;
  name: string;
  description: string;
  country: string;
  bounds: BoundingBox;
  center: [number, number]; // [lat, lon]
  zoom: number;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface BoundsValidationResult {
  isValid: boolean;
  error?: string;
  areaDegreesSq?: number;
}
