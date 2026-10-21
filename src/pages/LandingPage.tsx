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
  MapPin,
  Radio,
  FileText,
} from 'lucide-react';
import { Link, useRouter } from '../router/Router';
import { useAuthStore } from '../store/useAuthStore';

export const LandingPage: React.FC = () => {
  const { navigate } = useRouter();
  const { currentUser, isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F0E7] text-[#172D40] flex flex-col font-sans selection:bg-[#D87C43]/20 selection:text-[#172D40]">
      {/* 0. Top Dispatch Bar */}
      <div className="bg-[#20394D] text-[#D6E0E7] text-[11px] font-mono tracking-wider px-4 py-1.5 border-b border-[#172D40] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-white font-semibold">
            <Radio className="w-3.5 h-3.5 text-[#D87C43] animate-pulse" />
            GLOBAL AVIATION OBSERVATORY
          </span>
          <span className="hidden sm:inline text-[#8DB7D5]">•</span>
          <span className="hidden sm:inline text-[#8DB7D5]">DOC REF: ATCC-NAVLOG-2026.04</span>
        </div>
        <div className="flex items-center gap-4 text-[#8DB7D5]">
          <span className="hidden md:inline">DATUM: WGS-84</span>
          <span className="hidden md:inline">AIRSPACE: UNRESTRICTED</span>
          <span className="flex items-center gap-1.5 text-[#467A67] bg-[#FCFAF5]/10 px-2 py-0.5 rounded text-[10px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#467A67] animate-ping" />
            FEED LIVE
          </span>
        </div>
      </div>

      {/* 1. Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#FCFAF5]/95 backdrop-blur-md border-b border-[#D6E0E7] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded bg-[#20394D] flex items-center justify-center text-white shadow-xs group-hover:bg-[#172D40] transition border border-[#172D40]">
              <Plane className="w-5 h-5 text-[#D87C43] transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-[#172D40] text-base">AirTrafficControl</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#E3ECF3] border border-[#D6E0E7] text-[#20394D]">
                  CC
                </span>
              </div>
              <p className="text-[10px] font-mono tracking-wider text-[#82909B] uppercase">
                Aviation Field Journal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-[#456D8B]">
            <a href="#how-it-works" className="hover:text-[#172D40] transition">How It Works</a>
            <a href="#features" className="hover:text-[#172D40] transition">Features</a>
            <a href="#coverage" className="hover:text-[#172D40] transition">Data &amp; Transparency</a>
            <a href="#about" className="hover:text-[#172D40] transition">About</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-[#F4F0E7] border border-[#D6E0E7] rounded px-3 py-1.5 text-xs font-mono">
                  <UserCheck className="w-3.5 h-3.5 text-[#467A67]" />
                  <span className="text-[#172D40] font-bold">{currentUser.callsign}</span>
                </div>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#20394D] hover:bg-[#172D40] text-white font-medium text-xs shadow-xs transition border border-[#172D40]"
                >
                  <Compass className="w-4 h-4 text-[#D87C43]" />
                  Launch Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/signin"
                  className="text-xs font-mono uppercase tracking-wider text-[#456D8B] hover:text-[#172D40] px-3 py-2 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#D87C43] hover:bg-[#C26B34] text-white font-semibold text-xs tracking-wide shadow-xs transition border border-[#B8632E]"
                >
                  <span>Explore Global Traffic</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded bg-[#F4F0E7] border border-[#D6E0E7] text-[#172D40] hover:bg-[#E3ECF3] transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#D6E0E7] bg-[#FCFAF5] px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <nav className="flex flex-col space-y-2 text-xs font-mono uppercase tracking-wider text-[#456D8B]">
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded hover:bg-[#F4F0E7]"
              >
                How It Works
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded hover:bg-[#F4F0E7]"
              >
                Features
              </a>
              <a
                href="#coverage"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded hover:bg-[#F4F0E7]"
              >
                Data &amp; Transparency
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded hover:bg-[#F4F0E7]"
              >
                About
              </a>
            </nav>
            <div className="pt-3 border-t border-[#D6E0E7] flex flex-col gap-2">
              <Link
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-mono uppercase tracking-wider text-[#172D40] hover:bg-[#F4F0E7] rounded"
              >
                Sign In
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded bg-[#D87C43] text-white font-semibold text-xs tracking-wide shadow-xs"
              >
                <Compass className="w-4 h-4" />
                Explore Global Traffic
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section: Aviation Field Journal */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#D6E0E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Editorial Headline & Copy */}
            <div className="lg:col-span-7 space-y-6">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded bg-[#FCFAF5] border border-[#D6E0E7] text-[#20394D] text-[11px] font-mono tracking-wider shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#D87C43] animate-pulse" />
                <span className="font-bold">GLOBAL AVIATION OBSERVATORY / 001</span>
                <span className="text-[#82909B]">•</span>
                <span className="text-[#456D8B]">OPEN SKY TELEMETRY</span>
              </div>

              {/* Exact Required Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#172D40] leading-[1.08]">
                The World, Seen Through Flight.
              </h1>

              {/* Exact Required Supporting Copy */}
              <p className="text-base sm:text-lg text-[#20394D]/90 leading-relaxed max-w-2xl">
                Explore the movement of aircraft across continents. Find a place, follow the traffic, and understand the skies through an interactive global map.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded bg-[#D87C43] hover:bg-[#C26B34] text-white font-semibold text-sm tracking-wide shadow-xs transition border border-[#B8632E] transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Plane className="w-4 h-4 transform -rotate-45" />
                  <span>Explore Global Traffic</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded bg-[#FCFAF5] hover:bg-white border border-[#D6E0E7] text-[#20394D] font-mono text-xs uppercase tracking-wider transition shadow-2xs"
                >
                  <Compass className="w-4 h-4 text-[#456D8B]" />
                  <span>How It Works</span>
                </a>
              </div>

              {/* Technical Datum Indicators */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-[#D6E0E7]/80 text-[11px] font-mono">
                <div className="bg-[#FCFAF5] p-2.5 rounded border border-[#D6E0E7]">
                  <span className="text-[#82909B] block text-[9px] uppercase">COORDINATE DATUM</span>
                  <span className="text-[#172D40] font-bold">WGS-84 / SPHEROID</span>
                </div>
                <div className="bg-[#FCFAF5] p-2.5 rounded border border-[#D6E0E7]">
                  <span className="text-[#82909B] block text-[9px] uppercase">CARTOGRAPHY</span>
                  <span className="text-[#172D40] font-bold">GOOGLE MAPS + OSM</span>
                </div>
                <div className="bg-[#FCFAF5] p-2.5 rounded border border-[#D6E0E7]">
                  <span className="text-[#82909B] block text-[9px] uppercase">SURVEILLANCE</span>
                  <span className="text-[#467A67] font-bold">ADS-B LIVE INGEST</span>
                </div>
              </div>
            </div>

            {/* Right Column: Art-Directed Aviation Field Journal Dossier */}
            <div className="lg:col-span-5">
              <div className="bg-[#FCFAF5] border-2 border-[#D6E0E7] rounded-xl shadow-md overflow-hidden relative">
                {/* Dossier Header */}
                <div className="bg-[#20394D] text-[#FCFAF5] px-4 py-2.5 border-b border-[#172D40] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#D87C43]" />
                    <span className="font-bold tracking-wider">NAVLOG-DOC-001</span>
                  </div>
                  <span className="text-[10px] text-[#8DB7D5] bg-[#172D40] px-2 py-0.5 rounded">
                    TRANSATLANTIC / NAT-B
                  </span>
                </div>

                {/* Blueprint Nav Canvas */}
                <div className="p-4 relative bg-[#FCFAF5] blueprint-grid">
                  {/* Subtle Flight Corridor Arc & Waypoint Fixes */}
                  <div className="relative h-64 border border-[#D6E0E7] rounded bg-white/70 overflow-hidden p-3 flex flex-col justify-between">
                    {/* Top Waypoint Bar */}
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#82909B]">
                      <span>FIX: GOMUP (51°12&apos;N 008°45&apos;W)</span>
                      <span>FIX: DOGAL (53°00&apos;N 015°00&apos;W)</span>
                      <span>FIX: MALOT (54°00&apos;N 020°00&apos;W)</span>
                    </div>

                    {/* Visual Route Arc SVG */}
                    <div className="relative flex-1 flex items-center justify-center my-2">
                      <svg className="w-full h-full" viewBox="0 0 360 120" fill="none">
                        {/* Range Rings */}
                        <circle cx="180" cy="60" r="50" stroke="#D6E0E7" strokeWidth="1" strokeDasharray="3 3" />
                        <circle cx="180" cy="60" r="90" stroke="#D6E0E7" strokeWidth="1" strokeDasharray="4 4" />
                        {/* Great Circle Flight Path */}
                        <path d="M 20 90 Q 180 20 340 85" stroke="#456D8B" strokeWidth="2" strokeDasharray="4 2" />
                        {/* Active Flight Vectors */}
                        {/* Flight 1: Active Orange BAW178 */}
                        <g transform="translate(195, 36)">
                          <circle cx="0" cy="0" r="10" fill="#D87C43" fillOpacity="0.2" className="animate-ping" />
                          <circle cx="0" cy="0" r="5" fill="#D87C43" />
                          <path d="M0 -7 L4 5 L0 3 L-4 5 Z" fill="#D87C43" transform="rotate(275)" />
                        </g>
                        {/* Flight 2: Cruising Navy AFR008 */}
                        <g transform="translate(100, 52)">
                          <circle cx="0" cy="0" r="4" fill="#20394D" />
                          <path d="M0 -6 L3 4 L0 2 L-3 4 Z" fill="#20394D" transform="rotate(290)" />
                        </g>
                        {/* Flight 3: Climbing Green DLH400 */}
                        <g transform="translate(290, 68)">
                          <circle cx="0" cy="0" r="4" fill="#467A67" />
                          <path d="M0 -6 L3 4 L0 2 L-3 4 Z" fill="#467A67" transform="rotate(260)" />
                        </g>
                      </svg>
                    </div>

                    {/* Active Flight Card: BAW178 */}
                    <div className="bg-[#FCFAF5] border-l-4 border-l-[#D87C43] border border-[#D6E0E7] p-2.5 rounded shadow-xs">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2 font-bold text-[#172D40]">
                          <Plane className="w-3.5 h-3.5 text-[#D87C43] transform -rotate-45" />
                          <span>BAW178</span>
                          <span className="text-[10px] text-[#456D8B] font-normal">B777-300ER • G-STBG</span>
                        </div>
                        <span className="text-[10px] text-[#D87C43] font-bold bg-[#D87C43]/10 px-1.5 py-0.5 rounded">
                          TRACKED TARGET
                        </span>
                      </div>
                      <div className="mt-1.5 grid grid-cols-4 gap-2 text-[10px] font-mono text-[#20394D]">
                        <div>
                          <span className="text-[#82909B] block text-[8px]">ALTITUDE</span>
                          <span className="font-bold">FL370 (37,000&apos;)</span>
                        </div>
                        <div>
                          <span className="text-[#82909B] block text-[8px]">AIRSPEED</span>
                          <span className="font-bold">466 KT</span>
                        </div>
                        <div>
                          <span className="text-[#82909B] block text-[8px]">HEADING</span>
                          <span className="font-bold">274° W</span>
                        </div>
                        <div>
                          <span className="text-[#82909B] block text-[8px]">ROUTE</span>
                          <span className="font-bold">LHR → JFK</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Flight Log Dossier Strip */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="bg-white p-2 rounded border border-[#D6E0E7] flex items-center justify-between">
                      <span className="text-[#82909B]">AFR008 (CDG→LAX)</span>
                      <span className="font-bold text-[#20394D]">FL390 • 482 KT</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-[#D6E0E7] flex items-center justify-between">
                      <span className="text-[#82909B]">DLH400 (FRA→ORD)</span>
                      <span className="font-bold text-[#467A67]">FL340 • 450 KT</span>
                    </div>
                  </div>

                  {/* Explore Button */}
                  <div className="mt-3 pt-3 border-t border-[#D6E0E7] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#82909B]">
                      SURVEILLANCE RADAR LIVE
                    </span>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#D87C43] hover:text-[#C26B34] transition"
                    >
                      <span>Open Full Map</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Three Simple Steps Section: Editorial Workflow */}
      <section id="how-it-works" className="py-16 bg-[#FCFAF5] border-b border-[#D6E0E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[11px] font-mono font-bold text-[#D87C43] tracking-widest uppercase block mb-1">
              OPERATIONAL WORKFLOW / PROTOCOL
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#172D40] tracking-tight">
              Learn How It Works
            </h2>
            <p className="mt-3 text-[#456D8B] text-sm sm:text-base leading-relaxed">
              Explore airspace anywhere in the world using three intuitive operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-white border border-[#D6E0E7] rounded-xl p-6 relative hover:border-[#D87C43] transition shadow-2xs group">
              <div className="text-4xl font-mono font-black text-[#D6E0E7] group-hover:text-[#D87C43]/20 transition absolute top-5 right-5">
                01
              </div>
              <div className="w-10 h-10 rounded bg-[#F4F0E7] border border-[#D6E0E7] flex items-center justify-center text-[#20394D] mb-5">
                <Search className="w-5 h-5 text-[#D87C43]" />
              </div>
              <h3 className="text-lg font-bold text-[#172D40] mb-2 font-mono">
                01 — Find your location.
              </h3>
              <p className="text-[#20394D]/80 text-xs sm:text-sm leading-relaxed">
                Search for an aerodrome, metropolitan center, or coordinate, or click directly on the interactive map to establish an airspace surveillance anchor.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-[#D6E0E7] rounded-xl p-6 relative hover:border-[#D87C43] transition shadow-2xs group">
              <div className="text-4xl font-mono font-black text-[#D6E0E7] group-hover:text-[#D87C43]/20 transition absolute top-5 right-5">
                02
              </div>
              <div className="w-10 h-10 rounded bg-[#F4F0E7] border border-[#D6E0E7] flex items-center justify-center text-[#20394D] mb-5">
                <Compass className="w-5 h-5 text-[#456D8B]" />
              </div>
              <h3 className="text-lg font-bold text-[#172D40] mb-2 font-mono">
                02 — Explore aircraft in view.
              </h3>
              <p className="text-[#20394D]/80 text-xs sm:text-sm leading-relaxed">
                Adjust your monitoring perimeter from 25 km to 250 km. Observe real-time aircraft positions, headings, and vertical rate trends in your sector.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-[#D6E0E7] rounded-xl p-6 relative hover:border-[#D87C43] transition shadow-2xs group">
              <div className="text-4xl font-mono font-black text-[#D6E0E7] group-hover:text-[#D87C43]/20 transition absolute top-5 right-5">
                03
              </div>
              <div className="w-10 h-10 rounded bg-[#F4F0E7] border border-[#D6E0E7] flex items-center justify-center text-[#20394D] mb-5">
                <Plane className="w-5 h-5 text-[#467A67]" />
              </div>
              <h3 className="text-lg font-bold text-[#172D40] mb-2 font-mono">
                03 — Inspect available flight information.
              </h3>
              <p className="text-[#20394D]/80 text-xs sm:text-sm leading-relaxed">
                Select any flight to view its navigation log: callsign, barometric altitude, true airspeed, heading bearing, squawk status, and waypoint breadcrumbs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Section: Aeronautical Chart Standards */}
      <section id="features" className="py-16 bg-[#F4F0E7] border-b border-[#D6E0E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[11px] font-mono font-bold text-[#D87C43] tracking-widest uppercase block mb-1">
              SYSTEM CAPABILITIES / INSTRUMENTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#172D40] tracking-tight">
              Aviation-Grade Precision &amp; Transparency
            </h2>
            <p className="mt-3 text-[#456D8B] text-sm sm:text-base leading-relaxed">
              Every interface element is crafted for clarity, dependable geospatial accuracy, and complete data integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#FCFAF5] border border-[#D6E0E7] rounded-xl p-6 shadow-2xs hover:border-[#456D8B] transition">
              <div className="w-10 h-10 rounded bg-white border border-[#D6E0E7] flex items-center justify-center mb-4 text-[#456D8B]">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172D40] mb-2 font-mono">
                Google Maps + OpenStreetMap
              </h3>
              <p className="text-[#20394D]/80 text-xs sm:text-sm leading-relaxed">
                Switch between official Google Maps (Roadmap, Satellite, Terrain, Hybrid) and OpenStreetMap tiles with zero watermarks or API lockouts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#FCFAF5] border border-[#D6E0E7] rounded-xl p-6 shadow-2xs hover:border-[#456D8B] transition">
              <div className="w-10 h-10 rounded bg-white border border-[#D6E0E7] flex items-center justify-center mb-4 text-[#D87C43]">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172D40] mb-2 font-mono">
                Location-Driven Monitoring
              </h3>
              <p className="text-[#20394D]/80 text-xs sm:text-sm leading-relaxed">
                Search global aerodromes or click directly on any coordinate to establish a focused 25 to 250 km surveillance perimeter around your target.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#FCFAF5] border border-[#D6E0E7] rounded-xl p-6 shadow-2xs hover:border-[#456D8B] transition">
              <div className="w-10 h-10 rounded bg-white border border-[#D6E0E7] flex items-center justify-center mb-4 text-[#467A67]">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172D40] mb-2 font-mono">
                Pilot Dossier Telemetry
              </h3>
              <p className="text-[#20394D]/80 text-xs sm:text-sm leading-relaxed">
                Inspect callsign, country of origin, altitude in feet and meters, speed in knots, climb rate, and transponder codes with graceful fallbacks.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#FCFAF5] border border-[#D6E0E7] rounded-xl p-6 shadow-2xs hover:border-[#456D8B] transition">
              <div className="w-10 h-10 rounded bg-white border border-[#D6E0E7] flex items-center justify-center mb-4 text-[#456D8B]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172D40] mb-2 font-mono">
                Freshness Sweeps &amp; Zulu Time
              </h3>
              <p className="text-[#20394D]/80 text-xs sm:text-sm leading-relaxed">
                Automatic refresh intervals with data freshness badges, countdown sweeps, and friendly notifications when public cloud rates throttle.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#FCFAF5] border border-[#D6E0E7] rounded-xl p-6 shadow-2xs hover:border-[#456D8B] transition">
              <div className="w-10 h-10 rounded bg-white border border-[#D6E0E7] flex items-center justify-center mb-4 text-[#D87C43]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172D40] mb-2 font-mono">
                Recent Flight Breadcrumbs
              </h3>
              <p className="text-[#20394D]/80 text-xs sm:text-sm leading-relaxed">
                Visual flight trails track historical aircraft observations color-coded by altitude to illustrate flight trajectories and approach patterns.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#FCFAF5] border border-[#D6E0E7] rounded-xl p-6 shadow-2xs hover:border-[#C94C4C] transition">
              <div className="w-10 h-10 rounded bg-white border border-[#D6E0E7] flex items-center justify-center mb-4 text-[#C94C4C]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172D40] mb-2 font-mono">
                Emergency Squawk Filter
              </h3>
              <p className="text-[#20394D]/80 text-xs sm:text-sm leading-relaxed">
                Filter for emergency squawk codes (7700 general emergency, 7600 radio loss, 7500 unlawful interference) with high visual priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust and Transparency Section: OpenSky Network Policy */}
      <section id="coverage" className="py-16 bg-[#FCFAF5] border-b border-[#D6E0E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white border border-[#D6E0E7] rounded-xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded bg-[#F4F0E7] border border-[#D6E0E7] text-[#20394D]">
                <ShieldCheck className="w-6 h-6 text-[#D87C43]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#172D40] font-mono">
                  Trust, Data Transparency &amp; API Policy
                </h3>
                <p className="text-xs text-[#82909B] font-mono">Adhering to OpenSky Network &amp; ADS-B Standards</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#20394D]/90 leading-relaxed">
              <p>
                <strong>AirTrafficControl-CC</strong> retrieves actual aircraft data via the documented{' '}
                <a
                  href="https://opensky-network.org/apidoc/rest.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D87C43] hover:underline font-bold"
                >
                  OpenSky Network REST API
                </a>
                .
              </p>
              <div className="p-4 rounded bg-[#FCFAF5] border border-[#D6E0E7] space-y-2.5 text-xs font-mono">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#467A67] font-bold">•</span>
                  <span><strong>Data Honesty:</strong> Live flight data is never simulated behind your back. If the feed is delayed or interrupted, a clear plain-language status alert is presented immediately.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#D87C43] font-bold">•</span>
                  <span><strong>Cloud IP Policy &amp; Demonstration Flights:</strong> OpenSky Network officially restricts unauthenticated requests from cloud hosting platforms (Vercel/AWS). When restricted, our proxy catches the 504/timeout and provides a seamless option to continue exploring with demonstration flights.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#456D8B] font-bold">•</span>
                  <span><strong>Registered Credentials:</strong> OpenSky users can configure client credentials in deployment environment variables to query with authorized rate quotas.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#D6E0E7] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-[11px] font-mono text-[#82909B]">
                Cartography: Official Google Maps Platform &amp; OpenStreetMap contributors. Clean daylight tiles with zero watermarks.
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-5 py-2.5 rounded bg-[#20394D] hover:bg-[#172D40] text-white font-mono text-xs uppercase tracking-wider shadow-xs transition"
              >
                Launch Live Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer: Publication Colophon */}
      <footer id="about" className="mt-auto bg-[#20394D] text-[#D6E0E7] py-12 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-[#D87C43]" />
                <span className="font-bold text-white text-sm">AirTrafficControl-CC</span>
              </div>
              <p className="text-[#8DB7D5] leading-relaxed text-[11px]">
                CodeChef-VIT Promotional Cycle 2026–27 Frontend Development Task. Real-time geospatial
                aviation monitoring system.
              </p>
            </div>

            <div>
              <h4 className="text-white uppercase font-bold mb-3 tracking-wider text-[11px]">
                Navigation
              </h4>
              <ul className="space-y-2 text-[11px] text-[#8DB7D5]">
                <li><Link to="/" className="hover:text-white transition">Home / Field Journal</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition">Live Flights Dashboard</Link></li>
                <li><Link to="/signin" className="hover:text-white transition">Sign In</Link></li>
                <li><Link to="/signup" className="hover:text-white transition">Create Account</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white uppercase font-bold mb-3 tracking-wider text-[11px]">
                Aviation Providers
              </h4>
              <ul className="space-y-2 text-[11px] text-[#8DB7D5]">
                <li>
                  <a href="https://opensky-network.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">
                    OpenSky Network <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">
                    OpenStreetMap <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">
                    Leaflet JS <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white uppercase font-bold mb-3 tracking-wider text-[11px]">
                Repository &amp; Build
              </h4>
              <ul className="space-y-2 text-[11px] text-[#8DB7D5]">
                <li>
                  <a
                    href="https://github.com/SarveshS1407/Airtrafficcontrol-CC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition flex items-center gap-1"
                  >
                    GitHub Repository <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>Stack: React + Vite + TypeScript</li>
                <li>State: Zustand Store</li>
                <li>Theme: Aviation Field Journal</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#172D40] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#8DB7D5]">
            <div>
              &copy; {new Date().getFullYear()} AirTrafficControl-CC. Built for CodeChef-VIT.
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#467A67]" />
              <span className="text-[#FCFAF5] font-semibold">ALL RADAR SYSTEMS OPERATIONAL</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
