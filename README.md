# Airtrafficcontrol-CC — Global Air Traffic Monitoring System

A mission-critical aviation surveillance and flight-monitoring web application engineered with **React 18, Vite, TypeScript, Leaflet, and Zustand**, consuming live ADS-B state vectors from the **OpenSky Network REST API**.

**Production Deployment:** [https://airtrafficcontrol-cc.vercel.app/](https://airtrafficcontrol-cc.vercel.app/)  
**GitHub Repository:** [https://github.com/SarveshS1407/Airtrafficcontrol-CC](https://github.com/SarveshS1407/Airtrafficcontrol-CC)  
**Test Suite Status:** **46 / 46 Passing** (6 Suites)  
**Production Build:** **100% Clean Bundle, Strict TypeScript**

---

## 1. Application Architecture

```
                                  AIRTRAFFICCONTROL-CC
                                           │
         ┌─────────────────────────────────┴─────────────────────────────────┐
         ▼                                                                   ▼
PUBLIC LANDING PAGE (/)                                         MONITORING DASHBOARD (/dashboard)
- Brand Wordmark & Animated Radar                               - Genuinely Global Initial Viewport
- Hero: "Global Air Traffic. One Clear View."                   - Multi-Sector Switcher (Continents & TMAs)
- Interactive Live Radar Console Preview                        - Sub-views: Live Radar, Fleet Analytics, Settings
- 6 Mission-Critical Features Overview                          - Leaflet + OpenStreetMap (Zero Watermarks)
- 3-Step Operational Workflow                                   - Search, Multi-Criteria Filters, Emergency Squawk
- Trust & Data Transparency Policy                              - Real-time Telemetry Inspector & Flight Trails
- Complete Aviation Attribution & Links                         - Watchlist Pinning & Session State Preservation
         │                                                                   │
         ├─────────────────────────────────┬─────────────────────────────────┤
         ▼                                 ▼                                 ▼
   SIGN IN (/signin)              SIGN UP (/signup)             FORGOT PASSWORD (/forgot-password)
   - Controller Login             - Profile Creation            - Token Dispatch Simulator
   - Instant 1-Click Demo Login   - Callsign Assignment         - Email Verification
   - Inline Form Validation       - Terms Confirmation          - Secure Recovery Flow
```

### Core Architecture Highlights:
- **Dedicated Public Landing Page (`/`)**: Welcomes visitors with an aviation-inspired product showcase, operational radar console preview, feature breakdowns, and workflow guides before entering the monitoring environment.
- **Complete Authentication System**: Provides `/signin`, `/signup`, and `/forgot-password` routes with inline validation, password security checks, and a pre-seeded **1-click Evaluator Login** (`Commander Alex Vance / TOWER-LEAD`).
- **Open Public Dashboard (`/dashboard`)**: Anyone can monitor live flights without requiring an account. Authentication unlocks account-specific features like persistent flight watchlists and saved airspace sectors.
- **Genuinely Global Map**: Initializes with a worldwide overview (`[20° N, 0° E]`, zoom level 2). Never defaults to a hardcoded city or single country. Includes 1-click **Global Reset** and presets for all major continents (North America, Europe, Asia-Pacific, Middle East, Latin America, Africa, Oceania) alongside high-density TMAs.
- **Zustand O(1) Reactive State**: Hash-mapped by `icao24` to prevent marker flickering, DOM recreation, and excessive rerenders during continuous 10s radar sweeps.
- **Defensive API Engineering**: Isolates credentials within a Vercel serverless proxy (`api/opensky.ts`) utilizing strict IPv4 resolution, OpenSky OAuth2 token negotiation, edge CDN caching (`s-maxage=5`), and intelligent fallback to high-fidelity simulated vectors when cloud IP restrictions occur.

---

## 2. Technical Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | React 18 + Vite | Blazing fast HMR, sub-2s production tree-shaking |
| **Language** | TypeScript (Strict Mode) | 100% type safety across telemetry vectors, geo bounds, and auth |
| **Routing** | Zero-Dependency HTML5 Router | History API navigation with SPA fallbacks on Vercel |
| **Mapping Engine** | Leaflet 1.9.4 | Native geospatial projection, smooth SVG marker heading rotation |
| **Tile Provider** | OpenStreetMap (Standard & Dark) | Legitimate, official OSM tiles with zero commercial watermarks |
| **State Store** | Zustand 4.5.5 | Lightweight reactive store outside React lifecycle, persistent sessions |
| **Styling** | Tailwind CSS 3.4 | Deep tactical navy theme (`#060b13`, `#0b1324`, `#06b6d4`, `#10b981`) |
| **Icons** | Lucide React | High-clarity aviation iconography |
| **Backend / Proxy** | Vercel Serverless (`api/opensky.ts`) | Server-side CORS resolution, IPv4 enforcement, and OAuth2 tokens |
| **Test Suite** | Vitest + Testing Library | Fast unit and integration test runner with jsdom |

---

## 3. Features & Requirements Coverage

### 🛰️ Live Global Aircraft Monitoring
- Consumes real state vectors from OpenSky Network REST API (`GET /api/states/all`).
- Dynamic SVG aircraft markers rotated precisely to true track heading (`0°–360°`).
- **Color-Coded Altitude & State Halos**:
  - **Pulsing Crimson Red**: Emergency Transponder Squawks (`7700` Mayday, `7600` Radio Fail, `7500` Hijack)
  - **Bright Cyan Halo**: Selected active target
  - **Emerald Green**: Low altitude / Terminal approach (&le; 10,000 ft)
  - **Sky Blue**: Mid-level transit (10,000–25,000 ft)
  - **Indigo Violet**: High cruising (25,000–40,000 ft)
  - **Purple**: Stratospheric flight levels (FL400+)
  - **Amber**: On-ground (taxiway / parking gate)
  - **Slate Grey**: Stale radar contact
- **Tactical Range Rings**: Concentric nautical-mile rings (`10 NM`, `25 NM`, `50 NM`) centered on active sectors.
- **Hover HUD Tooltips**: Instant hover readout showing Callsign, Country, Altitude, Speed, and Heading without deselecting active targets.
- **Telemetry Inspector**: Callsign, ICAO24 hex, origin country, barometric altitude, Flight Level (`FLxxx`), geometric altitude, ground speed, true track with compass dial, vertical rate (+/- fpm), squawk code, SPI flag, position source, and last reported timestamps.

### 🗺️ Genuinely Global Airspace & Continental Sectors
- **Default Sector**: **Global View (Worldwide)** (`bounds: [-85°, -180°, 85°, 180°]`, center `[20°, 0°]`, zoom `2`).
- **Continental Presets**:
  - 🌎 North America (US & Canada)
  - 🌍 Europe (ECAC Airspace)
  - 🌏 Asia-Pacific
  - 🏜️ Middle East & Gulf
  - 🌎 Latin America & Caribbean
  - 🌍 Africa (Pan-African)
  - 🌏 Oceania & Pacific
- **High-Density TMAs**: London TMA, New York TRACON, Frankfurt TMA, Tokyo Metro, Singapore Changi, Switzerland Alps.
- **Custom Bounding Box Editor**: Enter custom WGS84 coordinates with real-time validation.
- **1-Click Global Reset**: Instantly returns to the worldwide overview.

### 🎯 Multi-Criteria Filtering & Search
- Real-time search by **Callsign**, **ICAO24 transponder hex**, or **Origin Country**.
- **Emergency Squawk Toggle**: Instantly isolate flights squawking `7700`, `7600`, or `7500`.
- **Flight State Filters**: `ALL`, `AIRBORNE ONLY`, `ON GROUND ONLY`.
- **Vertical Trend Filters**: `ALL`, `CLIMBING` (+), `LEVEL` (=), `DESCENDING` (-).
- **Altitude Ceiling Slider**: 0 ft to 55,000+ ft.
- **Airspeed Slider**: 0 kts to 700+ kts.

### 📈 Movement History & Breadcrumbs
- Locally records timestamped observations in a circular buffer up to 100 waypoints per aircraft.
- Draws an interactive dashed flight path trail on the map for the selected aircraft.
- Displays an SVG **Altitude & Velocity Profile Chart** illustrating flight trajectory over time.
- **One-Click GeoJSON Export**: Export recorded flight breadcrumbs as an RFC 7946 GeoJSON LineString file.
- **Mandatory Aviation Disclaimer**:
  > *"Locally collected observations reflect the current monitoring session only and do not represent a complete historical flight record from origin to destination."*

### 📊 Fleet Analytics & Airspace Settings Views
- **Fleet Analytics View**: Real-time statistical analysis including altitude stratification, vertical rate breakdown (climbing %, level %, descending %), airspeed spectrum, and top origin country registrations.
- **Airspace Settings View**: Configurable polling intervals (5s, 10s, 15s, 30s, Manual), basemap switcher (Tactical Night, Daylight Chart, Humanitarian), visual overlay toggles, and step-by-step OpenSky OAuth2 configuration instructions.

### 📱 First-Class Mobile Experience
- Dedicated tactical bottom navigation bar:
  - 🗺️ **Radar**: Full-screen interactive map with touch zoom and pan.
  - ✈️ **Targets**: Slide-up bottom sheet with searchable target list and metrics.
  - 🎛️ **Filters**: Slide-up bottom sheet for telemetry sliders and geographic sectors.
  - 📡 **Telemetry**: Comprehensive flight inspector with altitude, speed, Mach, heading dial, and trail export.
- Optimized for touch targets (&ge; 44px) across 320px, 375px, 390px, 430px, 768px, and 1024px.

---

## 4. Map Tile Providers & Attribution

All basemaps utilize legitimate, official **OpenStreetMap** tile endpoints without watermarks or commercial API key requirements:

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

OpenSky Network exclusively uses **OAuth2 Client Credentials** for authenticated REST requests. Legacy Basic Authentication (username/password) has been deprecated by OpenSky.

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

### Run Automated Tests
```bash
npm run test
```

---

## 7. Automated Test Suite

**46 automated tests across 6 test suites** verify all functional criteria:

```
✓ src/test/landingAndAuth.test.tsx (9 tests)
  - Renders exact required landing headline and copy
  - Verifies 3 operational steps and trust disclosures
  - 1-click evaluator login via demoLogin
  - Watchlist pin/unpin toggling
  - SignInPage with demo button and validation
  - SignUpPage with password validation
  - ForgotPasswordPage with recovery dispatch
  - Global View (Worldwide) default sector verification
  - Continental sectors coverage (all 6 continents + global)

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

## 8. Tactical Keyboard Shortcuts

| Key | Action | Description |
| :--- | :--- | :--- |
| <kbd>?</kbd> | Help & Diagnostics | Opens ATC Operations Guide, Squawk Code legend, and system metrics |
| <kbd>Space</kbd> | Pause / Resume | Toggles automatic radar telemetry polling cycle |
| <kbd>R</kbd> | Manual Sweep | Forces an immediate radar snapshot refresh |
| <kbd>Esc</kbd> | Deselect Target | Closes telemetry HUD drawer and clears map crosshairs |

---

## 9. Vercel Deployment & Runbook

1. **Deploy via GitHub**:
   - Push to `origin/main` (`https://github.com/SarveshS1407/Airtrafficcontrol-CC`).
   - Connected to Vercel production deployment at [https://airtrafficcontrol-cc.vercel.app/](https://airtrafficcontrol-cc.vercel.app/).
2. **SPA Routing**:
   - `vercel.json` rewrites all client-side routes (`/`, `/dashboard`, `/signin`, `/signup`, `/forgot-password`) to `/index.html`.
3. **Serverless Proxy**:
   - Routes `/api/opensky` and `/api/opensky/states/all` to `api/opensky.ts` with 15s execution timeout.
