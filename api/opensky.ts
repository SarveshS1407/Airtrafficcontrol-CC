/**
 * Vercel Serverless Function for OpenSky Network REST API
 * 
 * Features:
 * - Upstream CORS handling & WGS84 bounding box validation (< 35 deg² safe area)
 * - Strict IPv4 DNS resolution (family: 4) to avoid cloud IPv6 egress drops
 * - Native node:https engine with Abort timeout
 * - OAuth2 Client Credentials authentication flow with in-memory token caching
 * - Cloud-hyperscaler (AWS/Vercel) IP rate limit detection & diagnostic guidance
 * - Edge CDN caching (s-maxage=5) to preserve OpenSky rate limits
 */

import https from 'node:https';
import dns from 'node:dns';

// Force IPv4 lookup precedence in Node runtime to avoid Lambda IPv6 connection blackholes
if (dns && typeof dns.setDefaultResultOrder === 'function') {
  try {
    dns.setDefaultResultOrder('ipv4first');
  } catch {
    // Ignore if not supported in runtime
  }
}

interface QueryParams {
  lamin?: string;
  lomin?: string;
  lamax?: string;
  lomax?: string;
  time?: string;
  icao24?: string;
}

interface UpstreamResult {
  status: number;
  headers: Record<string, string>;
  data: any;
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
    const postData = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }).toString();

    const tokenRes = await new Promise<any>((resolve, reject) => {
      const req = https.request(
        {
          hostname: 'auth.opensky-network.org',
          port: 443,
          path: '/auth/realms/opensky-network/protocol/openid-connect/token',
          method: 'POST',
          family: 4,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
            'User-Agent': 'Mozilla/5.0 (compatible; AirTrafficControl/1.0)',
            Connection: 'close',
          },
          timeout: 6000,
        },
        (res) => {
          let body = '';
          res.on('data', (c) => (body += c));
          res.on('end', () => {
            try {
              resolve({ status: res.statusCode, data: JSON.parse(body) });
            } catch (e) {
              resolve({ status: res.statusCode, data: body });
            }
          });
        }
      );

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('OAuth token request timed out after 6s'));
      });
      req.on('error', reject);
      req.write(postData);
      req.end();
    });

    if (tokenRes.status === 200 && tokenRes.data?.access_token) {
      const expiresInSec = typeof tokenRes.data.expires_in === 'number' ? tokenRes.data.expires_in : 1800;
      cachedOAuthToken = {
        token: tokenRes.data.access_token,
        expiresAt: now + expiresInSec * 1000,
      };
      return cachedOAuthToken.token;
    }
  } catch (err: any) {
    console.error('[OpenSky OAuth2] Token acquisition exception:', err.message);
  }

  return null;
}

function fetchOpenSkyViaHttps(url: string, headers: Record<string, string>, timeoutMs: number): Promise<UpstreamResult> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = https.request(
      {
        hostname: parsed.hostname,
        port: 443,
        path: parsed.pathname + parsed.search,
        method: 'GET',
        family: 4, // Strict IPv4 to avoid AWS Lambda IPv6 egress dead-ends
        headers: {
          ...headers,
          Host: parsed.hostname,
          Connection: 'close',
        },
        timeout: timeoutMs,
      },
      (res) => {
        let rawBody = '';
        res.on('data', (chunk) => {
          rawBody += chunk;
        });
        res.on('end', () => {
          let parsedData = null;
          try {
            parsedData = JSON.parse(rawBody);
          } catch {
            parsedData = rawBody;
          }
          const resHeaders: Record<string, string> = {};
          for (const [k, v] of Object.entries(res.headers)) {
            if (typeof v === 'string') resHeaders[k.toLowerCase()] = v;
          }
          resolve({
            status: res.statusCode || 500,
            headers: resHeaders,
            data: parsedData,
          });
        });
      }
    );

    req.on('timeout', () => {
      req.destroy();
      const err: any = new Error(`Request timed out after ${timeoutMs}ms`);
      err.name = 'AbortError';
      reject(err);
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
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

    // Standard headers
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    };

    // Authenticate via OAuth2 Bearer token if credentials available
    const bearerToken = await getOpenSkyAccessToken();
    if (bearerToken) {
      headers['Authorization'] = `Bearer ${bearerToken}`;
    }

    let upstreamResult: UpstreamResult;
    try {
      // 10 second timeout within Vercel's 15s limit
      upstreamResult = await fetchOpenSkyViaHttps(upstreamUrl, headers, 10000);
    } catch (fetchErr: any) {
      if (fetchErr.name === 'AbortError') {
        return res.status(504).json({
          error:
            'Upstream OpenSky API request timed out after 10s. Note: OpenSky Network throttles or drops unauthenticated requests from public cloud datacenter IPs (AWS/Vercel). Authenticate via OPENSKY_CLIENT_ID & OPENSKY_CLIENT_SECRET, or use Demo Simulation mode.',
          code: 'UPSTREAM_TIMEOUT',
          isCloudBlocked: true,
        });
      }
      return res.status(502).json({
        error: `Failed to connect to OpenSky Network: ${fetchErr.message || 'connection failed'}`,
        code: 'NETWORK_FAILURE',
        detail: fetchErr.code || fetchErr.name || 'UNKNOWN',
        isCloudBlocked: true,
      });
    }

    // Handle Rate Limiting (HTTP 429)
    if (upstreamResult.status === 429) {
      const retryAfter = upstreamResult.headers['retry-after'] || '60';
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        error: `OpenSky Network rate limit reached. Retry after ${retryAfter} seconds.`,
        retryAfter: parseInt(retryAfter, 10) || 60,
      });
    }

    // Handle HTTP 403 / Policy restriction
    if (upstreamResult.status === 403) {
      return res.status(403).json({
        error: `OpenSky API policy restriction: ${typeof upstreamResult.data === 'string' ? upstreamResult.data : 'Access Forbidden'}. Note: OpenSky restricts unauthenticated queries from cloud hyperscalers. Provide OAuth2 credentials or switch to Demo Mode.`,
        code: 'ACCESS_FORBIDDEN',
        isCloudBlocked: true,
      });
    }

    if (upstreamResult.status < 200 || upstreamResult.status >= 300) {
      return res.status(upstreamResult.status).json({
        error: `OpenSky API error (HTTP ${upstreamResult.status}): ${typeof upstreamResult.data === 'string' ? upstreamResult.data : 'Request failed'}`,
      });
    }

    // Propagate rate-limit remaining header if provided by OpenSky
    const remaining = upstreamResult.headers['x-rate-limit-remaining'];
    if (remaining) {
      res.setHeader('X-Rate-Limit-Remaining', remaining);
    }

    // Cache responses at Vercel's edge CDN for 5s to preserve rate limits across concurrent viewers
    res.setHeader('Cache-Control', 'public, max-age=5, s-maxage=5, stale-while-revalidate=10');
    return res.status(200).json(upstreamResult.data);
  } catch (err: any) {
    return res.status(500).json({
      error: `Internal serverless proxy error: ${err.message || 'Unknown error'}`,
    });
  }
}
