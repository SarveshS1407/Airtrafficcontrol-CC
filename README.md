# Airtrafficcontrol-CC — Real-Time Aircraft Monitoring Dashboard

A high-performance, mission-critical aviation monitoring dashboard engineered with **React 18, Vite, TypeScript, Leaflet, and Zustand**, consuming live ADS-B state vectors from the **OpenSky Network REST API**.

Designed specifically as an air-traffic operations terminal rather than a generic admin dashboard, featuring a restrained tactical navy palette, high-contrast monospace telemetry, dynamic SVG vector markers rotated to true heading, local movement history tracking, emergency squawk indicators, range rings, and intelligent rate-limiting resilience.

---

## 1. Architectural Highlights

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ATC OPERATIONS INTERFACE                        │
├────────────────────┬───────────────────────────────────┬───────────────┤
│    LEFT SIDEBAR    │            CENTER MAP             │  RIGHT PANEL  │
│  - Metrics Banner  │  - Leaflet Map (CartoDB / OSM)    │  - Flight HUD │
│  - Sector Selector │  - Dynamic SVG Aircraft Markers   │  - Telemetry  │
│  - Telemetry Filter│  - Range Rings (10, 25, 50 NM)    │  - Profile    │
│  - Flight List     │  - Selected Breadcrumbs Trail     │  - Waypoints  │
│  - Emergency Filter│  - Sector Bounds Rectangle        │  - GeoJSON    │
└────────────────────┴───────────────────────────────────┴───────────────┘
                                   │
                       Zustand State Store (O(1))
       ┌───────────────────────────┴───────────────────────────┐
       ▼                                                       ▼
Live OpenSky Client                                 Demo Vector Simulator
- /api/opensky (Vercel Serverless / Vite Proxy)     - Recorded London TMA fixture
- WGS84 Bounding Box Validation                     - Real-time kinematic motion
- HTTP 429 Rate-Limit Backoff                       - Zero-network offline testing
- Stale Data Snapshot Cache                         - Explicit DEMO Labeling
- Edge CDN Caching (s-maxage=5)                     - Full offline compliance
```

### Core Architecture Principles:
- **Decoupled State Management**: Built on `Zustand` with an `icao24`-keyed hash map for $O(1)$ aircraft lookups, preventing marker recreation, DOM thrashing, and unnecessary component re-renders.
- **Identity Preservation**: Tracks aircraft persistently across polling cycles. Retains `firstSeenAt` timestamps, increments observation counts, and accumulates movement breadcrumbs.
- **Controlled Polling Lifecycle**: Configurable intervals (default 10s compliant with OpenSky anonymous policy). Active `AbortController` cancellation prevents duplicate/overlapping network cycles.
- **Defensive API Resilience**: Robust parser that handles `null`, `undefined`, or out-of-range fields without crashing. Gracefully handles HTTP 429 rate limits with exponential backoff and keeps previous snapshots marked with a prominent **STALE SNAPSHOT** badge.
- **Serverless Production Proxy**: Deploys on Vercel with an edge-ready serverless function at `/api/opensky` (`api/opensky.ts`). Injects server-side credentials without exposing secrets to client bundles, enforces geographic bounding box constraints (< 35 deg²), and caches responses at the CDN edge (`s-maxage=5, stale-while-revalidate=10`) to protect upstream OpenSky rate limits.

---

## 2. Technical Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | React 18 + Vite | Blazing fast HMR, optimized production tree-shaking |
| **Language** | TypeScript (Strict Mode) | Full type safety across state vectors, filters, and telemetry models |
| **Mapping Engine** | Leaflet 1.9.4 | Native geospatial projection, smooth SVG marker rotation, minimal overhead |
| **State Store** | Zustand 4.5.5 | Lightweight reactive store outside React lifecycle, zero selector boilerplate |
| **Styling** | Tailwind CSS 3.4 | Custom tactical navy theme (`#060b13`, `#0b1324`, `#06b6d4`, `#10b981`) |
| **Icons** | Lucide React | High-clarity aviation symbols (compass, radio, crosshair, layers) |
| **Backend / Proxy** | Vercel Serverless (`api/opensky.ts`) | Server-side CORS resolution, credential protection, and edge caching |
| **Test Suite** | Vitest + Testing Library | Fast unit and component test runner with jsdom |

---

## 3. Features & Requirements Coverage

### 🛰️ Live Aircraft Monitoring
- Fetches live ADS-B and MLAT state vectors from OpenSky Network REST API (`GET /api/states/all`).
- Renders custom SVG aircraft markers rotated precisely to true track heading (`0°–360°`).
- **Color-Coded Telemetry & Flight States**:
  - **Pulsing Crimson Red**: Emergency Squawk (`7700` Mayday, `7600` Radio Fail, `7500` Hijack)
  - **Bright Cyan Halo**: Selected active target
  - **Emerald Green**: Low altitude / Terminal approach (< 10,000 ft)
  - **Sky Blue**: Mid-level transit (10,000–25,000 ft)
  - **Indigo Violet**: High cruising (> 25,000 ft)
  - **Amber**: On-ground (taxiway / parking gate)
  - **Slate Grey**: Stale radar contact
- **Tactical Range Rings**: Concentric tactical nautical-mile rings (`10 NM`, `25 NM`, `50 NM`) centered on the active sector.
- **Interactive Map Hover Tooltips**: Instant hover readout showing Callsign, Flight Level, Speed, and Heading without deselecting active targets.
- **Complete Telemetry Inspection**: Callsign, ICAO24 hex, origin country, barometric altitude (ft/m), Flight Level (`FLxxx`), geometric altitude, ground speed (kts/kmh), Mach estimate, true track with compass dial, vertical rate (+/- fpm), squawk code, SPI flag, position source, and last reported timestamps.

### 🗺️ Geographic Selection & Bounding Boxes
- **Preset Sectors**:
  - London TMA (Heathrow / Gatwick / Stansted)
  - New York Metro (JFK / LGA / EWR TRACON)
  - Frankfurt TMA (Rhine-Main transit)
  - Switzerland Alps (Zurich / Geneva alpine corridor)
  - Tokyo Bay (Haneda / Narita approach)
  - Singapore Changi (Malacca Strait FIR)
  - Custom Region
- **Custom Bounding Box Editor**: Enter custom WGS84 decimal degree coordinates (`lamin`, `lomin`, `lamax`, `lomax`) with instant client-side validation against latitude, longitude, and maximum safe query area constraints.
- **Map Viewport Sync Mode**: Seamlessly syncs the bounding box to the current Leaflet viewport as you pan and zoom.

### 🎯 Telemetry Filtering & Search
- Real-time search by **Callsign**, **ICAO24 transponder hex**, or **Origin Country**.
- **Emergency Squawk Toggle**: Instantly isolate flights squawking `7700` (General Emergency), `7600` (Radio Communications Failure), or `7500` (Unlawful Interference).
- **Flight State Pills**: `ALL`, `AIRBORNE ONLY`, `ON GROUND ONLY`.
- **Vertical Trend Pills**: `ALL`, `CLIMBING` (+), `LEVEL` (=), `DESCENDING` (-).
- **Altitude Ceiling Slider**: 0 ft to 55,000+ ft.
- **Speed Range Slider**: 0 kts to 700+ kts.
- Instant filtered count indicator and one-click filter reset.

### 📈 Movement History & Breadcrumbs
- Locally records timestamped observations `(lat, lon, altitude, velocity, heading, verticalRate, timestamp)` in a circular buffer up to 100 waypoints per aircraft.
- Draws an interactive dashed flight path trail on the map for the selected aircraft.
- Displays an SVG **Altitude & Velocity Profile Chart** illustrating flight trajectory over time.
- **One-Click GeoJSON Export**: Export recorded flight breadcrumbs as a standard RFC 7946 GeoJSON LineString file for external GIS analysis (QGIS, ArcGIS, Google Earth).
- **Mandatory Aviation Disclaimer**:
  > *"Locally collected observations reflect the current monitoring session only and do not represent a complete historical flight record from origin to destination."*

### 🛡️ API Reliability & Serverless Proxy
- **Vercel Serverless Function** (`api/opensky.ts`): Resolves browser CORS restrictions, validates WGS84 bounds, injects credentials securely server-side, and enforces an 8-second timeout.
- **Rate Limit Compliance**: Adheres to OpenSky's anonymous policy (1 request / 10s). Detects HTTP 429 responses, parses `Retry-After`, and activates an automatic backoff countdown timer.
- **Stale Data Preservation**: If an API refresh fails (network error, rate limit, or server downtime), the dashboard preserves the last verified snapshot, displays a prominent amber **STALE SNAPSHOT** banner, and provides manual **Retry** and **Demo Mode** fallback buttons.
- **Demo Fixtures**: High-fidelity recorded flight vectors with realistic kinematics allow complete offline evaluation and demonstration without relying on active network access. Clearly labeled as `DEMO SIMULATION`.

---

## 4. Map Tile Providers & Attribution

Per geospatial provider policies, proper attribution is prominently integrated into the Leaflet control layer:

1. **CartoDB Dark Matter (Default)**:
   - Tile URL: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
   - Attribution: `© OpenStreetMap contributors © CARTO`
2. **OpenStreetMap Standard**:
   - Tile URL: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
   - Attribution: `© OpenStreetMap contributors`
3. **CartoDB Positron**:
   - Tile URL: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`
   - Attribution: `© OpenStreetMap contributors © CARTO`

---

## 5. Environment Configuration

To configure optional authenticated access to OpenSky Network (5s refresh rate and higher daily limits):

1. Copy the template:
   ```bash
   cp .env.example .env
   ```
2. Set your credentials:
   ```env
   # Basic Auth (Classic)
   OPENSKY_USERNAME=your_username
   OPENSKY_PASSWORD=your_password

   # Or OAuth2 Client Credentials
   OPENSKY_CLIENT_ID=your_client_id
   OPENSKY_CLIENT_SECRET=your_client_secret
   ```
> **Security Notice**: Credentials are injected solely server-side via the Vite proxy configuration (`vite.config.ts`) and Vercel serverless function (`api/opensky.ts`). They are **never** exposed in frontend client bundles.

---

## 6. Installation & Execution

### Prerequisites
- Node.js `v18.0.0` or later (tested on Node `v24.16.0`)
- npm `v9.0.0` or later

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```
The application will launch at: **`http://localhost:5173`**

### Run Production Build & Type Check
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```
The preview server will launch at: **`http://localhost:4173`**

### Run Automated Tests
```bash
npm run test
```

---

## 7. Vercel Deployment

The application is pre-configured for one-click deployment to **Vercel**:

1. **Deploy via GitHub**:
   - Push this repository to GitHub (`SarveshS1407/Airtrafficcontrol-CC`).
   - Import the repository in the [Vercel Dashboard](https://vercel.com/new).
   - Vercel automatically detects Vite with:
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Framework Preset**: `Vite`
2. **Optional Environment Variables**:
   - In Vercel Project Settings > Environment Variables, add:
     - `OPENSKY_USERNAME`: (Optional OpenSky account username)
     - `OPENSKY_PASSWORD`: (Optional OpenSky account password)
3. **Vercel Serverless Architecture**:
   - `vercel.json` routes `/api/opensky` and `/api/opensky/states/all` directly to `api/opensky.ts`.
   - Security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, and `Referrer-Policy: strict-origin-when-cross-origin`) are applied automatically to all responses.

---

## 8. Automated Test Suite

**37 automated tests across 5 test suites** verify all functional criteria:

```
✓ src/test/geoUtils.test.ts (13 tests)
  - validateBoundingBox (valid bounds, inverted latitudes, inverted longitudes, out of range, max area)
  - isWithinBounds coordinate containment
  - Unit conversions (meters to feet, mps to knots, mps to fpm, heading to cardinal)
  - Great-circle Haversine distance calculation
  - Aviation coordinate formatting

✓ src/test/openskyApi.test.ts (8 tests)
  - State vector parser with full telemetry
  - Trimming whitespace in callsigns and uppercase fallback
  - Graceful handling of null/missing fields (alt, speed, heading, squawk)
  - Stale observation identification
  - Network failure handling & HTTP 429 rate-limit backoff error

✓ src/test/filter.test.ts (8 tests)
  - Callsign, ICAO hex, and Country search filtering
  - Airborne vs. On-Ground state filtering
  - Climbing, Level, and Descending vertical state filtering
  - Altitude ceiling and speed range filtering
  - Emergency squawk codes filtering (7700, 7600, 7500)
  - Ascending and descending sorting

✓ src/test/useAtcStore.test.ts (3 tests)
  - Aircraft identity preservation (firstSeenAt & observation count accumulation)
  - Local movement history accumulation and buffer management
  - Stale data preservation upon network failure
  - Rate-limit backoff enforcement

✓ src/test/components.test.tsx (5 tests)
  - MetricsBanner rendering breakdown
  - MovementHistoryLog rendering mandatory session disclaimer
  - StaleDataAlert rendering and retry/demo actions
  - StatusBadge live/demo toggling
  - FilterPanel user interactions
```

---

## 9. Tactical Keyboard Shortcuts

| Key | Action | Description |
| :--- | :--- | :--- |
| <kbd>?</kbd> | Help & Diagnostics | Opens ATC Operations Guide, Squawk Code legend, and system metrics |
| <kbd>Space</kbd> | Pause / Resume | Toggles automatic radar telemetry polling cycle |
| <kbd>R</kbd> | Manual Sweep | Forces an immediate radar snapshot refresh |
| <kbd>Esc</kbd> | Deselect Target | Closes telemetry HUD drawer and clears map crosshairs |

---

## 10. Known Aviation Limitations

- **OpenSky Anonymous Rate Limits**: Unauthenticated OpenSky requests are throttled to 1 request every 10 seconds. Exceeding this rate will trigger an HTTP 429 response. The application automatically detects this and enforces backoff, but users requiring 5s resolution should supply OpenSky account credentials in `.env` or Vercel environment variables.
- **Local Movement History Scope**: In accordance with the project objective, movement history is recorded in-memory for the duration of the browser session. It accumulates breadcrumbs while the dashboard is running and does not constitute a full flight route from origin airport to destination.
- **Transponder Coverage**: Aircraft without active ADS-B transponder position broadcast (e.g. military, gliders, or terrain masking) will appear with null coordinates and are excluded from the map view by default (`onlyWithPosition: true`).
