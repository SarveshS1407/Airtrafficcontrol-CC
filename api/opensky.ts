/**
 * Vercel Serverless Function for OpenSky Network REST API
 * Handles proxying, CORS, server-side credential injection, bounding box validation,
 * and edge CDN caching to respect OpenSky rate limits.
 */

interface QueryParams {
  lamin?: string;
  lomin?: string;
  lamax?: string;
  lomax?: string;
  time?: string;
  icao24?: string;
}

export default async function handler(req: any, res: any) {
  // Set CORS headers
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

    // Build upstream OpenSky URL
    const params = new URLSearchParams();
    if (lamin) params.set('lamin', lamin);
    if (lomin) params.set('lomin', lomin);
    if (lamax) params.set('lamax', lamax);
    if (lomax) params.set('lomax', lomax);
    if (time) params.set('time', time);
    if (icao24) params.set('icao24', icao24);

    const upstreamUrl = `https://opensky-network.org/api/states/all?${params.toString()}`;

    // Prepare headers with server-side authentication if configured
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'User-Agent': 'AirTrafficControl-Vercel/1.0',
    };

    const username = process.env.OPENSKY_USERNAME;
    const password = process.env.OPENSKY_PASSWORD;
    if (username && password) {
      headers['Authorization'] = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    }

    // Abort timeout after 8 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

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
        return res.status(504).json({ error: 'Upstream OpenSky API request timed out after 8s' });
      }
      return res.status(502).json({
        error: `Failed to connect to OpenSky Network: ${fetchErr.message}`,
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

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      return res.status(upstreamResponse.status).json({
        error: `OpenSky API error (HTTP ${upstreamResponse.status}): ${errorText || upstreamResponse.statusText}`,
      });
    }

    const data = await upstreamResponse.json();

    // Cache responses at Vercel's edge CDN for 5s to preserve rate-limits across concurrent viewers
    res.setHeader('Cache-Control', 'public, max-age=5, s-maxage=5, stale-while-revalidate=10');
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({
      error: `Internal serverless proxy error: ${err.message || 'Unknown error'}`,
    });
  }
}
