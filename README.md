# Airtrafficcontrol-CC — Real-Time Aircraft Monitoring Dashboard

A high-performance, real-time aviation monitoring dashboard engineered with **React 18, Vite, TypeScript, Leaflet, and Zustand**, consuming live ADS-B state vectors from the **OpenSky Network REST API**.

Designed specifically as an operations center terminal rather than a generic admin dashboard, featuring a restrained dark slate/navy palette, telemetry monospace readouts, smooth vector markers rotated to true heading, local movement history tracking, and intelligent rate-limiting resilience.

---

## 1. Architectural Highlights

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ATC OPERATIONS INTERFACE                        │
├────────────────────┬───────────────────────────────────┬───────────────┤
│    LEFT SIDEBAR    │            CENTER MAP             │  RIGHT PANEL  │
│  - Metrics Banner  │  - Leaflet Map (CartoDB / OSM)    │  - Flight HUD │
│  - Sector Selector │  - Dynamic SVG Aircraft Markers   │  - Telemetry  │
│  - Telemetry Filter│  - Sector Bounds Rectangle        │  - Profile    │
│  - Flight List     │  - Selected Breadcrumbs Trail     │  - Waypoints  │
└────────────────────┴───────────────────────────────────┴───────────────┘
                                   │
                       Zustand State Store (O(1))
       ┌───────────────────────────┴───────────────────────────┐
       ▼                                                       ▼
Live OpenSky Client                                 Demo Vector Simulator
- /api/opensky/states/all                           - Recorded London TMA fixture
- Bounding Box Filtering                            - Real-time kinematic motion
- HTTP 429 Rate-Limit Backoff                       - Zero-network offline testing
- Stale Data Snapshot Cache                         - Explicit DEMO Labeling
```

### Core Architecture Principles:
- **Decoupled State Management**: Built on `Zustand` with an `icao24`-keyed hash map for $O(1)$ aircraft lookups, preventing marker recreation, DOM thrashing, and unnecessary component re-renders.
- **Identity Preservation**: Tracks aircraft persistently across polling cycles. Retains `firstSeenAt` timestamps, increments observation counts, and accumulates movement breadcrumbs.
- **Controlled Polling Lifecycle**: Configurable intervals (default 10s compliant with OpenSky anonymous policy). Active `AbortController` cancellation prevents duplicate/overlapping network cycles.
- **Defensive API Resilience**: Robust parser that handles `null`, `undefined`, or out-of-range fields without crashing. Gracefully handles HTTP 429 rate limits with exponential backoff and keeps previous snapshots marked with a prominent **STALE DATA** badge.

---

## 2. Technical Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | React 18 + Vite | Fast HMR, optimized production tree-shaking |
| **Language** | TypeScript (Strict Mode) | Full type safety across state vectors, filters, and telemetry models |
| **Mapping Engine** | Leaflet 1.9.4 | Native geospatial projection, smooth SVG marker rotation, minimal overhead |
| **State Store** | Zustand 4.5.5 | Lightweight reactive store outside React lifecycle, zero selector boilerplate |
| **Styling** | Tailwind CSS 3.4 | Custom tactical navy theme (`#060b13`, `#0b1324`, `#06b6d4`, `#10b981`) |
| **Icons** | Lucide React | High-clarity aviation symbols (compass, radio, crosshair, layers) |
| **Test Suite** | Vitest + Testing Library | Blazing-fast unit and component test runner with jsdom |

---

## 3. Features & Requirements Coverage

### 🛰️ Live Aircraft Monitoring
- Fetches live ADS-B and MLAT state vectors from OpenSky Network REST API (`GET /api/states/all`).
- Renders custom SVG aircraft markers rotated precisely to true track heading (`0°–360°`).
- Color-coded telemetry:
  - **Bright Cyan Halo**: Selected target
  - **Emerald Green**: Low altitude / Terminal approach (< 10,000 ft)
  - **Sky Blue**: Mid-level transit (10,000–25,000 ft)
  - **Indigo Violet**: High cruising (> 25,000 ft)
  - **Amber**: On-ground (taxiway / parking gate)
  - **Slate Grey**: Stale radar contact
- Complete telemetry inspection: Callsign, ICAO24 hex, origin country, barometric altitude (ft/m), geometric altitude, ground speed (kts/kmh), true track, vertical rate (+/- fpm), squawk code, SPI flag, position source, and last reported timestamps.

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
- **Flight State Pills**: `ALL`, `AIRBORNE ONLY`, `ON GROUND ONLY`.
- **Vertical Trend Pills**: `ALL`, `CLIMBING` (+), `LEVEL` (=), `DESCENDING` (-).
- **Altitude Ceiling Slider**: 0 ft to 55,000+ ft.
- **Speed Range Slider**: 0 kts to 700+ kts.
- Instant filtered count indicator and one-click filter reset.

### 📈 Movement History & Breadcrumbs
- Locally records timestamped observations `(lat, lon, altitude, velocity, heading, verticalRate, timestamp)` in a circular buffer up to 100 waypoints per aircraft.
- Draws an interactive dashed flight path trail on the map for the selected aircraft.
- Displays an SVG **Altitude & Velocity Profile Chart** illustrating flight trajectory over time.
- **Mandatory Aviation Disclaimer**:
  > *"Locally collected observations reflect the current monitoring session only and do not represent a complete historical flight record from origin to destination."*

### 🛡️ API Reliability & CORS Proxy
- **Vite Proxy**: Built-in development and preview proxy forwards `/api/opensky/*` to `https://opensky-network.org/api/*`, resolving browser CORS restrictions.
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
> **Security Notice**: Credentials are injected solely server-side via the Vite proxy configuration (`vite.config.ts`) and are never exposed in frontend client bundles.

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

## 7. Automated Test Suite

36 automated tests across 5 test suites verify all functional criteria:

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

✓ src/test/filter.test.ts (7 tests)
  - Callsign, ICAO hex, and Country search filtering
  - Airborne vs. On-Ground state filtering
  - Climbing, Level, and Descending vertical state filtering
  - Altitude ceiling and speed range filtering
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

## 8. Tactical Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Toggle auto-refresh pause / resume |
| <kbd>R</kbd> | Trigger manual radar sweep |
| <kbd>Esc</kbd> | Deselect active aircraft / close telemetry HUD |

---

## 9. Known Limitations

- **OpenSky Anonymous Rate Limits**: Unauthenticated OpenSky requests are throttled to 1 request every 10 seconds. Exceeding this rate will trigger an HTTP 429 response. The application automatically detects this and enforces backoff, but users requiring 5s resolution should supply OpenSky account credentials in `.env`.
- **Local Movement History Scope**: In accordance with the project objective, movement history is recorded in-memory for the duration of the browser session. It accumulates breadcrumbs while the dashboard is running and does not constitute a full flight route from origin airport to destination.
- **Transponder Coverage**: Aircraft without active ADS-B transponder position broadcast (e.g. military, gliders, or terrain masking) will appear with null coordinates and are excluded from the map view by default (`onlyWithPosition: true`).
>>>>>>> c5a6d1a (feat: complete Air Traffic Control real-time dashboard implementation)
