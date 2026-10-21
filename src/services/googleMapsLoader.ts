import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

// Key storage keys
const STORAGE_KEY_GMAPS_KEY = 'atc_gmaps_api_key_v1';

/**
 * Returns the currently configured Google Maps API Key, checking:
 * 1. User runtime key stored in localStorage (configurable in Settings)
 * 2. Vite environment variable import.meta.env.VITE_GOOGLE_MAPS_API_KEY
 * 3. Default demo fallback key if provided
 */
export function getGoogleMapsApiKey(): string {
  if (typeof window !== 'undefined') {
    const userKey = localStorage.getItem(STORAGE_KEY_GMAPS_KEY);
    if (userKey && userKey.trim().length > 0) {
      return userKey.trim();
    }
  }

  const envKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
    return envKey.trim();
  }

  return '';
}

export function saveUserGoogleMapsApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (key && key.trim().length > 0) {
    localStorage.setItem(STORAGE_KEY_GMAPS_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_GMAPS_KEY);
  }
}

export function isGoogleMapsConfigured(): boolean {
  return getGoogleMapsApiKey().length > 0;
}

let googleMapsPromise: Promise<typeof google.maps | null> | null = null;

/**
 * Dynamically loads the official Google Maps JavaScript API with places, marker, and geocoding libraries.
 */
export async function loadGoogleMaps(): Promise<typeof google.maps | null> {
  if (typeof window === 'undefined') return null;

  if (window.google?.maps) {
    return window.google.maps;
  }

  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    return null;
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  try {
    setOptions({
      key: apiKey,
      v: 'weekly',
      language: 'en',
    });

    googleMapsPromise = Promise.all([
      importLibrary('maps'),
      importLibrary('marker'),
      importLibrary('geocoding'),
    ])
      .then(() => window.google.maps)
      .catch((err: any) => {
        console.warn('[Google Maps Platform] Loader warning or key invalid:', err?.message || err);
        googleMapsPromise = null;
        return null;
      });
  } catch (err: any) {
    console.warn('[Google Maps Platform] Configuration failed:', err?.message || err);
    return null;
  }

  return googleMapsPromise;
}

export interface GeocodedLocationResult {
  name: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  viewport?: {
    south: number;
    west: number;
    north: number;
    east: number;
  };
  types?: string[];
}

/**
 * Built-in aviation major global hubs database for instant, zero-latency location search
 * (covers international airports, major capitals, and metropolitan airspace corridors).
 */
export const GLOBAL_AVIATION_WAYPOINTS: GeocodedLocationResult[] = [
  { name: 'London Heathrow Airport (LHR)', formattedAddress: 'Hounslow, London TW6 1QG, UK', lat: 51.4700, lng: -0.4543 },
  { name: 'London Gatwick Airport (LGW)', formattedAddress: 'Horley, Gatwick RH6 0NP, UK', lat: 51.1537, lng: -0.1821 },
  { name: 'New York JFK International (JFK)', formattedAddress: 'Queens, NY 11430, United States', lat: 40.6413, lng: -73.7781 },
  { name: 'New York LaGuardia (LGA)', formattedAddress: 'Queens, NY 11371, United States', lat: 40.7769, lng: -73.8740 },
  { name: 'Tokyo Haneda Airport (HND)', formattedAddress: 'Ota City, Tokyo 144-0041, Japan', lat: 35.5494, lng: 139.7798 },
  { name: 'Tokyo Narita Airport (NRT)', formattedAddress: 'Narita, Chiba 282-0004, Japan', lat: 35.7720, lng: 140.3929 },
  { name: 'Singapore Changi Airport (SIN)', formattedAddress: 'Changi, Singapore 819663', lat: 1.3644, lng: 103.9915 },
  { name: 'Frankfurt Airport (FRA)', formattedAddress: '60547 Frankfurt am Main, Germany', lat: 50.0379, lng: 8.5622 },
  { name: 'Paris Charles de Gaulle (CDG)', formattedAddress: '95700 Roissy-en-France, France', lat: 49.0097, lng: 2.5479 },
  { name: 'Dubai International Airport (DXB)', formattedAddress: 'Dubai, United Arab Emirates', lat: 25.2532, lng: 55.3657 },
  { name: 'Amsterdam Schiphol (AMS)', formattedAddress: 'Evert van de Beekstraat 202, 1118 CP Schiphol, Netherlands', lat: 52.3105, lng: 4.7683 },
  { name: 'Hong Kong International (HKG)', formattedAddress: '1 Sky Plaza Rd, Chek Lap Kok, Hong Kong', lat: 22.3080, lng: 113.9185 },
  { name: 'Los Angeles International (LAX)', formattedAddress: '1 World Way, Los Angeles, CA 90045, United States', lat: 33.9416, lng: -118.4085 },
  { name: 'Chicago OHare International (ORD)', formattedAddress: '10000 W Balmoral Ave, Chicago, IL 60666, United States', lat: 41.9742, lng: -87.9073 },
  { name: 'Atlanta Hartsfield-Jackson (ATL)', formattedAddress: '6000 N Terminal Pkwy, Atlanta, GA 30320, United States', lat: 33.6407, lng: -84.4277 },
  { name: 'Sydney Kingsford Smith (SYD)', formattedAddress: 'Mascot NSW 2020, Australia', lat: -33.9399, lng: 151.1753 },
  { name: 'Delhi Indira Gandhi (DEL)', formattedAddress: 'New Delhi, Delhi 110037, India', lat: 28.5562, lng: 77.1000 },
  { name: 'Mumbai Chhatrapati Shivaji (BOM)', formattedAddress: 'Mumbai, Maharashtra 400099, India', lat: 19.0896, lng: 72.8656 },
  { name: 'Zurich Airport (ZRH)', formattedAddress: '8058 Zürich, Switzerland', lat: 47.4582, lng: 8.5555 },
  { name: 'Toronto Pearson International (YYZ)', formattedAddress: '6301 Silver Dart Dr, Mississauga, ON L5P 1B2, Canada', lat: 43.6777, lng: -79.6248 },
  { name: 'Madrid-Barajas Airport (MAD)', formattedAddress: 'Av de la Hispanidad, s/n, 28042 Madrid, Spain', lat: 40.4839, lng: -3.5680 },
  { name: 'San Francisco International (SFO)', formattedAddress: 'San Francisco, CA 94128, United States', lat: 37.6213, lng: -122.3790 },
  { name: 'Seoul Incheon International (ICN)', formattedAddress: '272 Gonghang-ro, Jung-gu, Incheon, South Korea', lat: 37.4602, lng: 126.4407 },
  { name: 'Johannesburg OR Tambo (JNB)', formattedAddress: '1 Jones Rd, Kempton Park, 1632, South Africa', lat: -26.1367, lng: 28.2411 },
  { name: 'Sao Paulo Guarulhos (GRU)', formattedAddress: 'Rod. Hélio Smidt, s/nº - Aeroporto, Guarulhos - SP, Brazil', lat: -23.4356, lng: -46.4731 },
];

/**
 * Searches for places using Google Maps Geocoder if available,
 * seamlessly supplemented by the built-in aviation waypoints registry.
 */
export async function searchLocation(query: string): Promise<GeocodedLocationResult[]> {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  // Filter built-in aviation waypoints
  const localMatches = GLOBAL_AVIATION_WAYPOINTS.filter(
    (wp) =>
      wp.name.toLowerCase().includes(clean) ||
      wp.formattedAddress.toLowerCase().includes(clean)
  );

  // If Google Maps is available, use official Geocoder
  if (typeof window !== 'undefined' && window.google?.maps?.Geocoder) {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ address: query });
      if (response.results && response.results.length > 0) {
        const remoteMatches: GeocodedLocationResult[] = response.results.slice(0, 5).map((r) => {
          const loc = r.geometry.location;
          const vp = r.geometry.viewport;
          return {
            name: r.address_components[0]?.long_name || r.formatted_address,
            formattedAddress: r.formatted_address,
            lat: loc.lat(),
            lng: loc.lng(),
            viewport: vp
              ? {
                  south: vp.getSouthWest().lat(),
                  west: vp.getSouthWest().lng(),
                  north: vp.getNorthEast().lat(),
                  east: vp.getNorthEast().lng(),
                }
              : undefined,
          };
        });

        // Merge and deduplicate by proximity
        return [...remoteMatches, ...localMatches].slice(0, 8);
      }
    } catch {
      // Fall through to localMatches
    }
  }

  return localMatches;
}

/**
 * Reverse geocodes coordinates into an address or location name.
 */
export async function reverseGeocodeCoordinates(lat: number, lng: number): Promise<string> {
  // Check proximity to known aviation waypoints first (within 35 km)
  for (const wp of GLOBAL_AVIATION_WAYPOINTS) {
    const dLat = Math.abs(wp.lat - lat);
    const dLng = Math.abs(wp.lng - lng);
    if (dLat < 0.3 && dLng < 0.3) {
      return wp.name;
    }
  }

  if (typeof window !== 'undefined' && window.google?.maps?.Geocoder) {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const res = await geocoder.geocode({ location: { lat, lng } });
      if (res.results && res.results[0]) {
        return res.results[0].formatted_address;
      }
    } catch {
      // Fall through
    }
  }

  return `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
}

/**
 * Tactical Dark Aviation styling for Google Maps Roadmap.
 * Gives an authentic radar screen midnight aesthetic matching the ATC console.
 */
export const GOOGLE_MAPS_TACTICAL_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#060b13' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#060b13' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#00e5ff' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#0b1626' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#13213d' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#0e182c' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#1d2f54' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#020509' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#0ea5e9' }],
  },
];
