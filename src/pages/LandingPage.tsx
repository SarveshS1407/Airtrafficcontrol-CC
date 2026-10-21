import React, { useState } from 'react';
import {
  ArrowRight,
  ExternalLink,
  AlertTriangle,
  Menu,
  X,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { Link, useRouter } from '../router/Router';
import { useAuthStore } from '../store/useAuthStore';
import {
  AviationEmblem,
  CommercialAircraftIcon,
  AirportPinIcon,
  GlobeNavigationIcon,
  FlightRouteIcon,
  RadarBeaconIcon,
  FlightHistoryIcon,
  AltimeterIcon,
  AirspeedIcon,
  CompassHeadingIcon,
  RouteFlightIllustration,
  MiniatureCompassRose,
  PaperFlightPlanIllustration,
  GlobeRouteIllustration,
  RunwayFlightDivider,
  AirportStampBadge,
} from '../components/AviationDesignSystem';
import { AccountMenu } from '../components/Account/AccountMenu';

export const LandingPage: React.FC = () => {
  const { navigate } = useRouter();
  const { currentUser, isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F0E7] dark:bg-[#101E2B] text-[#172D40] dark:text-[#E3ECF3] flex flex-col font-sans selection:bg-[#D87C43]/20 selection:text-[#172D40] transition-colors duration-200">
      {/* 0. Top Dispatch Bar */}
      <div className="bg-[#20394D] dark:bg-[#0C1722] text-[#D6E0E7] text-[11px] font-mono tracking-wider px-4 py-1.5 border-b border-[#172D40] dark:border-[#2D4B63] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-white font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#D87C43] animate-pulse" />
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

      {/* 1. Navigation Header with Custom Aviation Emblem */}
      <header className="sticky top-0 z-50 bg-[#FCFAF5]/95 dark:bg-[#101E2B]/95 backdrop-blur-md border-b border-[#D6E0E7] dark:border-[#2D4B63] shadow-2xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            <AviationEmblem size="md" variant="badge" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-[#172D40] dark:text-white text-base">
                  AirTrafficControl
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#E3ECF3] dark:bg-[#20394D] border border-[#D6E0E7] dark:border-[#2D4B63] text-[#20394D] dark:text-[#8DB7D5]">
                  CC
                </span>
              </div>
              <p className="text-[10px] font-mono tracking-wider text-[#82909B] dark:text-[#8DB7D5] uppercase">
                Aviation Field Journal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-[#456D8B] dark:text-[#8DB7D5]">
            <a href="#how-it-works" className="hover:text-[#172D40] dark:hover:text-white transition">How It Works</a>
            <a href="#features" className="hover:text-[#172D40] dark:hover:text-white transition">Features</a>
            <a href="#coverage" className="hover:text-[#172D40] dark:hover:text-white transition">Data &amp; Transparency</a>
            <a href="#about" className="hover:text-[#172D40] dark:hover:text-white transition">About</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D87C43] hover:bg-[#C26B34] text-white font-semibold text-xs tracking-wide shadow-xs transition border border-[#B8632E]"
            >
              <span>Explore Global Traffic</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <AccountMenu align="right" />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded bg-[#F4F0E7] dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] text-[#172D40] dark:text-[#E3ECF3] hover:bg-[#E3ECF3] transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#D6E0E7] dark:border-[#2D4B63] bg-[#FCFAF5] dark:bg-[#101E2B] px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <nav className="flex flex-col space-y-2 text-xs font-mono uppercase tracking-wider text-[#456D8B] dark:text-[#8DB7D5]">
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded hover:bg-[#F4F0E7] dark:hover:bg-[#172D40]"
              >
                How It Works
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded hover:bg-[#F4F0E7] dark:hover:bg-[#172D40]"
              >
                Features
              </a>
              <a
                href="#coverage"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded hover:bg-[#F4F0E7] dark:hover:bg-[#172D40]"
              >
                Data &amp; Transparency
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded hover:bg-[#F4F0E7] dark:hover:bg-[#172D40]"
              >
                About
              </a>
            </nav>
            <div className="pt-3 border-t border-[#D6E0E7] dark:border-[#2D4B63] flex flex-col gap-2">
              {isAuthenticated && currentUser ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#F4F0E7] dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63]">
                  <AccountMenu align="left" compactOnMobile={false} />
                </div>
              ) : (
                <Link
                  to="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-xs font-mono uppercase tracking-wider text-[#172D40] dark:text-[#E3ECF3] hover:bg-[#F4F0E7] dark:hover:bg-[#172D40] rounded border border-[#D6E0E7] dark:border-[#2D4B63]"
                >
                  Sign In
                </Link>
              )}
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded bg-[#D87C43] text-white font-semibold text-xs tracking-wide shadow-xs"
              >
                <CommercialAircraftIcon size={16} color="#ffffff" className="transform -rotate-45" />
                Explore Global Traffic
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section: Aviation Field Journal */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#D6E0E7] dark:border-[#2D4B63]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Editorial Headline & Copy */}
            <div className="lg:col-span-7 space-y-6">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded bg-[#FCFAF5] dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] text-[#20394D] dark:text-[#8DB7D5] text-[11px] font-mono tracking-wider shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#D87C43] animate-pulse" />
                <span className="font-bold">GLOBAL AVIATION OBSERVATORY / 001</span>
                <span className="text-[#82909B]">•</span>
                <span className="text-[#456D8B] dark:text-[#8DB7D5]">OPEN SKY TELEMETRY</span>
              </div>

              {/* Exact Required Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#172D40] dark:text-white leading-[1.08]">
                The World, Seen Through Flight.
              </h1>

              {/* Exact Required Supporting Copy */}
              <p className="text-base sm:text-lg text-[#20394D]/90 dark:text-[#D6E0E7] leading-relaxed max-w-2xl">
                Explore the movement of aircraft across continents. Find a place, follow the traffic, and understand the skies through an interactive global map.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded bg-[#D87C43] hover:bg-[#C26B34] text-white font-semibold text-sm tracking-wide shadow-xs transition border border-[#B8632E] transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <CommercialAircraftIcon size={18} color="#ffffff" className="transform -rotate-45" />
                  <span>Explore Global Traffic</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded bg-[#FCFAF5] dark:bg-[#172D40] hover:bg-white dark:hover:bg-[#20394D] border border-[#D6E0E7] dark:border-[#2D4B63] text-[#20394D] dark:text-[#E3ECF3] font-mono text-xs uppercase tracking-wider transition shadow-2xs"
                >
                  <Compass className="w-4 h-4 text-[#456D8B]" />
                  <span>How It Works</span>
                </a>
              </div>

              {/* Route Trajectory Micro-Illustration */}
              <div className="pt-2 hidden sm:block">
                <RouteFlightIllustration width={280} height={50} />
              </div>

              {/* Technical Datum Indicators with Miniature Compass Rose */}
              <div className="pt-2 flex items-center gap-4 border-t border-[#D6E0E7]/80 dark:border-[#2D4B63]/80">
                <div className="hidden sm:block shrink-0">
                  <MiniatureCompassRose size={64} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono flex-1">
                  <div className="bg-[#FCFAF5] dark:bg-[#172D40] p-2.5 rounded border border-[#D6E0E7] dark:border-[#2D4B63]">
                    <span className="text-[#82909B] dark:text-[#8DB7D5] block text-[9px] uppercase">COORDINATE DATUM</span>
                    <span className="text-[#172D40] dark:text-[#E3ECF3] font-bold">WGS-84</span>
                  </div>
                  <div className="bg-[#FCFAF5] dark:bg-[#172D40] p-2.5 rounded border border-[#D6E0E7] dark:border-[#2D4B63]">
                    <span className="text-[#82909B] dark:text-[#8DB7D5] block text-[9px] uppercase">CARTOGRAPHY</span>
                    <span className="text-[#172D40] dark:text-[#E3ECF3] font-bold">MAPS + OSM</span>
                  </div>
                  <div className="bg-[#FCFAF5] dark:bg-[#172D40] p-2.5 rounded border border-[#D6E0E7] dark:border-[#2D4B63]">
                    <span className="text-[#82909B] dark:text-[#8DB7D5] block text-[9px] uppercase">SURVEILLANCE</span>
                    <span className="text-[#467A67] font-bold">LIVE INGEST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Art-Directed Aviation Field Journal Dossier */}
            <div className="lg:col-span-5">
              <div className="bg-[#FCFAF5] dark:bg-[#172D40] border-2 border-[#D6E0E7] dark:border-[#2D4B63] rounded-xl shadow-md overflow-hidden relative">
                {/* Dossier Header */}
                <div className="bg-[#20394D] dark:bg-[#0C1722] text-[#FCFAF5] px-4 py-2.5 border-b border-[#172D40] dark:border-[#2D4B63] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <CommercialAircraftIcon size={16} color="#D87C43" className="transform -rotate-45" />
                    <span className="font-bold tracking-wider">NAVLOG-DOC-001</span>
                  </div>
                  <span className="text-[10px] text-[#8DB7D5] bg-[#172D40] dark:bg-[#101E2B] px-2 py-0.5 rounded border border-[#2D4B63]">
                    TRANSATLANTIC / NAT-B
                  </span>
                </div>

                {/* Blueprint Nav Canvas */}
                <div className="p-4 relative bg-[#FCFAF5] dark:bg-[#172D40] blueprint-grid">
                  {/* Subtle Flight Corridor Arc & Waypoint Fixes */}
                  <div className="relative h-64 border border-[#D6E0E7] dark:border-[#2D4B63] rounded bg-white/70 dark:bg-[#101E2B]/80 overflow-hidden p-3 flex flex-col justify-between">
                    {/* Top Waypoint Bar */}
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#82909B] dark:text-[#8DB7D5]">
                      <span>FIX: GOMUP</span>
                      <span>FIX: DOGAL</span>
                      <span>FIX: MALOT</span>
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
                        <g transform="translate(195, 36)">
                          <circle cx="0" cy="0" r="10" fill="#D87C43" fillOpacity="0.2" className="animate-ping" />
                          <circle cx="0" cy="0" r="5" fill="#D87C43" />
                          <path d="M0 -7 L4 5 L0 3 L-4 5 Z" fill="#D87C43" transform="rotate(275)" />
                        </g>
                        <g transform="translate(100, 52)">
                          <circle cx="0" cy="0" r="4" fill="#20394D" />
                          <path d="M0 -6 L3 4 L0 2 L-3 4 Z" fill="#20394D" transform="rotate(290)" />
                        </g>
                        <g transform="translate(290, 68)">
                          <circle cx="0" cy="0" r="4" fill="#467A67" />
                          <path d="M0 -6 L3 4 L0 2 L-3 4 Z" fill="#467A67" transform="rotate(260)" />
                        </g>
                      </svg>
                    </div>

                    {/* Active Flight Card: BAW178 */}
                    <div className="bg-[#FCFAF5] dark:bg-[#101E2B] border-l-4 border-l-[#D87C43] border border-[#D6E0E7] dark:border-[#2D4B63] p-2.5 rounded shadow-xs">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2 font-bold text-[#172D40] dark:text-[#E3ECF3]">
                          <CommercialAircraftIcon size={14} color="#D87C43" className="transform -rotate-45" />
                          <span>BAW178</span>
                          <span className="text-[10px] text-[#456D8B] dark:text-[#8DB7D5] font-normal">B777-300ER • G-STBG</span>
                        </div>
                        <span className="text-[10px] text-[#D87C43] font-bold bg-[#D87C43]/10 px-1.5 py-0.5 rounded">
                          TRACKED TARGET
                        </span>
                      </div>
                      <div className="mt-1.5 grid grid-cols-4 gap-2 text-[10px] font-mono text-[#20394D] dark:text-[#E3ECF3]">
                        <div>
                          <span className="text-[#82909B] dark:text-[#8DB7D5] block text-[8px]">ALTITUDE</span>
                          <span className="font-bold flex items-center gap-0.5">
                            <AltimeterIcon size={10} color="#D87C43" /> FL370
                          </span>
                        </div>
                        <div>
                          <span className="text-[#82909B] dark:text-[#8DB7D5] block text-[8px]">AIRSPEED</span>
                          <span className="font-bold flex items-center gap-0.5">
                            <AirspeedIcon size={10} color="#467A67" /> 466 KT
                          </span>
                        </div>
                        <div>
                          <span className="text-[#82909B] dark:text-[#8DB7D5] block text-[8px]">HEADING</span>
                          <span className="font-bold flex items-center gap-0.5">
                            <CompassHeadingIcon size={11} heading={274} color="#D87C43" /> 274° W
                          </span>
                        </div>
                        <div>
                          <span className="text-[#82909B] dark:text-[#8DB7D5] block text-[8px]">ROUTE</span>
                          <span className="font-bold">LHR → JFK</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Flight Log Dossier Strip */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="bg-white dark:bg-[#101E2B] p-2 rounded border border-[#D6E0E7] dark:border-[#2D4B63] flex items-center justify-between">
                      <span className="text-[#82909B] dark:text-[#8DB7D5]">AFR008 (CDG→LAX)</span>
                      <span className="font-bold text-[#20394D] dark:text-[#E3ECF3]">FL390 • 482 KT</span>
                    </div>
                    <div className="bg-white dark:bg-[#101E2B] p-2 rounded border border-[#D6E0E7] dark:border-[#2D4B63] flex items-center justify-between">
                      <span className="text-[#82909B] dark:text-[#8DB7D5]">DLH400 (FRA→ORD)</span>
                      <span className="font-bold text-[#467A67]">FL340 • 450 KT</span>
                    </div>
                  </div>

                  {/* Explore Button */}
                  <div className="mt-3 pt-3 border-t border-[#D6E0E7] dark:border-[#2D4B63] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#82909B] dark:text-[#8DB7D5]">
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

      {/* Runway Flight Divider */}
      <RunwayFlightDivider showAircraft={true} className="my-0" />

      {/* 3. Three Simple Steps Section: Editorial Workflow */}
      <section id="how-it-works" className="py-16 bg-[#FCFAF5] dark:bg-[#101E2B] border-b border-[#D6E0E7] dark:border-[#2D4B63] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[11px] font-mono font-bold text-[#D87C43] tracking-widest uppercase block mb-1">
              OPERATIONAL WORKFLOW / PROTOCOL
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#172D40] dark:text-white tracking-tight">
              Learn How It Works
            </h2>
            <p className="mt-3 text-[#456D8B] dark:text-[#8DB7D5] text-sm sm:text-base leading-relaxed">
              Explore airspace anywhere in the world using three intuitive operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-white dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] rounded-xl p-6 relative hover:border-[#D87C43] transition shadow-2xs group">
              <div className="text-4xl font-mono font-black text-[#D6E0E7] dark:text-[#20394D] group-hover:text-[#D87C43]/20 transition absolute top-5 right-5">
                01
              </div>
              <div className="w-10 h-10 rounded bg-[#F4F0E7] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] flex items-center justify-center mb-5">
                <AirportPinIcon size={20} color="#D87C43" />
              </div>
              <h3 className="text-lg font-bold text-[#172D40] dark:text-[#E3ECF3] mb-2 font-mono">
                01 — Find your location.
              </h3>
              <p className="text-[#20394D]/80 dark:text-[#8DB7D5] text-xs sm:text-sm leading-relaxed">
                Search for an aerodrome, metropolitan center, or coordinate, or click directly on the interactive map to establish an airspace surveillance anchor.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] rounded-xl p-6 relative hover:border-[#D87C43] transition shadow-2xs group">
              <div className="text-4xl font-mono font-black text-[#D6E0E7] dark:text-[#20394D] group-hover:text-[#D87C43]/20 transition absolute top-5 right-5">
                02
              </div>
              <div className="w-10 h-10 rounded bg-[#F4F0E7] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] flex items-center justify-center mb-5">
                <FlightRouteIcon size={20} color="#456D8B" />
              </div>
              <h3 className="text-lg font-bold text-[#172D40] dark:text-[#E3ECF3] mb-2 font-mono">
                02 — Explore aircraft in view.
              </h3>
              <p className="text-[#20394D]/80 dark:text-[#8DB7D5] text-xs sm:text-sm leading-relaxed">
                Adjust your monitoring perimeter from 25 km to 250 km. Observe real-time aircraft positions, headings, and vertical rate trends in your sector.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] rounded-xl p-6 relative hover:border-[#D87C43] transition shadow-2xs group flex flex-col justify-between">
              <div>
                <div className="text-4xl font-mono font-black text-[#D6E0E7] dark:text-[#20394D] group-hover:text-[#D87C43]/20 transition absolute top-5 right-5">
                  03
                </div>
                <div className="w-10 h-10 rounded bg-[#F4F0E7] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] flex items-center justify-center mb-5">
                  <CommercialAircraftIcon size={20} color="#467A67" className="transform -rotate-45" />
                </div>
                <h3 className="text-lg font-bold text-[#172D40] dark:text-[#E3ECF3] mb-2 font-mono">
                  03 — Inspect available flight information.
                </h3>
                <p className="text-[#20394D]/80 dark:text-[#8DB7D5] text-xs sm:text-sm leading-relaxed mb-4">
                  Select any flight to view its navigation log: callsign, barometric altitude, true airspeed, heading bearing, squawk status, and waypoint breadcrumbs.
                </p>
              </div>
              <div className="flex justify-center pt-2 border-t border-[#D6E0E7]/60 dark:border-[#2D4B63]/60">
                <PaperFlightPlanIllustration width={130} height={100} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Runway Flight Divider */}
      <RunwayFlightDivider showAircraft={false} className="my-0" />

      {/* 4. Features Section: Aeronautical Chart Standards */}
      <section id="features" className="py-16 bg-[#F4F0E7] dark:bg-[#101E2B] border-b border-[#D6E0E7] dark:border-[#2D4B63] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[11px] font-mono font-bold text-[#D87C43] tracking-widest uppercase block mb-1">
              SYSTEM CAPABILITIES / INSTRUMENTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#172D40] dark:text-white tracking-tight">
              Aviation-Grade Precision &amp; Transparency
            </h2>
            <p className="mt-3 text-[#456D8B] dark:text-[#8DB7D5] text-sm sm:text-base leading-relaxed">
              Every interface element is crafted for clarity, dependable geospatial accuracy, and complete data integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#FCFAF5] dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] rounded-xl p-6 shadow-2xs hover:border-[#456D8B] transition">
              <div className="w-10 h-10 rounded bg-white dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] flex items-center justify-center mb-4 text-[#456D8B]">
                <GlobeNavigationIcon size={20} color="#456D8B" />
              </div>
              <h3 className="text-base font-bold text-[#172D40] dark:text-[#E3ECF3] mb-2 font-mono">
                Google Maps + OpenStreetMap
              </h3>
              <p className="text-[#20394D]/80 dark:text-[#8DB7D5] text-xs sm:text-sm leading-relaxed">
                Switch between official Google Maps (Roadmap, Satellite, Terrain, Hybrid) and OpenStreetMap tiles with zero watermarks or API lockouts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#FCFAF5] dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] rounded-xl p-6 shadow-2xs hover:border-[#456D8B] transition">
              <div className="w-10 h-10 rounded bg-white dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] flex items-center justify-center mb-4 text-[#D87C43]">
                <AirportPinIcon size={20} color="#D87C43" />
              </div>
              <h3 className="text-base font-bold text-[#172D40] dark:text-[#E3ECF3] mb-2 font-mono">
                Location-Driven Monitoring
              </h3>
              <p className="text-[#20394D]/80 dark:text-[#8DB7D5] text-xs sm:text-sm leading-relaxed">
                Search global aerodromes or click directly on any coordinate to establish a focused 25 to 250 km surveillance perimeter around your target.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#FCFAF5] dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] rounded-xl p-6 shadow-2xs hover:border-[#456D8B] transition">
              <div className="w-10 h-10 rounded bg-white dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] flex items-center justify-center mb-4 text-[#467A67]">
                <AltimeterIcon size={20} color="#467A67" />
              </div>
              <h3 className="text-base font-bold text-[#172D40] dark:text-[#E3ECF3] mb-2 font-mono">
                Pilot Dossier Telemetry
              </h3>
              <p className="text-[#20394D]/80 dark:text-[#8DB7D5] text-xs sm:text-sm leading-relaxed">
                Inspect callsign, country of origin, altitude in feet and meters, speed in knots, climb rate, and transponder codes with graceful fallbacks.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#FCFAF5] dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] rounded-xl p-6 shadow-2xs hover:border-[#456D8B] transition">
              <div className="w-10 h-10 rounded bg-white dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] flex items-center justify-center mb-4 text-[#456D8B]">
                <RadarBeaconIcon size={20} color="#456D8B" />
              </div>
              <h3 className="text-base font-bold text-[#172D40] dark:text-[#E3ECF3] mb-2 font-mono">
                Freshness Sweeps &amp; Zulu Time
              </h3>
              <p className="text-[#20394D]/80 dark:text-[#8DB7D5] text-xs sm:text-sm leading-relaxed">
                Automatic refresh intervals with data freshness badges, countdown sweeps, and friendly notifications when public cloud rates throttle.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#FCFAF5] dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] rounded-xl p-6 shadow-2xs hover:border-[#456D8B] transition">
              <div className="w-10 h-10 rounded bg-white dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] flex items-center justify-center mb-4 text-[#D87C43]">
                <FlightHistoryIcon size={20} color="#D87C43" />
              </div>
              <h3 className="text-base font-bold text-[#172D40] dark:text-[#E3ECF3] mb-2 font-mono">
                Recent Flight Breadcrumbs
              </h3>
              <p className="text-[#20394D]/80 dark:text-[#8DB7D5] text-xs sm:text-sm leading-relaxed">
                Visual flight trails track historical aircraft observations color-coded by altitude to illustrate flight trajectories and approach patterns.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#FCFAF5] dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] rounded-xl p-6 shadow-2xs hover:border-[#C94C4C] transition">
              <div className="w-10 h-10 rounded bg-white dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] flex items-center justify-center mb-4 text-[#C94C4C]">
                <AlertTriangle className="w-5 h-5 text-[#C94C4C]" />
              </div>
              <h3 className="text-base font-bold text-[#172D40] dark:text-[#E3ECF3] mb-2 font-mono">
                Emergency Squawk Filter
              </h3>
              <p className="text-[#20394D]/80 dark:text-[#8DB7D5] text-xs sm:text-sm leading-relaxed">
                Filter for emergency squawk codes (7700 general emergency, 7600 radio loss, 7500 unlawful interference) with high visual priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust and Transparency Section: OpenSky Network Policy */}
      <section id="coverage" className="py-16 bg-[#FCFAF5] dark:bg-[#101E2B] border-b border-[#D6E0E7] dark:border-[#2D4B63] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] rounded-xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded bg-[#F4F0E7] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] text-[#20394D]">
                  <ShieldCheck className="w-6 h-6 text-[#D87C43]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#172D40] dark:text-white font-mono">
                    Trust, Data Transparency &amp; API Policy
                  </h3>
                  <p className="text-xs text-[#82909B] dark:text-[#8DB7D5] font-mono">Adhering to OpenSky Network &amp; ADS-B Standards</p>
                </div>
              </div>
              <div className="hidden sm:block">
                <GlobeRouteIllustration size={72} />
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#20394D]/90 dark:text-[#D6E0E7] leading-relaxed">
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
              <div className="p-4 rounded bg-[#FCFAF5] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] space-y-2.5 text-xs font-mono">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#467A67] font-bold">•</span>
                  <span><strong>Data Honesty:</strong> Live flight data is never simulated behind your back. If the feed is delayed or interrupted, a clear plain-language status alert is presented immediately.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#D87C43] font-bold">•</span>
                  <span><strong>Cloud IP Policy &amp; Demonstration Flights:</strong> OpenSky Network officially restricts unauthenticated requests from cloud hosting platforms (Vercel/AWS). When restricted, our proxy catches the 504/timeout and provides a seamless option to continue exploring with demonstration flights.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#456D8B] dark:text-[#8DB7D5] font-bold">•</span>
                  <span><strong>Registered Credentials:</strong> OpenSky users can configure client credentials in deployment environment variables to query with authorized rate quotas.</span>
                </div>
              </div>

              {/* Stamps */}
              <div className="pt-2 flex flex-wrap gap-2">
                <AirportStampBadge code="OPENSKY-API" name="REST V1" variant="green" />
                <AirportStampBadge code="WGS-84" name="SPHEROID DATUM" variant="blue" />
                <AirportStampBadge code="ADS-B" name="1090 MHZ MODE S" variant="orange" />
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#D6E0E7] dark:border-[#2D4B63] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-[11px] font-mono text-[#82909B] dark:text-[#8DB7D5]">
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

      {/* 6. Footer: Publication Colophon with Aviation Emblem */}
      <footer id="about" className="mt-auto bg-[#20394D] dark:bg-[#0C1722] text-[#D6E0E7] py-12 text-xs font-mono transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <AviationEmblem size="sm" variant="badge" />
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
                <li>Design System: Custom Aviation Icons &amp; Illustrations</li>
                <li>Theme: Aviation Field Journal</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#172D40] dark:border-[#2D4B63] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#8DB7D5]">
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
