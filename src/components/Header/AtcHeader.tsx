import React, { useState, useEffect } from 'react';
import {
  Radio,
  Play,
  Pause,
  RotateCw,
  Clock,
  Menu,
  SlidersHorizontal,
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
    setDataSource,
    setPollingInterval,
    togglePollingPause,
    fetchAircraftSnapshot,
  } = useAtcStore();

  // UTC Zulu clock
  const [utcTime, setUtcTime] = useState<string>('');
  const [nextPollCountdown, setNextPollCountdown] = useState<number>(10);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${hours}:${minutes}:${seconds} Z`);
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
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

  return (
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
              <span className="text-slate-500">OPENSKY API</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: UTC Clock & Status */}
      <div className="hidden lg:flex items-center gap-4">
        {/* UTC Zulu Digital Clock */}
        <div className="flex items-center gap-2 px-3 py-1 rounded bg-atc-900 border border-atc-800 font-mono text-xs text-slate-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="tracking-widest font-semibold text-cyan-300">{utcTime || '00:00:00 Z'}</span>
          <span className="text-[10px] text-slate-500">UTC</span>
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
          title={isPollingPaused ? 'Resume auto-refresh' : 'Pause auto-refresh'}
          aria-label={isPollingPaused ? 'Resume auto-refresh' : 'Pause auto-refresh'}
        >
          {isPollingPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>

        {/* Manual Refresh Button with Countdown Ring */}
        <button
          onClick={() => fetchAircraftSnapshot(true)}
          disabled={apiStatus.status === 'FETCHING'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 font-mono text-xs transition disabled:opacity-50"
          title="Manual radar sweep"
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
      </div>
    </header>
  );
};
