import React, { useState } from 'react';
import {
  Plane,
  Radar,
  Globe2,
  Activity,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Clock,
  Layers,
  Search,
  AlertTriangle,
  Menu,
  X,
  UserCheck,
  Compass,
} from 'lucide-react';
import { Link, useRouter } from '../router/Router';
import { useAuthStore } from '../store/useAuthStore';

export const LandingPage: React.FC = () => {
  const { navigate } = useRouter();
  const { currentUser, isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const previewFlights = [
    { callsign: 'BAW178', route: 'LHR → JFK', alt: 'FL370', spd: '466 kts', status: 'CRUISE', x: '28%', y: '34%' },
    { callsign: 'AFR008', route: 'CDG → LAX', alt: 'FL360', spd: '476 kts', status: 'CLIMB', x: '42%', y: '40%' },
    { callsign: 'ANA006', route: 'HND → LAX', alt: 'FL380', spd: '495 kts', status: 'CRUISE', x: '78%', y: '46%' },
    { callsign: 'UAE201', route: 'DXB → JFK', alt: 'FL390', spd: '480 kts', status: 'CRUISE', x: '58%', y: '48%' },
    { callsign: 'EMERG77', route: 'LGW → AMS', alt: 'FL080', spd: '280 kts', status: 'SQUAWK 7700', x: '48%', y: '32%', isEmerg: true },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Header / Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Radar className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-black tracking-tight text-white text-base">AIRTRAFFICCONTROL</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-400 font-bold">
                  CC
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">
                Global Flight Surveillance
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition">Features</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition">How It Works</a>
            <a href="#coverage" className="hover:text-cyan-400 transition">Data Coverage</a>
            <a href="#about" className="hover:text-cyan-400 transition">About</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-slate-200">{currentUser.callsign}</span>
                </div>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm shadow-md shadow-cyan-500/25 transition"
                >
                  <Plane className="w-4 h-4" />
                  Launch Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/signin"
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm shadow-md shadow-cyan-500/25 transition"
                >
                  <span>Explore Live Traffic</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-3">
            <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-300">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-md hover:bg-slate-900"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-md hover:bg-slate-900"
              >
                How It Works
              </a>
              <a
                href="#coverage"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-md hover:bg-slate-900"
              >
                Data Coverage
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-md hover:bg-slate-900"
              >
                About
              </a>
            </nav>
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-slate-300 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-sm shadow-md"
              >
                <Plane className="w-4 h-4" />
                Launch Dashboard
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Radar concentric background aesthetic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-cyan-500/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-cyan-500/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-cyan-500/15 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Sector status tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono mb-8 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-bold">RADAR ACTIVE</span>
              <span className="text-slate-500">•</span>
              <span>OpenSky Network REST API & ADS-B Telemetry</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              See the Skies.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
                Understand the Movement.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Explore global aircraft activity through an interactive map, location-aware discovery, and real-time flight data where available.
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-base shadow-lg shadow-cyan-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Plane className="w-5 h-5 text-slate-950" />
                <span>Explore Live Traffic</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-base transition"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Discover the Platform</span>
              </a>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                No Account Required
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                Google Maps + OpenStreetMap
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-400" />
                Location-Aware Discovery
              </span>
            </div>
          </div>

          {/* Operational Preview Widget */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="relative rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden p-1">
              {/* Radar preview HUD header */}
              <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-slate-400 font-bold flex items-center gap-1.5">
                    <Radar className="w-3.5 h-3.5 text-cyan-400" />
                    RADAR CONSOLE PREVIEW — SECTOR GLOBAL-01
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                  <span>RANGE: <strong className="text-cyan-300">GLOBAL</strong></span>
                  <span>FEED: <strong className="text-emerald-400">ADS-B LIVE</strong></span>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="text-cyan-400 hover:text-cyan-300 underline font-semibold flex items-center gap-1"
                  >
                    Open Console <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Simulated Global Radar Viewport */}
              <div className="relative h-72 sm:h-96 bg-atc-950 overflow-hidden flex items-center justify-center">
                {/* World Map Background Grid lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:40px_40px] opacity-70" />

                {/* Radar Sweep Animation Effect */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[500px] h-[500px] rounded-full border border-cyan-500/20 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-cyan-500/20" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full border border-cyan-500/20" />
                  </div>
                </div>

                {/* Flight vector preview points */}
                {previewFlights.map((flt) => (
                  <div
                    key={flt.callsign}
                    className="absolute cursor-pointer transition-transform hover:scale-110"
                    style={{ left: flt.x, top: flt.y }}
                    onClick={() => navigate('/dashboard')}
                  >
                    <div className="relative flex items-center gap-2 group">
                      <div
                        className={`w-3 h-3 rounded-full flex items-center justify-center shadow-lg ${
                          flt.isEmerg
                            ? 'bg-rose-500 shadow-rose-500/50 animate-ping'
                            : 'bg-cyan-400 shadow-cyan-400/50'
                        }`}
                      >
                        <Plane className="w-2.5 h-2.5 text-slate-950 rotate-45" />
                      </div>

                      <div
                        className={`px-2 py-1 rounded bg-slate-950/90 border font-mono text-[10px] shadow-lg backdrop-blur-sm whitespace-nowrap ${
                          flt.isEmerg
                            ? 'border-rose-500 text-rose-300'
                            : 'border-cyan-500/40 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className={flt.isEmerg ? 'text-rose-400' : 'text-cyan-400'}>
                            {flt.callsign}
                          </span>
                          <span className="text-slate-400 font-normal">{flt.route}</span>
                        </div>
                        <div className="text-[9px] text-slate-400 flex items-center gap-2">
                          <span>{flt.alt}</span>
                          <span>{flt.spd}</span>
                          <span className={flt.isEmerg ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                            {flt.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Quick overlay CTA */}
                <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-4 font-mono text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">OPERATIONAL DASHBOARD</span>
                    <span className="text-white font-bold">Ready to track live flights?</span>
                  </div>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
                  >
                    Launch Radar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-20 bg-slate-900/50 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold block mb-2">
              ENGINEERED FOR SITUATIONAL AWARENESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Comprehensive Flight Telemetry & Geospatial Tools
            </h2>
            <p className="mt-4 text-slate-300 text-base">
              Every feature designed to provide immediate situational clarity, strict data honesty,
              and professional-grade air traffic surveillance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Dual Map Engines */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition">
              <div className="w-12 h-12 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center mb-5 text-cyan-400">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Google Maps Platform + OSM</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Seamless dual-engine architecture. Switch effortlessly between official Google Maps
                (with dark tactical roadmap, satellite, hybrid, terrain) and OpenStreetMap with zero friction.
              </p>
            </div>

            {/* Feature 2: Location-Aware Discovery */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition">
              <div className="w-12 h-12 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center mb-5 text-cyan-400">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Location-Aware Discovery</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Search airports (LHR, JFK, DXB, HND), cities, or sectors with instant geocoded autocomplete.
                Click anywhere on the map to anchor a focused 25km to 250km surveillance perimeter.
              </p>
            </div>

            {/* Feature 3: Flight Telemetry & Selection */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition">
              <div className="w-12 h-12 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center mb-5 text-cyan-400">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Detailed Telemetry Inspector</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Inspect callsign, ICAO24 hex, calibrated barometric altitude, ground speed, true heading,
                vertical climb rate, and transponder squawk codes with zero missing data crashes.
              </p>
            </div>

            {/* Feature 4: Live Refresh & Data Freshness */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition">
              <div className="w-12 h-12 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center mb-5 text-cyan-400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Live Refresh & Freshness Tracking</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Controlled polling intervals (5s, 10s, 15s, 30s) respecting API policies. Features
                clear stale-data indicators and backoff handling upon rate limits.
              </p>
            </div>

            {/* Feature 5: Flight Trajectory History */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition">
              <div className="w-12 h-12 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center mb-5 text-cyan-400">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Breadcrumb Flight Trails</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Preserves observation identity and draws historical breadcrumb paths color-coded
                by altitude gradients, complete with speed and climb trend visualizations.
              </p>
            </div>

            {/* Feature 6: Emergency Transponder Squawks */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition">
              <div className="w-12 h-12 rounded-lg bg-rose-950/80 border border-rose-500/40 flex items-center justify-center mb-5 text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Emergency Squawk Filter</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Instant one-click filtering for general emergency (7700), radio failure (7600),
                and unlawful interference (7500) transponder broadcasts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="py-20 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold block mb-2">
              WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Operational in Three Steps
            </h2>
            <p className="mt-4 text-slate-300 text-base">
              Zero complicated configurations. Begin monitoring aircraft movements across the planet in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative">
              <div className="text-5xl font-mono font-black text-slate-800 absolute top-6 right-6">
                01
              </div>
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Open Global Traffic View</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Launch the monitoring dashboard. The radar initializes on an unrestricted global overview,
                letting you pan, zoom, or pick pre-configured continental and terminal sectors.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative">
              <div className="text-5xl font-mono font-black text-slate-800 absolute top-6 right-6">
                02
              </div>
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Filter & Refine Targets</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Filter by callsign, airline prefix, altitude ceiling, minimum airspeed, ground vs airborne state,
                or active emergency squawk codes to isolate points of interest.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative">
              <div className="text-5xl font-mono font-black text-slate-800 absolute top-6 right-6">
                03
              </div>
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
                <Plane className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Inspect Live Telemetry</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Select any aircraft marker on the map or in the synchronized flight list to reveal
                its live flight dynamics, vertical speed, historical trail, and sensor coordinates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust and Transparency Section */}
      <section id="coverage" className="py-16 bg-slate-900/60 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-8 sm:p-10 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Trust, Data Transparency & API Policy</h3>
                <p className="text-xs font-mono text-slate-400">Adhering to OpenSky Network & ADS-B Standards</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                <strong>AirTrafficControl-CC</strong> retrieves live aircraft state vectors via the documented{' '}
                <a
                  href="https://opensky-network.org/apidoc/rest.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline font-mono"
                >
                  OpenSky Network REST API
                </a>
                .
              </p>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Zero Fake Data:</strong> Live telemetry is never fabricated or simulated behind your back. If the feed is delayed or interrupted, a clear stale badge is displayed.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong>Public Cloud IP Policies:</strong> OpenSky Network officially restricts unauthenticated queries from public cloud hyperscalers (AWS/Vercel). When cloud egress is restricted, our serverless proxy catches the 504/timeout and provides an explicit one-click fallback to a high-fidelity simulated radar feed, clearly marked as <em>SIMULATED</em>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span><strong>OAuth2 Client Credentials:</strong> Registered OpenSky users can configure their client credentials in Vercel environment variables to query with authorized live quotas.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 font-mono">
                Cartography supported: Official Google Maps Platform &amp; OpenStreetMap contributors. No watermarked commercial tiles.
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
              >
                Launch Surveillance Console
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer id="about" className="mt-auto border-t border-slate-800 bg-slate-950 py-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Radar className="w-5 h-5 text-cyan-400" />
                <span className="font-mono font-bold text-white text-sm">AIRTRAFFICCONTROL-CC</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                CodeChef-VIT Promotional Cycle 2026–27 Frontend Development Task. Real-time geospatial
                aviation monitoring system.
              </p>
            </div>

            <div>
              <h4 className="font-mono text-white uppercase font-bold mb-3 tracking-wider text-[11px]">
                Navigation
              </h4>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-cyan-400 transition">Landing Page</Link></li>
                <li><Link to="/dashboard" className="hover:text-cyan-400 transition">Live Radar Dashboard</Link></li>
                <li><Link to="/signin" className="hover:text-cyan-400 transition">Controller Sign In</Link></li>
                <li><Link to="/signup" className="hover:text-cyan-400 transition">Register Account</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-white uppercase font-bold mb-3 tracking-wider text-[11px]">
                Aviation Providers
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://opensky-network.org" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition flex items-center gap-1">
                    OpenSky Network <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition flex items-center gap-1">
                    OpenStreetMap <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition flex items-center gap-1">
                    Leaflet JS <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-white uppercase font-bold mb-3 tracking-wider text-[11px]">
                Repository & Build
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com/SarveshS1407/Airtrafficcontrol-CC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400 transition flex items-center gap-1 font-mono"
                  >
                    GitHub Repository <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li className="font-mono text-[11px] text-slate-500">Stack: React + Vite + TypeScript</li>
                <li className="font-mono text-[11px] text-slate-500">State: Zustand Store</li>
                <li className="font-mono text-[11px] text-slate-500">Styling: Tailwind CSS</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
            <div>
              &copy; {new Date().getFullYear()} AirTrafficControl-CC. Built for CodeChef-VIT.
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-500">STATUS: ALL SYSTEMS NOMINAL</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
