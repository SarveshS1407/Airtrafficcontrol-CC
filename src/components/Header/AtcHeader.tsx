import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
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
import {
  AviationEmblem,
  AviationRefreshIcon,
  ThemeDayIcon,
  ThemeNightIcon,
  ThemeAutoIcon,
} from '../AviationDesignSystem';
import { AccountMenu } from '../Account/AccountMenu';

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
    themeMode,
    setThemeMode,
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
      <header className="bg-[#FCFAF5] dark:bg-[#101E2B] border-b border-[#D6E0E7] dark:border-[#2D4B63] px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3 text-[#172D40] dark:text-[#E3ECF3] z-20 select-none shadow-2xs transition-colors">
        {/* Left: Editorial Header with Aviation Emblem & Technical Stamp */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl bg-[#F4F0E7] dark:bg-[#172D40] hover:bg-[#EBF3FA] dark:hover:bg-[#20394D] text-[#172D40] dark:text-[#E3ECF3] border border-[#D6E0E7] dark:border-[#2D4B63] transition shadow-2xs"
            aria-label="Toggle Navigation Sidebar"
          >
            {isSidebarOpen ? <SlidersHorizontal className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <div className="hidden sm:block">
            <AviationEmblem size="sm" variant="badge" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#D87C43] font-mono font-bold uppercase tracking-wider tech-stamp">
                FLIGHT OPERATIONS / {currentRegion.id === 'global' ? 'GLOBAL VIEW' : currentRegion.name.toUpperCase()}
              </span>
              <span className="hidden sm:inline-block text-[#D6E0E7] dark:text-[#2D4B63]">•</span>
              <span className="hidden sm:inline-block text-[10px] font-mono text-[#82909B] dark:text-[#8DB7D5]">
                DOC-ATC-001
              </span>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-[#172D40] dark:text-white tracking-tight font-sans">
                Air Traffic Explorer
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#EBF3FA] dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] text-[#20394D] dark:text-[#8DB7D5]">
                {currentRegion.name}
              </span>
            </div>
            <p className="text-xs text-[#82909B] dark:text-[#8DB7D5] hidden sm:block">
              Explore aircraft positions across the world and inspect available flight information.
            </p>
          </div>
        </div>

        {/* Middle: UTC Zulu & Local Dual Clock + Status */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Dual Clock */}
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#F4F0E7] dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] font-mono text-xs text-[#172D40] dark:text-[#E3ECF3]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D87C43]" />
              <span className="tracking-wide font-bold">{utcTime || '00:00:00 Z'}</span>
              <span className="text-[10px] text-[#82909B] dark:text-[#8DB7D5]">UTC</span>
            </div>
            <span className="text-[#D6E0E7] dark:text-[#2D4B63]">|</span>
            <div className="flex items-center gap-1 text-[#82909B] dark:text-[#8DB7D5]">
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

          {/* Theme Mode Toggle (Light / Dark / System) */}
          <div className="flex items-center rounded-xl bg-[#F4F0E7] dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] p-0.5 shadow-2xs">
            <button
              onClick={() => setThemeMode('light')}
              className={`p-1.5 rounded-lg transition-all ${
                themeMode === 'light'
                  ? 'bg-white dark:bg-[#20394D] text-[#D87C43] shadow-xs'
                  : 'text-[#82909B] hover:text-[#172D40] dark:text-[#8DB7D5] dark:hover:text-white'
              }`}
              title="Daylight Field Journal Theme"
              aria-label="Daylight Field Journal Theme"
            >
              <ThemeDayIcon size={14} />
            </button>
            <button
              onClick={() => setThemeMode('dark')}
              className={`p-1.5 rounded-lg transition-all ${
                themeMode === 'dark'
                  ? 'bg-[#101E2B] text-[#D87C43] shadow-xs'
                  : 'text-[#82909B] hover:text-[#172D40] dark:text-[#8DB7D5] dark:hover:text-white'
              }`}
              title="Night Radar Operations Theme"
              aria-label="Night Radar Operations Theme"
            >
              <ThemeNightIcon size={14} />
            </button>
            <button
              onClick={() => setThemeMode('system')}
              className={`p-1.5 rounded-lg transition-all ${
                themeMode === 'system'
                  ? 'bg-white dark:bg-[#101E2B] text-[#D87C43] shadow-xs'
                  : 'text-[#82909B] hover:text-[#172D40] dark:text-[#8DB7D5] dark:hover:text-white'
              }`}
              title="System Auto Sensor"
              aria-label="System Auto Sensor"
            >
              <ThemeAutoIcon size={14} />
            </button>
          </div>

          {/* Polling Interval Selector */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#F4F0E7] dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] text-xs">
            <span className="text-[11px] text-[#82909B] dark:text-[#8DB7D5] font-mono">RATE:</span>
            <select
              value={pollingIntervalMs}
              onChange={(e) => setPollingInterval(Number(e.target.value))}
              className="bg-transparent text-[#172D40] dark:text-[#E3ECF3] font-bold font-mono focus:outline-none cursor-pointer text-xs"
              title="OpenSky Network rate limit allows 10s for anonymous, 5s for auth"
            >
              {ATC_CONFIG.POLLING_INTERVAL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#FCFAF5] dark:bg-[#172D40] text-[#172D40] dark:text-[#E3ECF3]">
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
                ? 'bg-amber-100 border-[#C99B45] text-[#C99B45] hover:bg-amber-200/70'
                : 'bg-[#F4F0E7] dark:bg-[#172D40] border-[#D6E0E7] dark:border-[#2D4B63] text-[#172D40] dark:text-[#E3ECF3] hover:bg-[#EBF3FA] dark:hover:bg-[#20394D]'
            }`}
            title={isPollingPaused ? 'Resume auto-refresh (Space)' : 'Pause auto-refresh (Space)'}
            aria-label={isPollingPaused ? 'Resume auto-refresh' : 'Pause auto-refresh'}
          >
            {isPollingPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Manual Refresh Button with Custom AviationRefreshIcon */}
          <button
            onClick={() => fetchAircraftSnapshot(true)}
            disabled={apiStatus.status === 'FETCHING'}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#20394D] dark:bg-[#D87C43] hover:bg-[#172D40] dark:hover:bg-[#C26B34] text-white text-xs font-semibold transition shadow-xs disabled:opacity-50"
            title="Manual sweep (R)"
          >
            <AviationRefreshIcon
              size={14}
              className={apiStatus.status === 'FETCHING' ? 'animate-spin' : ''}
            />
            <span className="hidden sm:inline">Sweep</span>
            {!isPollingPaused && pollingIntervalMs > 0 && nextPollCountdown > 0 && (
              <span className="text-[10px] text-[#8DB7D5] dark:text-white/80 font-mono">
                ({nextPollCountdown}s)
              </span>
            )}
          </button>

          {/* Help / Shortcuts Dialog Toggle */}
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="p-2 rounded-xl bg-[#F4F0E7] dark:bg-[#172D40] hover:bg-[#EBF3FA] dark:hover:bg-[#20394D] border border-[#D6E0E7] dark:border-[#2D4B63] text-[#82909B] dark:text-[#8DB7D5] hover:text-[#172D40] dark:hover:text-white transition shadow-2xs"
            title="Help & Diagnostics (?)"
            aria-label="Help & Diagnostics"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* Account Profile & Session Control */}
          <AccountMenu align="right" />
        </div>
      </header>

      {/* Diagnostics & Keyboard Shortcuts Modal */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172D40]/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[#FCFAF5] border border-[#D6E0E7] shadow-2xl text-[#172D40] font-sans text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D6E0E7] pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#D87C43]" />
                <h3 className="font-bold text-base text-[#172D40] tracking-tight font-sans">
                  Air Traffic Operations Field Manual
                </h3>
              </div>
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="text-[#82909B] hover:text-[#172D40] p-1 rounded-lg hover:bg-[#F4F0E7] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Keyboard Shortcuts */}
            <div>
              <span className="text-[10px] uppercase text-[#82909B] font-bold block mb-2 tech-stamp">
                Tactical Shortcuts
              </span>
              <div className="grid grid-cols-2 gap-2 text-[#172D40]">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F0E7] border border-[#D6E0E7]">
                  <span className="text-xs">Pause / Resume</span>
                  <kbd className="px-2 py-0.5 rounded-md bg-[#FCFAF5] border border-[#D6E0E7] text-[#172D40] text-[11px] font-mono shadow-2xs">
                    Space
                  </kbd>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F0E7] border border-[#D6E0E7]">
                  <span className="text-xs">Radar Sweep</span>
                  <kbd className="px-2 py-0.5 rounded-md bg-[#FCFAF5] border border-[#D6E0E7] text-[#172D40] text-[11px] font-mono shadow-2xs">
                    R
                  </kbd>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F0E7] border border-[#D6E0E7]">
                  <span className="text-xs">Close Inspector</span>
                  <kbd className="px-2 py-0.5 rounded-md bg-[#FCFAF5] border border-[#D6E0E7] text-[#172D40] text-[11px] font-mono shadow-2xs">
                    Esc
                  </kbd>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F0E7] border border-[#D6E0E7]">
                  <span className="text-xs">Field Guide</span>
                  <kbd className="px-2 py-0.5 rounded-md bg-[#FCFAF5] border border-[#D6E0E7] text-[#172D40] text-[11px] font-mono shadow-2xs">
                    ?
                  </kbd>
                </div>
              </div>
            </div>

            {/* Diagnostics Panel */}
            <div className="border-t border-[#D6E0E7] pt-3">
              <span className="text-[10px] uppercase text-[#82909B] font-bold block mb-2 flex items-center gap-1.5 tech-stamp">
                <Activity className="w-3.5 h-3.5 text-[#D87C43]" />
                Aviation Sensor Telemetry
              </span>
              <div className="space-y-2 p-3 rounded-xl bg-[#F4F0E7] border border-[#D6E0E7] text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#82909B]">Data Feed:</span>
                  <span className="text-[#172D40] font-bold">{apiStatus.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#82909B]">Connection Status:</span>
                  <span className="text-[#172D40] font-medium">{apiStatus.status} ({apiStatus.freshness})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#82909B]">Round-trip Latency:</span>
                  <span className="text-[#467A67] font-semibold">{apiStatus.requestDurationMs ? `${apiStatus.requestDurationMs} ms` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#82909B]">Active Sector Bounds:</span>
                  <span className="text-[#172D40] text-[11px]">{activeBounds.lamin.toFixed(2)}°S, {activeBounds.lamax.toFixed(2)}°N, {activeBounds.lomin.toFixed(2)}°W, {activeBounds.lomax.toFixed(2)}°E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#82909B]">Rate Limit Backoff:</span>
                  <span className={apiStatus.rateLimitBackoffUntil ? 'text-[#C94C4C] font-bold' : 'text-[#467A67] font-semibold'}>
                    {apiStatus.rateLimitBackoffUntil ? 'Active' : 'Nominal (0s)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Aviation Notice */}
            <div className="border-t border-[#D6E0E7] pt-3 flex items-center justify-between text-[11px] text-[#82909B]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#467A67]" />
                Live OpenSky Network ADS-B
              </span>
              <span className="font-mono text-[10px]">VERCEL-SERVERLESS-READY</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
