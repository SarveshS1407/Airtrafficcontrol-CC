import React, { useState } from 'react';
import {
  Plane,
  Compass,
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
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { Link, useRouter } from '../router/Router';
import { useAuthStore } from '../store/useAuthStore';

export const LandingPage: React.FC = () => {
  const { navigate } = useRouter();
  const { currentUser, isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const previewFlights = [
    { callsign: 'BAW178', route: 'LHR → JFK', alt: '37,000 ft', spd: '466 kt', status: 'Cruising', x: '24%', y: '32%' },
    { callsign: 'AFR008', route: 'CDG → LAX', alt: '36,000 ft', spd: '476 kt', status: 'Climbing', x: '46%', y: '42%' },
    { callsign: 'ANA006', route: 'HND → LAX', alt: '38,000 ft', spd: '495 kt', status: 'Cruising', x: '74%', y: '48%' },
    { callsign: 'UAE201', route: 'DXB → JFK', alt: '39,000 ft', spd: '480 kt', status: 'Cruising', x: '58%', y: '50%' },
    { callsign: 'DLH400', route: 'FRA → ORD', alt: '34,000 ft', spd: '450 kt', status: 'Descending', x: '35%', y: '26%' },
  ];

  return (
    <div className="min-h-screen bg-aviation-cloud text-aviation-slate flex flex-col font-sans selection:bg-aviation-sky/20 selection:text-aviation-navy">
      {/* 1. Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-aviation-border shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-aviation-navy flex items-center justify-center text-aviation-sky shadow-xs group-hover:bg-aviation-midnight transition">
              <Plane className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-aviation-navy text-base">AirTrafficControl</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-aviation-lightSky border border-blue-200 text-aviation-navy">
                  CC
                </span>
              </div>
              <p className="text-[11px] text-aviation-muted">
                Global Flight Monitoring
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-aviation-slate">
            <a href="#how-it-works" className="hover:text-aviation-navy transition">How It Works</a>
            <a href="#features" className="hover:text-aviation-navy transition">Features</a>
            <a href="#coverage" className="hover:text-aviation-navy transition">Data & Transparency</a>
            <a href="#about" className="hover:text-aviation-navy transition">About</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-aviation-cloud border border-aviation-border rounded-xl px-3 py-1.5 text-xs">
                  <UserCheck className="w-3.5 h-3.5 text-aviation-green" />
                  <span className="text-aviation-navy font-medium">{currentUser.callsign}</span>
                </div>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-aviation-navy hover:bg-aviation-midnight text-white font-medium text-sm shadow-xs transition"
                >
                  <Compass className="w-4 h-4 text-aviation-sky" />
                  Launch Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/signin"
                  className="text-sm font-medium text-aviation-slate hover:text-aviation-navy px-3 py-2 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-aviation-navy hover:bg-aviation-midnight text-white font-medium text-sm shadow-xs transition"
                >
                  <span>Explore Live Flights</span>
                  <ArrowRight className="w-4 h-4 text-aviation-sky" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-aviation-cloud border border-aviation-border text-aviation-navy hover:bg-slate-200 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-aviation-border bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <nav className="flex flex-col space-y-2 text-sm font-medium text-aviation-slate">
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-aviation-cloud"
              >
                How It Works
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-aviation-cloud"
              >
                Features
              </a>
              <a
                href="#coverage"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-aviation-cloud"
              >
                Data & Transparency
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-aviation-cloud"
              >
                About
              </a>
            </nav>
            <div className="pt-3 border-t border-aviation-border flex flex-col gap-2">
              <Link
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-aviation-navy hover:bg-aviation-cloud rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-aviation-navy text-white font-medium text-sm shadow-xs"
              >
                <Compass className="w-4 h-4 text-aviation-sky" />
                Explore Live Flights
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Sector status tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-aviation-border text-aviation-slate text-xs font-medium mb-8 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-aviation-green animate-pulse" />
              <span className="text-aviation-navy font-semibold">Live Surveillance Active</span>
              <span className="text-aviation-muted">•</span>
              <span>OpenSky Network REST API</span>
            </div>

            {/* Exact Required Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-aviation-navy leading-tight">
              Explore the World in Motion.
            </h1>

            {/* Exact Required Supporting Copy */}
            <p className="mt-6 text-lg sm:text-xl text-aviation-slate leading-relaxed max-w-2xl mx-auto">
              Discover aircraft around the globe through an interactive map. Search locations, explore nearby air traffic, and inspect available flight information in one clear view.
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-aviation-navy hover:bg-aviation-midnight text-white font-semibold text-base shadow-sm transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Plane className="w-5 h-5 text-aviation-sky" />
                <span>Explore Live Flights</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-aviation-border text-aviation-navy font-semibold text-base transition shadow-2xs"
              >
                <Compass className="w-4 h-4 text-aviation-sky" />
                <span>Learn How It Works</span>
              </a>
            </div>

            {/* Sub-hero trust bullets */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-aviation-muted font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-aviation-green" />
                No Account Required
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-aviation-sky" />
                Google Maps + OpenStreetMap
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-aviation-navy" />
                Click Any Location to Monitor
              </span>
            </div>
          </div>

          {/* Operational Preview Widget */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="relative rounded-2xl bg-white border border-aviation-border shadow-lg overflow-hidden p-1">
              {/* Preview Bar */}
              <div className="bg-aviation-cloud px-4 py-3 border-b border-aviation-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <span className="text-aviation-navy font-semibold flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-aviation-sky" />
                    Interactive Flight Explorer Preview
                  </span>
                </div>
                <div className="flex items-center gap-4 text-aviation-muted text-xs">
                  <span>Coverage: <strong className="text-aviation-navy">Global</strong></span>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="text-aviation-sky hover:text-blue-700 font-semibold flex items-center gap-1"
                  >
                    Open Live Map <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Daylight Flight Map Simulation Canvas */}
              <div className="relative h-72 sm:h-96 bg-[#EBF3FA] overflow-hidden flex items-center justify-center">
                {/* Subtle Map Grid lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />

                {/* Concentric Range Rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[520px] h-[520px] rounded-full border border-blue-300/40 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full border border-blue-300/40" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] rounded-full border border-blue-300/40" />
                  </div>
                </div>

                {/* Flight vector preview points */}
                {previewFlights.map((flt) => (
                  <div
                    key={flt.callsign}
                    className="absolute cursor-pointer transition-transform hover:scale-105"
                    style={{ left: flt.x, top: flt.y }}
                    onClick={() => navigate('/dashboard')}
                  >
                    <div className="relative flex items-center gap-2 group">
                      <div className="w-4 h-4 rounded-full bg-aviation-navy text-white flex items-center justify-center shadow-md">
                        <Plane className="w-2.5 h-2.5 transform -rotate-45" />
                      </div>

                      <div className="px-2.5 py-1.5 rounded-xl bg-white/95 border border-aviation-border text-xs shadow-md backdrop-blur-sm whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold text-aviation-navy">
                          <span>{flt.callsign}</span>
                          <span className="text-aviation-muted font-normal text-[11px]">{flt.route}</span>
                        </div>
                        <div className="text-[11px] text-aviation-muted flex items-center gap-2 mt-0.5">
                          <span>{flt.alt}</span>
                          <span>{flt.spd}</span>
                          <span className="text-aviation-green font-medium">
                            {flt.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Bottom Overlay CTA */}
                <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 bg-white/95 backdrop-blur-md border border-aviation-border rounded-xl p-3 flex items-center justify-between gap-4 text-xs shadow-md">
                  <div>
                    <span className="text-aviation-muted text-[10px] block uppercase tracking-wider font-semibold">Live Flight Radar</span>
                    <span className="text-aviation-navy font-bold">Ready to explore worldwide aircraft?</span>
                  </div>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 rounded-lg bg-aviation-navy hover:bg-aviation-midnight text-white font-medium text-xs shadow-xs transition"
                  >
                    Launch Radar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Three Simple Steps Section */}
      <section id="how-it-works" className="py-20 bg-white border-t border-aviation-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold text-aviation-sky tracking-wider block mb-2">
              Three Simple Steps
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-aviation-navy tracking-tight">
              Learn How It Works
            </h2>
            <p className="mt-4 text-aviation-slate text-base">
              Get started in seconds with an intuitive, approachable workflow designed for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-aviation-cloud/50 border border-aviation-border rounded-2xl p-8 relative hover:border-aviation-sky transition">
              <div className="text-5xl font-black text-slate-200 absolute top-6 right-6">
                01
              </div>
              <div className="w-12 h-12 rounded-xl bg-aviation-lightSky border border-blue-200 flex items-center justify-center text-aviation-navy mb-6">
                <Search className="w-6 h-6 text-aviation-sky" />
              </div>
              <h3 className="text-xl font-bold text-aviation-navy mb-3">Find a location</h3>
              <p className="text-aviation-slate text-sm leading-relaxed">
                Search for an airport, city, or landmark, or simply click anywhere on the interactive map to set an airspace monitoring center.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-aviation-cloud/50 border border-aviation-border rounded-2xl p-8 relative hover:border-aviation-sky transition">
              <div className="text-5xl font-black text-slate-200 absolute top-6 right-6">
                02
              </div>
              <div className="w-12 h-12 rounded-xl bg-aviation-lightSky border border-blue-200 flex items-center justify-center text-aviation-navy mb-6">
                <Compass className="w-6 h-6 text-aviation-sky" />
              </div>
              <h3 className="text-xl font-bold text-aviation-navy mb-3">Explore nearby flights</h3>
              <p className="text-aviation-slate text-sm leading-relaxed">
                Adjust your monitoring perimeter from 25 km to 250 km. Observe live aircraft positions and movements updated in real time.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-aviation-cloud/50 border border-aviation-border rounded-2xl p-8 relative hover:border-aviation-sky transition">
              <div className="text-5xl font-black text-slate-200 absolute top-6 right-6">
                03
              </div>
              <div className="w-12 h-12 rounded-xl bg-aviation-lightSky border border-blue-200 flex items-center justify-center text-aviation-navy mb-6">
                <Plane className="w-6 h-6 text-aviation-sky" />
              </div>
              <h3 className="text-xl font-bold text-aviation-navy mb-3">Select an aircraft</h3>
              <p className="text-aviation-slate text-sm leading-relaxed">
                Select any flight marker to inspect its callsign, altitude, speed, heading, vertical trend, and historical flight breadcrumb trail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-20 border-t border-aviation-border bg-aviation-cloud/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold text-aviation-sky tracking-wider block mb-2">
              Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-aviation-navy tracking-tight">
              Built for Clarity and Insight
            </h2>
            <p className="mt-4 text-aviation-slate text-base">
              Every detail is crafted for approachable usability, reliable geospatial accuracy, and complete data honesty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white border border-aviation-border rounded-2xl p-6 shadow-2xs hover:shadow-xs transition">
              <div className="w-12 h-12 rounded-xl bg-aviation-lightSky border border-blue-200 flex items-center justify-center mb-5 text-aviation-sky">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-aviation-navy mb-2">Google Maps + OpenStreetMap</h3>
              <p className="text-aviation-slate text-sm leading-relaxed">
                Switch seamlessly between official Google Maps (Roadmap, Satellite, Terrain, Hybrid) and OpenStreetMap tiles with zero watermarks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-aviation-border rounded-2xl p-6 shadow-2xs hover:shadow-xs transition">
              <div className="w-12 h-12 rounded-xl bg-aviation-lightSky border border-blue-200 flex items-center justify-center mb-5 text-aviation-sky">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-aviation-navy mb-2">Location-Driven Monitoring</h3>
              <p className="text-aviation-slate text-sm leading-relaxed">
                Search cities or major hubs, or click directly on the map to anchor a focused 25 to 250 km surveillance radius around any point of interest.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-aviation-border rounded-2xl p-6 shadow-2xs hover:shadow-xs transition">
              <div className="w-12 h-12 rounded-xl bg-aviation-lightSky border border-blue-200 flex items-center justify-center mb-5 text-aviation-sky">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-aviation-navy mb-2">Clear Flight Telemetry</h3>
              <p className="text-aviation-slate text-sm leading-relaxed">
                Inspect callsign, country of origin, altitude in feet and meters, airspeed in knots, climb rate, and transponder codes with graceful fallbacks.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border border-aviation-border rounded-2xl p-6 shadow-2xs hover:shadow-xs transition">
              <div className="w-12 h-12 rounded-xl bg-aviation-lightSky border border-blue-200 flex items-center justify-center mb-5 text-aviation-sky">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-aviation-navy mb-2">Freshness & Status Tracking</h3>
              <p className="text-aviation-slate text-sm leading-relaxed">
                Automatic refresh intervals with clear data freshness badges, countdown sweeps, and friendly notifications if live rates become throttled.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white border border-aviation-border rounded-2xl p-6 shadow-2xs hover:shadow-xs transition">
              <div className="w-12 h-12 rounded-xl bg-aviation-lightSky border border-blue-200 flex items-center justify-center mb-5 text-aviation-sky">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-aviation-navy mb-2">Recent Flight Breadcrumbs</h3>
              <p className="text-aviation-slate text-sm leading-relaxed">
                Visual flight trails track historical aircraft observations color-coded by altitude to illustrate flight trajectories and approach patterns.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white border border-aviation-border rounded-2xl p-6 shadow-2xs hover:shadow-xs transition">
              <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center mb-5 text-aviation-red">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-aviation-navy mb-2">Emergency Squawk Filter</h3>
              <p className="text-aviation-slate text-sm leading-relaxed">
                Filter for emergency squawk codes (7700 general emergency, 7600 radio loss, 7500 hijacking) with instant visual priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust and Transparency Section */}
      <section id="coverage" className="py-16 bg-white border-t border-aviation-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-aviation-cloud/50 border border-aviation-border rounded-2xl p-8 sm:p-10 shadow-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-aviation-lightSky border border-blue-200 text-aviation-navy">
                <ShieldCheck className="w-6 h-6 text-aviation-sky" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-aviation-navy">Trust, Data Transparency & API Policy</h3>
                <p className="text-xs text-aviation-muted">Adhering to OpenSky Network & ADS-B Standards</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-aviation-slate leading-relaxed">
              <p>
                <strong>AirTrafficControl-CC</strong> retrieves actual aircraft data via the documented{' '}
                <a
                  href="https://opensky-network.org/apidoc/rest.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-aviation-sky hover:underline font-medium"
                >
                  OpenSky Network REST API
                </a>
                .
              </p>
              <div className="p-4 rounded-xl bg-white border border-aviation-border space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="text-aviation-green font-bold text-sm">•</span>
                  <span><strong>Data Honesty:</strong> Live flight data is never simulated behind your back. If the feed is delayed or interrupted, a clear plain-language status alert is presented immediately.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-aviation-sky font-bold text-sm">•</span>
                  <span><strong>Cloud IP Policy &amp; Demonstration Flights:</strong> OpenSky Network officially restricts unauthenticated requests from cloud hosting platforms (Vercel/AWS). When restricted, our proxy catches the 504/timeout and provides a seamless option to continue exploring with demonstration flights.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-aviation-navy font-bold text-sm">•</span>
                  <span><strong>Registered Credentials:</strong> OpenSky users can configure client credentials in deployment environment variables to query with authorized rate quotas.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-aviation-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-aviation-muted">
                Cartography: Official Google Maps Platform &amp; OpenStreetMap contributors. Clean daylight tiles with zero watermarks.
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-aviation-navy hover:bg-aviation-midnight text-white font-medium text-xs shadow-xs transition"
              >
                Launch Live Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer id="about" className="mt-auto border-t border-aviation-border bg-white py-12 text-xs text-aviation-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-aviation-sky" />
                <span className="font-bold text-aviation-navy text-sm">AirTrafficControl-CC</span>
              </div>
              <p className="text-aviation-muted leading-relaxed">
                CodeChef-VIT Promotional Cycle 2026–27 Frontend Development Task. Real-time geospatial
                aviation monitoring system.
              </p>
            </div>

            <div>
              <h4 className="text-aviation-navy uppercase font-bold mb-3 tracking-wider text-[11px]">
                Navigation
              </h4>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-aviation-navy transition">Home</Link></li>
                <li><Link to="/dashboard" className="hover:text-aviation-navy transition">Live Flights Dashboard</Link></li>
                <li><Link to="/signin" className="hover:text-aviation-navy transition">Sign In</Link></li>
                <li><Link to="/signup" className="hover:text-aviation-navy transition">Create Account</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-aviation-navy uppercase font-bold mb-3 tracking-wider text-[11px]">
                Aviation Providers
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://opensky-network.org" target="_blank" rel="noopener noreferrer" className="hover:text-aviation-navy transition flex items-center gap-1">
                    OpenSky Network <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="hover:text-aviation-navy transition flex items-center gap-1">
                    OpenStreetMap <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer" className="hover:text-aviation-navy transition flex items-center gap-1">
                    Leaflet JS <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-aviation-navy uppercase font-bold mb-3 tracking-wider text-[11px]">
                Repository & Build
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com/SarveshS1407/Airtrafficcontrol-CC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-aviation-navy transition flex items-center gap-1"
                  >
                    GitHub Repository <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>Stack: React + Vite + TypeScript</li>
                <li>State: Zustand Store</li>
                <li>Styling: Tailwind CSS (Aviation Theme)</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-aviation-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div>
              &copy; {new Date().getFullYear()} AirTrafficControl-CC. Built for CodeChef-VIT.
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-aviation-green" />
              <span className="text-aviation-slate font-medium">All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
