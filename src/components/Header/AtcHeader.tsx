import React, { useState, useEffect } from 'react';
import {
  Radio,
  Play,
  Pause,
  RotateCw,
  Clock,
  Menu,
  SlidersHorizontal,
  HelpCircle,
  X,
  Keyboard,
  Activity,
  ShieldCheck,
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
      <header className="bg-atc-950/95 border-b border-atc-700/80 px-3 md:px-5 py-2.5 flex items-center justify-between gap-3 text-slate-100 z-30 select-none backdrop-blur-md">
        {/* Station identification */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 rounded bg-atc-800 text-slate-300 hover:text-white border border-atc-700"
            aria-label="Toggle Navigation Sidebar"
          >
            {isSidebarOpen ? <SlidersHorizontal className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              <Radio className="w-4 h-4 animate-pulse" />
              <div className="absolute inset-0 rounded-lg border border-cyan-400/20 animate-ping pointer-events-none" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm md:text-base font-bold font-mono tracking-wider text-slate-100 uppercase">
                  AIR TRAFFIC CONTROL
                </h1>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-atc-800 border border-atc-700 text-cyan-400">
                  RADAR OPS
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <span className="text-slate-300 font-semibold">{currentRegion.name}</span>
                <span>•</span>
                <span className="text-slate-500">OPENSKY ADS-B</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: UTC Zulu & Local Dual Clock + Status */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Dual Clock */}
          <div className="flex items-center gap-3 px-3 py-1 rounded bg-atc-900 border border-atc-800 font-mono text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="tracking-widest font-semibold text-cyan-300">{utcTime || '00:00:00 Z'}</span>
              <span className="text-[10px] text-slate-500">UTC</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1 text-slate-400">
              <span className="tracking-widest font-mono">{localTime || '00:00:00'}</span>
              <span className="text-[10px] text-slate-500">LOC</span>
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
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-atc-900 border border-atc-800 text-xs font-mono">
            <span className="text-[10px] text-slate-400 uppercase">Rate:</span>
            <select
              value={pollingIntervalMs}
              onChange={(e) => setPollingInterval(Number(e.target.value))}
              className="bg-transparent text-cyan-300 focus:outline-none cursor-pointer text-xs"
              title="OpenSky Network rate limit allows 10s for anonymous, 5s for auth"
            >
              {ATC_CONFIG.POLLING_INTERVAL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-atc-900 text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Pause / Play Toggle */}
          <button
            onClick={togglePollingPause}
            className={`p-1.5 rounded border transition-colors ${
              isPollingPaused
                ? 'bg-amber-950/60 border-amber-600/50 text-amber-300 hover:bg-amber-900/60'
                : 'bg-atc-900 border-atc-800 text-slate-300 hover:text-white hover:bg-atc-800'
            }`}
            title={isPollingPaused ? 'Resume auto-refresh (Space)' : 'Pause auto-refresh (Space)'}
            aria-label={isPollingPaused ? 'Resume auto-refresh' : 'Pause auto-refresh'}
          >
            {isPollingPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Manual Refresh Button with Countdown Ring */}
          <button
            onClick={() => fetchAircraftSnapshot(true)}
            disabled={apiStatus.status === 'FETCHING'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 font-mono text-xs transition disabled:opacity-50"
            title="Manual radar sweep (R)"
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${
                apiStatus.status === 'FETCHING' ? 'animate-spin text-cyan-400' : ''
              }`}
            />
            <span className="hidden sm:inline">SWEEP</span>
            {!isPollingPaused && pollingIntervalMs > 0 && nextPollCountdown > 0 && (
              <span className="text-[10px] text-cyan-400/80 font-mono">
                ({nextPollCountdown}s)
              </span>
            )}
          </button>

          {/* Help / Shortcuts Dialog Toggle */}
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="p-1.5 rounded bg-atc-900 hover:bg-atc-800 border border-atc-800 text-slate-400 hover:text-cyan-400 transition"
            title="Shortcuts & Diagnostics (?)"
            aria-label="Shortcuts & Diagnostics"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Diagnostics & Keyboard Shortcuts Modal */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg p-5 rounded-lg bg-atc-900 border border-atc-700 shadow-2xl text-slate-200 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-atc-800 pb-2">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-cyan-300 uppercase tracking-wider">
                  ATC Operations Console Guide
                </h3>
              </div>
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-atc-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tactical Shortcuts */}
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block mb-2">
                Keyboard Shortcuts
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="flex items-center justify-between p-2 rounded bg-atc-950 border border-atc-800">
                  <span>Pause / Resume</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-atc-800 border border-atc-700 text-cyan-300 text-[10px]">
                    Space
                  </kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-atc-950 border border-atc-800">
                  <span>Manual Sweep</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-atc-800 border border-atc-700 text-cyan-300 text-[10px]">
                    R
                  </kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-atc-950 border border-atc-800">
                  <span>Close Inspector</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-atc-800 border border-atc-700 text-cyan-300 text-[10px]">
                    Esc
                  </kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-atc-950 border border-atc-800">
                  <span>Help & Diagnostics</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-atc-800 border border-atc-700 text-cyan-300 text-[10px]">
                    ?
                  </kbd>
                </div>
              </div>
            </div>

            {/* Diagnostics Panel */}
            <div className="border-t border-atc-800 pt-3">
              <span className="text-[10px] uppercase text-slate-400 font-bold block mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                System Diagnostics
              </span>
              <div className="space-y-1.5 p-2.5 rounded bg-atc-950 border border-atc-800 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">API Source:</span>
                  <span className="text-cyan-400 font-semibold">{apiStatus.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Connection State:</span>
                  <span className="text-slate-200">{apiStatus.status} ({apiStatus.freshness})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Round-trip Latency:</span>
                  <span className="text-emerald-400">{apiStatus.requestDurationMs ? `${apiStatus.requestDurationMs} ms` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Sector Bounds:</span>
                  <span className="text-slate-300">{activeBounds.lamin.toFixed(2)}°S, {activeBounds.lamax.toFixed(2)}°N, {activeBounds.lomin.toFixed(2)}°W, {activeBounds.lomax.toFixed(2)}°E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rate Limit Backoff:</span>
                  <span className={apiStatus.rateLimitBackoffUntil ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                    {apiStatus.rateLimitBackoffUntil ? 'Active' : 'Nominal (0s)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Aviation Security & Attribution Notice */}
            <div className="border-t border-atc-800 pt-2 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-cyan-500" />
                Vercel Serverless Ready
              </span>
              <span>OpenSky Network REST API</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
