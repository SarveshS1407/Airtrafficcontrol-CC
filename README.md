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
│  - Targets (List)  │  - OpenStreetMap (Tactical Night) │  - Flight HUD │
│  - Filters (HUD)   │  - Dynamic SVG Aircraft Markers   │  - Telemetry  │
│  - Sector Selector │  - Tactical Range Rings (NM)      │  - Profile    │
│  - Metrics Banner  │  - Selected Breadcrumbs Trail     │  - Waypoints  │
│  - Emergency Squawk│  - Sector Bounds Rectangle        │  - GeoJSON    │
└────────────────────┴───────────────────────────────────┴───────────────┘
                                   │
                       Zustand State Store (O(1))
       ┌───────────────────────────┴───────────────────────────┐
       ▼                                                       ▼
Live OpenSky Client                                 Demo Vector Simulator
- /api/opensky (Vercel Serverless / Vite Proxy)     - Recorded London TMA fixture
- WGS84 Bounding Box Validation                     - Real-time kinematic motion
- OAuth2 Client Credentials Support                 - Zero-network offline testing
- HTTP 429 Rate-Limit Backoff                       - Explicit DEMO Labeling
- Stale Data Snapshot Cache                         - Full offline compliance
- Edge CDN Caching (s-maxage=5)
```

### Core Architecture Principles:
- **Decoupled State Management**: Built on `Zustand` with an `icao24`-keyed hash map for $O(1)$ aircraft lookups, preventing marker recreation, DOM thrashing, and unnecessary component re-renders.
- **Identity Preservation**: Tracks aircraft persistently across polling cycles. Retains `firstSeenAt` timestamps, increments observation counts, and accumulates movement breadcrumbs.
- **Controlled Polling Lifecycle**: Configurable intervals (default 10s compliant with OpenSky anonymous policy). Active `AbortController` cancellation prevents duplicate/overlapping network cycles.
- **Defensive API Resilience**: Robust parser that handles `null`, `undefined`, or out-of-range fields without crashing. Gracefully handles HTTP 429 rate limits with exponential backoff and keeps previous snapshots marked with a prominent **STALE SNAPSHOT** badge.
- **Serverless Production Proxy with OAuth2**: Deploys on Vercel with an edge-ready serverless function at `/api/opensky` (`api/opensky.ts`). Supports OpenSky's modern OAuth2 Client Credentials flow, enforces geographic bounding box constraints (< 35 deg²), and caches responses at the CDN edge (`s-maxage=5, stale-while-revalidate=10`) to protect upstream OpenSky rate limits.
- **First-Class Mobile Experience**: Features a dedicated mobile navigation bar (Radar, Targets, Filters, Telemetry) and touch-friendly slide-up bottom sheets that adapt seamlessly across phone and tablet screens (320px–1024px).

---

## 2. Technical Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | React 18 + Vite | Blazing fast HMR, optimized production tree-shaking |
| **Language** | TypeScript (Strict Mode) | Full type safety across state vectors, filters, and telemetry models |
| **Mapping Engine** | Leaflet 1.9.4 | Native geospatial projection, smooth SVG marker rotation, minimal overhead |
| **Tile Provider** | OpenStreetMap (Standard & Tactical) | 100% free, compliant, zero-watermark geospatial basemap |
| **State Store** | Zustand 4.5.5 | Lightweight reactive store outside React lifecycle, zero selector boilerplate |
| **Styling** | Tailwind CSS 3.4 | Custom tactical navy theme (`#060b13`, `#0b1324`, `#06b6d4`, `#10b981`) |
| **Icons** | Lucide React | High-clarity aviation symbols (compass, radio, crosshair, layers) |
| **Backend / Proxy** | Vercel Serverless (`api/opensky.ts`) | Server-side CORS resolution, OAuth2 token management, and edge caching |
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
- **Tactical Range Rings**: Concentric nautical-mile rings (`10 NM`, `25 NM`, `50 NM`) centered on the active sector.
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
- Locally records timestamped observations in a circular buffer up to 100 waypoints per aircraft.
- Draws an interactive dashed flight path trail on the map for the selected aircraft.
- Displays an SVG **Altitude & Velocity Profile Chart** illustrating flight trajectory over time.
- **One-Click GeoJSON Export**: Export recorded flight breadcrumbs as an RFC 7946 GeoJSON LineString file.
- **Mandatory Aviation Disclaimer**:
  > *"Locally collected observations reflect the current monitoring session only and do not represent a complete historical flight record from origin to destination."*

### 📱 First-Class Mobile Experience
- Dedicated tactical bottom navigation bar:
  - 🗺️ **Radar**: Full-screen interactive map.
  - ✈️ **Targets**: Slide-up bottom sheet with searchable target list and metrics.
  - 🎛️ **Filters**: Slide-up bottom sheet for telemetry sliders and geographic sectors.
  - 📡 **Telemetry**: Comprehensive flight inspector with altitude, speed, Mach, heading dial, and trail export.
- Optimized for touch targets (≥ 44px) across 320px, 375px, 390px, 430px, 768px, and 1024px.

---

## 4. Map Tile Providers & Attribution

All basemaps utilize legitimate, official **OpenStreetMap** tile endpoints without watermarks or third-party API key requirements:

1. **OpenStreetMap Tactical Radar Night (Default)**:
   - Tile URL: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
   - High-contrast tactical radar styling via CSS `.atc-dark-tiles`.
   - Attribution: `© OpenStreetMap contributors`
2. **OpenStreetMap Daylight Chart**:
   - Tile URL: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
   - Natural daylight cartographic chart.
   - Attribution: `© OpenStreetMap contributors`
3. **OpenStreetMap Humanitarian**:
   - Tile URL: `https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png`
   - High-contrast transit styling.
   - Attribution: `© OpenStreetMap contributors, style by HOT`

---

## 5. OpenSky Network Authentication (OAuth2)

OpenSky Network exclusively uses **OAuth2 Client Credentials** for authenticated REST requests. Legacy Basic Authentication (username/password) has been deprecated.

### Cloud Deployment Notice
OpenSky Network restricts unauthenticated queries originating from public cloud datacenter IP addresses (AWS, Vercel, Google Cloud) due to anti-scraping policies.

To enable live data on cloud deployments:
1. Create an API client in your [OpenSky Account](https://opensky-network.org/) under **Account > API Clients**.
2. Configure the following environment variables (locally in `.env` or in your Vercel Dashboard):
   ```env
   OPENSKY_CLIENT_ID=your_client_id_here
   OPENSKY_CLIENT_SECRET=your_client_secret_here
   ```
3. The serverless proxy (`api/opensky.ts`) will automatically exchange these credentials for a Bearer token at OpenSky's token endpoint (`https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token`), cache the token in-memory, and attach it to upstream requests.
4. When running locally via `npm run dev` on a non-cloud residential/developer network, anonymous access succeeds directly without credentials.

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
   - Vercel automatically detects Vite:
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Framework Preset**: `Vite`
2. **Environment Variables**:
   - In Vercel Project Settings > Environment Variables:
     - `OPENSKY_CLIENT_ID`: (Your OpenSky OAuth2 client ID)
     - `OPENSKY_CLIENT_SECRET`: (Your OpenSky OAuth2 client secret)
3. **Vercel Serverless Architecture**:
   - `vercel.json` routes `/api/opensky` and `/api/opensky/states/all` directly to `api/opensky.ts` with `maxDuration: 15`.
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

## 10. Operational Runbook & Known Limitations

- **OpenSky Cloud IP Restrictions**: Unauthenticated OpenSky requests from public cloud datacenters (Vercel, AWS, GCP) are blocked or queued by OpenSky anti-abuse firewalls. The application automatically detects this and provides an instant one-click **"Explore with Demo Fixtures"** option. For live cloud data, configure `OPENSKY_CLIENT_ID` and `OPENSKY_CLIENT_SECRET`.
- **Local Development**: When running locally (`npm run dev`), queries to `/api/opensky` originate from your local IP address and connect directly to live OpenSky radar without cloud IP restrictions.
- **Local Movement History Scope**: Movement history is recorded in-memory for the duration of the browser session and does not constitute a full flight route from origin airport to destination.
- **Transponder Coverage**: Aircraft without active ADS-B transponder position broadcast appear with null coordinates and are excluded from the map view by default (`onlyWithPosition: true`).
