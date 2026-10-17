/**
 * Vercel Serverless Function for OpenSky Network REST API
 * 
 * Features:
 * - Upstream CORS handling & WGS84 bounding box validation (< 35 deg² safe area)
 * - OAuth2 Client Credentials authentication flow with in-memory token caching
 * - Cloud-hyperscaler (AWS/Vercel) IP rate limit detection & diagnostic guidance
 * - Configured timeout with graceful HTTP 504 / 429 classification
 * - Edge CDN caching (s-maxage=5) to protect OpenSky rate limits
 */

interface QueryParams {
  lamin?: string;
  lomin?: string;
  lamax?: string;
  lomax?: string;
  time?: string;
  icao24?: string;
}

// In-memory token cache across warm serverless invocations
let cachedOAuthToken: { token: string; expiresAt: number } | null = null;

async function getOpenSkyAccessToken(): Promise<string | null> {
  const clientId = process.env.OPENSKY_CLIENT_ID;
  const clientSecret = process.env.OPENSKY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  const now = Date.now();
  // Return cached token if valid for at least 30 more seconds
  if (cachedOAuthToken && cachedOAuthToken.expiresAt > now + 30000) {
    return cachedOAuthToken.token;
  }

  try {
    const tokenEndpoint =
      'https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token';
    const bodyParams = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    });

    const tokenRes = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'AirTrafficControl-Vercel/2.0',
      },
      body: bodyParams.toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.warn(`[OpenSky OAuth2] Token request failed (${tokenRes.status}):`, errText);
      return null;
    }

    const tokenData = await tokenRes.json();
    if (tokenData.access_token) {
      const expiresInSec = typeof tokenData.expires_in === 'number' ? tokenData.expires_in : 1800;
      cachedOAuthToken = {
        token: tokenData.access_token,
        expiresAt: now + expiresInSec * 1000,
      };
      return cachedOAuthToken.token;
    }
  } catch (err: any) {
    console.error('[OpenSky OAuth2] Token acquisition exception:', err.message);
  }

  return null;
}

export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const query = req.query as QueryParams;
    const { lamin, lomin, lamax, lomax, time, icao24 } = query;

    // Validate bounding box coordinates if provided
    if (lamin !== undefined || lomin !== undefined || lamax !== undefined || lomax !== undefined) {
      if (lamin === undefined || lomin === undefined || lamax === undefined || lomax === undefined) {
        return res.status(400).json({
          error: 'Incomplete bounding box: lamin, lomin, lamax, and lomax are all required',
        });
      }

      const sLat = parseFloat(lamin);
      const wLon = parseFloat(lomin);
      const nLat = parseFloat(lamax);
      const eLon = parseFloat(lomax);

      if (isNaN(sLat) || isNaN(wLon) || isNaN(nLat) || isNaN(eLon)) {
        return res.status(400).json({ error: 'Bounding coordinates must be valid floating point numbers' });
      }

      if (sLat < -90 || sLat > 90 || nLat < -90 || nLat > 90) {
        return res.status(400).json({ error: 'Latitude must be between -90 and 90 degrees' });
      }

      if (wLon < -180 || wLon > 180 || eLon < -180 || eLon > 180) {
        return res.status(400).json({ error: 'Longitude must be between -180 and 180 degrees' });
      }

      if (sLat >= nLat) {
        return res.status(400).json({ error: 'South latitude (lamin) must be strictly less than North latitude (lamax)' });
      }

      if (wLon >= eLon) {
        return res.status(400).json({ error: 'West longitude (lomin) must be strictly less than East longitude (lomax)' });
      }

      const area = (nLat - sLat) * (eLon - wLon);
      if (area > 35) {
        return res.status(400).json({
          error: `Sector area (${area.toFixed(1)}°²) exceeds max safe limit of 35°². Please zoom in.`,
        });
      }
    }

    // Build upstream OpenSky REST URL
    const params = new URLSearchParams();
    if (lamin) params.set('lamin', lamin);
    if (lomin) params.set('lomin', lomin);
    if (lamax) params.set('lamax', lamax);
    if (lomax) params.set('lomax', lomax);
    if (time) params.set('time', time);
    if (icao24) params.set('icao24', icao24);

    const upstreamUrl = `https://opensky-network.org/api/states/all?${params.toString()}`;

    // Prepare headers
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'User-Agent': 'AirTrafficControl-Vercel/2.0',
    };

    // Authenticate via OAuth2 Bearer token if credentials available
    const bearerToken = await getOpenSkyAccessToken();
    if (bearerToken) {
      headers['Authorization'] = `Bearer ${bearerToken}`;
    }

    // Upstream timeout: 11 seconds (within Vercel 15s limit)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 11000);

    let upstreamResponse: Response;
    try {
      upstreamResponse = await fetch(upstreamUrl, {
        method: 'GET',
        headers,
        signal: controller.signal,
      });
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      if (fetchErr.name === 'AbortError') {
        return res.status(504).json({
          error:
            'Upstream OpenSky API request timed out after 11s. Note: OpenSky Network throttles or drops unauthenticated requests from public cloud datacenter IPs (AWS/Vercel). Authenticate via OPENSKY_CLIENT_ID & OPENSKY_CLIENT_SECRET, or use Demo Simulation mode.',
          code: 'UPSTREAM_TIMEOUT',
          isCloudBlocked: true,
        });
      }
      return res.status(502).json({
        error: `Failed to connect to OpenSky Network: ${fetchErr.message}`,
        code: 'NETWORK_FAILURE',
      });
    } finally {
      clearTimeout(timeoutId);
    }

    // Handle Rate Limiting (HTTP 429)
    if (upstreamResponse.status === 429) {
      const retryAfter = upstreamResponse.headers.get('retry-after') || '60';
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        error: `OpenSky Network rate limit reached. Retry after ${retryAfter} seconds.`,
        retryAfter: parseInt(retryAfter, 10) || 60,
      });
    }

    // Handle HTTP 403 / Policy restriction
    if (upstreamResponse.status === 403) {
      const errorText = await upstreamResponse.text();
      return res.status(403).json({
        error: `OpenSky API policy restriction: ${errorText || 'Access Forbidden'}. Note: OpenSky blocks unauthenticated requests from cloud hyperscalers. Provide OAuth2 credentials or switch to Demo Mode.`,
        code: 'ACCESS_FORBIDDEN',
        isCloudBlocked: true,
      });
    }

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      return res.status(upstreamResponse.status).json({
        error: `OpenSky API error (HTTP ${upstreamResponse.status}): ${errorText || upstreamResponse.statusText}`,
      });
    }

    const data = await upstreamResponse.json();

    // Propagate rate-limit remaining header if provided by OpenSky
    const remaining = upstreamResponse.headers.get('x-rate-limit-remaining');
    if (remaining) {
      res.setHeader('X-Rate-Limit-Remaining', remaining);
    }

    // Cache responses at Vercel's edge CDN for 5s to preserve rate limits across concurrent viewers
    res.setHeader('Cache-Control', 'public, max-age=5, s-maxage=5, stale-while-revalidate=10');
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({
      error: `Internal serverless proxy error: ${err.message || 'Unknown error'}`,
    });
  }
}
