import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCw,
  Clock,
  Menu,
  SlidersHorizontal,
  HelpCircle,
  X,
  Activity,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { useAtcStore } from '../../store/useAtcStore';
import { StatusBadge } from '../Common/StatusBadge';
import { ATC_CONFIG } from '../../constants/config';

interface AtcHeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const AtcHeader: React.FC<AtcHeaderProps> = ({
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const {
    apiStatus,
    pollingIntervalMs,
    isPollingPaused,
    currentRegion,
    activeBounds,
    setDataSource,
    setPollingInterval,
    togglePollingPause,
    fetchAircraftSnapshot,
  } = useAtcStore();

  const [utcTime, setUtcTime] = useState<string>('');
  const [localTime, setLocalTime] = useState<string>('');
  const [nextPollCountdown, setNextPollCountdown] = useState<number>(10);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  // UTC Zulu and Local clocks
  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      const zHours = String(now.getUTCHours()).padStart(2, '0');
      const zMinutes = String(now.getUTCMinutes()).padStart(2, '0');
      const zSeconds = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${zHours}:${zMinutes}:${zSeconds} Z`);

      const lHours = String(now.getHours()).padStart(2, '0');
      const lMinutes = String(now.getMinutes()).padStart(2, '0');
      const lSeconds = String(now.getSeconds()).padStart(2, '0');
      setLocalTime(`${lHours}:${lMinutes}:${lSeconds}`);
    };

    updateClocks();
    const timer = setInterval(updateClocks, 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll countdown animation
  useEffect(() => {
    if (isPollingPaused || pollingIntervalMs === 0) {
      setNextPollCountdown(0);
      return;
    }

    const intervalSec = Math.round(pollingIntervalMs / 1000);
    const tick = () => {
      const now = Date.now();
      const last = apiStatus.lastSuccessfulFetch ?? apiStatus.lastAttempt ?? now;
      const elapsed = Math.floor((now - last) / 1000);
      const remaining = Math.max(0, intervalSec - (elapsed % intervalSec));
      setNextPollCountdown(remaining);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [apiStatus, isPollingPaused, pollingIntervalMs]);

  // Keyboard shortcut for help modal (?)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        setIsHelpModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="bg-white/95 border-b border-aviation-border px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3 text-aviation-navy z-20 select-none shadow-2xs backdrop-blur-md">
        {/* Left: Heading and Subtitle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl bg-aviation-cloud hover:bg-slate-200 text-aviation-navy border border-aviation-border transition shadow-2xs"
            aria-label="Toggle Navigation Sidebar"
          >
            {isSidebarOpen ? <SlidersHorizontal className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-aviation-navy tracking-tight font-sans">
                Explore Live Flights
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-aviation-lightSky border border-blue-200 text-aviation-navy">
                {currentRegion.name}
              </span>
            </div>
            <p className="text-xs text-aviation-muted hidden sm:block">
              Browse aircraft worldwide or choose a location to explore nearby air traffic.
            </p>
          </div>
        </div>

        {/* Middle: UTC Zulu & Local Dual Clock + Status */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Dual Clock */}
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-aviation-cloud border border-aviation-border font-mono text-xs text-aviation-navy">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-aviation-sky" />
              <span className="tracking-wide font-semibold text-aviation-navy">{utcTime || '00:00:00 Z'}</span>
              <span className="text-[10px] text-aviation-muted">UTC</span>
            </div>
            <span className="text-aviation-border">|</span>
            <div className="flex items-center gap-1 text-aviation-muted">
              <span className="tracking-wide">{localTime || '00:00:00'}</span>
              <span className="text-[10px]">LOC</span>
            </div>
          </div>

          {/* Live / Demo Status Badge */}
          <StatusBadge
            apiStatus={apiStatus}
            isPaused={isPollingPaused}
            onToggleSource={setDataSource}
          />
        </div>

        {/* Right: Controls & Polling Actions */}
        <div className="flex items-center gap-2">
          <div className="lg:hidden">
            <StatusBadge
              apiStatus={apiStatus}
              isPaused={isPollingPaused}
              onToggleSource={setDataSource}
            />
          </div>

          {/* Polling Interval Selector */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-aviation-cloud border border-aviation-border text-xs">
            <span className="text-[11px] text-aviation-muted">Rate:</span>
            <select
              value={pollingIntervalMs}
              onChange={(e) => setPollingInterval(Number(e.target.value))}
              className="bg-transparent text-aviation-navy font-medium focus:outline-none cursor-pointer text-xs"
              title="OpenSky Network rate limit allows 10s for anonymous, 5s for auth"
            >
              {ATC_CONFIG.POLLING_INTERVAL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white text-aviation-navy">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Pause / Play Toggle */}
          <button
            onClick={togglePollingPause}
            className={`p-2 rounded-xl border transition-colors shadow-2xs ${
              isPollingPaused
                ? 'bg-amber-100 border-amber-300 text-aviation-amber hover:bg-amber-200/70'
                : 'bg-aviation-cloud border-aviation-border text-aviation-navy hover:bg-slate-200'
            }`}
            title={isPollingPaused ? 'Resume auto-refresh (Space)' : 'Pause auto-refresh (Space)'}
            aria-label={isPollingPaused ? 'Resume auto-refresh' : 'Pause auto-refresh'}
          >
            {isPollingPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Manual Refresh Button */}
          <button
            onClick={() => fetchAircraftSnapshot(true)}
            disabled={apiStatus.status === 'FETCHING'}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-aviation-navy hover:bg-aviation-midnight text-white text-xs font-medium transition shadow-xs disabled:opacity-50"
            title="Manual sweep (R)"
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${
                apiStatus.status === 'FETCHING' ? 'animate-spin' : ''
              }`}
            />
            <span className="hidden sm:inline">Refresh</span>
            {!isPollingPaused && pollingIntervalMs > 0 && nextPollCountdown > 0 && (
              <span className="text-[10px] text-aviation-sky">
                ({nextPollCountdown}s)
              </span>
            )}
          </button>

          {/* Help / Shortcuts Dialog Toggle */}
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="p-2 rounded-xl bg-aviation-cloud hover:bg-slate-200 border border-aviation-border text-aviation-muted hover:text-aviation-navy transition shadow-2xs"
            title="Help & Diagnostics (?)"
            aria-label="Help & Diagnostics"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Diagnostics & Keyboard Shortcuts Modal */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-white border border-aviation-border shadow-2xl text-aviation-slate font-sans text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-aviation-border pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-aviation-sky" />
                <h3 className="font-bold text-base text-aviation-navy tracking-tight">
                  Air Traffic Control Guide & Diagnostics
                </h3>
              </div>
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="text-aviation-muted hover:text-aviation-navy p-1 rounded-lg hover:bg-aviation-cloud transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Keyboard Shortcuts */}
            <div>
              <span className="text-xs uppercase text-aviation-muted font-bold block mb-2">
                Keyboard Shortcuts
              </span>
              <div className="grid grid-cols-2 gap-2 text-aviation-navy">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-aviation-cloud/70 border border-aviation-border">
                  <span className="text-xs">Pause / Resume</span>
                  <kbd className="px-2 py-0.5 rounded-md bg-white border border-aviation-border text-aviation-navy text-[11px] font-mono shadow-2xs">
                    Space
                  </kbd>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-aviation-cloud/70 border border-aviation-border">
                  <span className="text-xs">Refresh Data</span>
                  <kbd className="px-2 py-0.5 rounded-md bg-white border border-aviation-border text-aviation-navy text-[11px] font-mono shadow-2xs">
                    R
                  </kbd>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-aviation-cloud/70 border border-aviation-border">
                  <span className="text-xs">Close Inspector</span>
                  <kbd className="px-2 py-0.5 rounded-md bg-white border border-aviation-border text-aviation-navy text-[11px] font-mono shadow-2xs">
                    Esc
                  </kbd>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-aviation-cloud/70 border border-aviation-border">
                  <span className="text-xs">Help Guide</span>
                  <kbd className="px-2 py-0.5 rounded-md bg-white border border-aviation-border text-aviation-navy text-[11px] font-mono shadow-2xs">
                    ?
                  </kbd>
                </div>
              </div>
            </div>

            {/* Diagnostics Panel */}
            <div className="border-t border-aviation-border pt-3">
              <span className="text-xs uppercase text-aviation-muted font-bold block mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-aviation-sky" />
                System Diagnostics
              </span>
              <div className="space-y-2 p-3 rounded-xl bg-aviation-cloud/50 border border-aviation-border text-xs">
                <div className="flex justify-between">
                  <span className="text-aviation-muted">Data Source:</span>
                  <span className="text-aviation-navy font-semibold">{apiStatus.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-aviation-muted">Connection Status:</span>
                  <span className="text-aviation-navy font-medium">{apiStatus.status} ({apiStatus.freshness})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-aviation-muted">Round-trip Latency:</span>
                  <span className="text-aviation-green font-medium">{apiStatus.requestDurationMs ? `${apiStatus.requestDurationMs} ms` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-aviation-muted">Active Sector Bounds:</span>
                  <span className="text-aviation-navy font-mono text-[11px]">{activeBounds.lamin.toFixed(2)}°S, {activeBounds.lamax.toFixed(2)}°N, {activeBounds.lomin.toFixed(2)}°W, {activeBounds.lomax.toFixed(2)}°E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-aviation-muted">Rate Limit Backoff:</span>
                  <span className={apiStatus.rateLimitBackoffUntil ? 'text-aviation-red font-bold' : 'text-aviation-green font-medium'}>
                    {apiStatus.rateLimitBackoffUntil ? 'Active' : 'Nominal (0s)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Aviation Notice */}
            <div className="border-t border-aviation-border pt-3 flex items-center justify-between text-[11px] text-aviation-muted">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-aviation-green" />
                Live ADS-B Telemetry
              </span>
              <span>OpenSky Network REST API</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
