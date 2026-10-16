import { describe, it, expect } from 'vitest';
import {
  validateBoundingBox,
  isWithinBounds,
  metersToFeet,
  mpsToKnots,
  mpsToFpm,
  headingToCardinal,
  calculateDistanceKm,
  formatCoordinates,
} from '../services/geoUtils';

describe('geoUtils service', () => {
  describe('validateBoundingBox', () => {
    it('approves a valid geographic bounding box', () => {
      const bounds = {
        lamin: 51.0,
        lomin: -0.5,
        lamax: 52.0,
        lomax: 0.5,
      };
      const res = validateBoundingBox(bounds);
      expect(res.isValid).toBe(true);
      expect(res.areaDegreesSq).toBeCloseTo(1.0);
    });

    it('rejects bounds where south latitude >= north latitude', () => {
      const bounds = {
        lamin: 52.0,
        lomin: -0.5,
        lamax: 51.0,
        lomax: 0.5,
      };
      const res = validateBoundingBox(bounds);
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('South latitude');
    });

    it('rejects bounds where west longitude >= east longitude', () => {
      const bounds = {
        lamin: 50.0,
        lomin: 5.0,
        lamax: 51.0,
        lomax: 4.0,
      };
      const res = validateBoundingBox(bounds);
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('West longitude');
    });

    it('rejects latitude out of [-90, 90] range', () => {
      const bounds = {
        lamin: -95.0,
        lomin: 0.0,
        lamax: 10.0,
        lomax: 5.0,
      };
      const res = validateBoundingBox(bounds);
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('Latitude must be between -90 and 90');
    });

    it('rejects bounds exceeding maximum allowable area to prevent huge queries', () => {
      const hugeBounds = {
        lamin: 10.0,
        lomin: 10.0,
        lamax: 40.0,
        lomax: 40.0, // 30 * 30 = 900 deg^2
      };
      const res = validateBoundingBox(hugeBounds);
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('exceeds max safe limit');
    });
  });

  describe('isWithinBounds', () => {
    const sector = {
      lamin: 50.0,
      lomin: -1.0,
      lamax: 52.0,
      lomax: 1.0,
    };

    it('returns true for points inside the sector', () => {
      expect(isWithinBounds(51.5, 0.0, sector)).toBe(true);
    });

    it('returns false for points outside the sector', () => {
      expect(isWithinBounds(49.9, 0.0, sector)).toBe(false);
      expect(isWithinBounds(51.5, 2.0, sector)).toBe(false);
    });
  });

  describe('unit conversions and formatting', () => {
    it('converts meters to feet accurately', () => {
      expect(metersToFeet(null)).toBeNull();
      expect(metersToFeet(1000)).toBe(3281);
      expect(metersToFeet(10000)).toBe(32808);
    });

    it('converts meters per second to knots accurately', () => {
      expect(mpsToKnots(null)).toBeNull();
      expect(mpsToKnots(100)).toBe(194);
      expect(mpsToKnots(250)).toBe(486);
    });

    it('converts vertical rate m/s to feet per minute (fpm)', () => {
      expect(mpsToFpm(null)).toBeNull();
      expect(mpsToFpm(5.0)).toBe(984);
      expect(mpsToFpm(-7.5)).toBe(-1476);
    });

    it('converts degrees true track to 16-point cardinal compass', () => {
      expect(headingToCardinal(null)).toBe('---');
      expect(headingToCardinal(0)).toBe('N');
      expect(headingToCardinal(90)).toBe('E');
      expect(headingToCardinal(180)).toBe('S');
      expect(headingToCardinal(270)).toBe('W');
      expect(headingToCardinal(45)).toBe('NE');
      expect(headingToCardinal(225)).toBe('SW');
    });

    it('calculates Haversine distance correctly', () => {
      // Distance between London (51.5074, -0.1278) and Paris (48.8566, 2.3522) ~ 343 km
      const dist = calculateDistanceKm(51.5074, -0.1278, 48.8566, 2.3522);
      expect(dist).toBeGreaterThan(340);
      expect(dist).toBeLessThan(350);
    });

    it('formats coordinates into aviation notation', () => {
      expect(formatCoordinates(null, null)).toBe('N/A');
      expect(formatCoordinates(51.4700, -0.4543)).toBe('51.4700° N, 0.4543° W');
    });
  });
});
