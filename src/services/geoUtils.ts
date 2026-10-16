import { BoundingBox, BoundsValidationResult } from '../types/geo';
import { ATC_CONFIG } from '../constants/config';

/**
 * Validates whether a bounding box is within standard WGS84 geographic limits
 * and does not exceed the maximum allowable area.
 */
export function validateBoundingBox(bounds: BoundingBox): BoundsValidationResult {
  const { lamin, lomin, lamax, lomax } = bounds;

  if (
    typeof lamin !== 'number' ||
    typeof lomin !== 'number' ||
    typeof lamax !== 'number' ||
    typeof lomax !== 'number' ||
    Number.isNaN(lamin) ||
    Number.isNaN(lomin) ||
    Number.isNaN(lamax) ||
    Number.isNaN(lomax)
  ) {
    return { isValid: false, error: 'Bounding coordinates must be valid numbers' };
  }

  if (lamin < -90 || lamin > 90 || lamax < -90 || lamax > 90) {
    return { isValid: false, error: 'Latitude must be between -90 and 90 degrees' };
  }

  if (lomin < -180 || lomin > 180 || lomax < -180 || lomax > 180) {
    return { isValid: false, error: 'Longitude must be between -180 and 180 degrees' };
  }

  if (lamin >= lamax) {
    return { isValid: false, error: 'South latitude (lamin) must be strictly less than North latitude (lamax)' };
  }

  if (lomin >= lomax) {
    return { isValid: false, error: 'West longitude (lomin) must be strictly less than East longitude (lomax)' };
  }

  const latSpan = lamax - lamin;
  const lonSpan = lomax - lomin;

  if (latSpan < ATC_CONFIG.MIN_BOUNDS_SPAN_DEG || lonSpan < ATC_CONFIG.MIN_BOUNDS_SPAN_DEG) {
    return {
      isValid: false,
      error: `Sector span too small (minimum ${ATC_CONFIG.MIN_BOUNDS_SPAN_DEG}° span required)`,
    };
  }

  const areaDegreesSq = latSpan * lonSpan;
  if (areaDegreesSq > ATC_CONFIG.MAX_BOUNDS_AREA_DEG_SQ) {
    return {
      isValid: false,
      error: `Requested sector area (${areaDegreesSq.toFixed(1)}°²) exceeds max safe limit (${ATC_CONFIG.MAX_BOUNDS_AREA_DEG_SQ}°²). Please zoom in or constrain bounds.`,
      areaDegreesSq,
    };
  }

  return { isValid: true, areaDegreesSq };
}

/**
 * Determines whether a given coordinate point falls inside a bounding box
 */
export function isWithinBounds(lat: number, lon: number, bounds: BoundingBox): boolean {
  return (
    lat >= bounds.lamin &&
    lat <= bounds.lamax &&
    lon >= bounds.lomin &&
    lon <= bounds.lomax
  );
}

/**
 * Converts meters to feet
 */
export function metersToFeet(m: number | null): number | null {
  if (m === null || m === undefined || Number.isNaN(m)) return null;
  return Math.round(m * 3.28084);
}

/**
 * Converts feet to meters
 */
export function feetToMeters(ft: number | null): number | null {
  if (ft === null || ft === undefined || Number.isNaN(ft)) return null;
  return Math.round(ft / 3.28084);
}

/**
 * Converts meters per second to knots (nautical miles per hour)
 */
export function mpsToKnots(mps: number | null): number | null {
  if (mps === null || mps === undefined || Number.isNaN(mps)) return null;
  return Math.round(mps * 1.94384);
}

/**
 * Converts meters per second vertical rate to feet per minute (fpm)
 */
export function mpsToFpm(mps: number | null): number | null {
  if (mps === null || mps === undefined || Number.isNaN(mps)) return null;
  return Math.round(mps * 196.85);
}

/**
 * Converts degrees heading (0-360) to a 16-point cardinal compass string
 */
export function headingToCardinal(deg: number | null): string {
  if (deg === null || deg === undefined || Number.isNaN(deg)) return '---';
  const normalized = ((deg % 360) + 360) % 360;
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW',
  ];
  const index = Math.round(normalized / 22.5) % 16;
  return directions[index];
}

/**
 * Computes great circle distance between two points in kilometers (Haversine formula)
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

/**
 * Formats decimal degrees into clean DMS-like aviation string
 */
export function formatCoordinates(lat: number | null, lon: number | null): string {
  if (lat === null || lon === null) return 'N/A';
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
}
