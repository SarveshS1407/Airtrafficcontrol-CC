import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  LogOut,
  Settings,
  Shield,
  Star,
  Radio,
  UserCheck,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAtcStore } from '../../store/useAtcStore';
import { useRouter, Link } from '../../router/Router';
import { UserAvatar } from './UserAvatar';
import {
  PilotWingsIcon,
  ThemeDayIcon,
  ThemeNightIcon,
  ThemeAutoIcon,
} from '../AviationDesignSystem';

interface AccountMenuProps {
  className?: string;
  align?: 'left' | 'right';
  compactOnMobile?: boolean;
}

export const AccountMenu: React.FC<AccountMenuProps> = ({
  className = '',
  align = 'right',
  compactOnMobile = true,
}) => {
  const { currentUser, isAuthenticated, signOut } = useAuthStore();
  const { themeMode, setThemeMode } = useAtcStore();
  const { navigate } = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Unauthenticated State: Clean CTA linking to /signin
  if (!isAuthenticated || !currentUser) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Link
          to="/signin"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FCFAF5] dark:bg-[#172D40] hover:bg-white dark:hover:bg-[#20394D] border border-[#D6E0E7] dark:border-[#2D4B63] hover:border-[#D87C43] text-[#172D40] dark:text-[#E3ECF3] text-xs font-mono font-bold transition shadow-2xs group"
        >
          <PilotWingsIcon size={14} color="#D87C43" />
          <span>Sign In</span>
        </Link>
      </div>
    );
  }

  const handleSignOut = () => {
    setIsOpen(false);
    signOut();
    navigate('/');
  };

  const handleNavigateSettings = () => {
    setIsOpen(false);
    navigate('/account');
  };

  // Safe fallback display names
  const displayName = currentUser.name || currentUser.callsign || 'Certified Controller';
  const displayEmail = currentUser.email || 'account@skywatch.aero';

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {/* Account Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Logged in as ${displayName} (${currentUser.callsign})`}
        className={`flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border transition-all shadow-2xs ${
          isOpen
            ? 'bg-[#EBF3FA] dark:bg-[#20394D] border-[#D87C43] ring-2 ring-[#D87C43]/20'
            : 'bg-[#FCFAF5] dark:bg-[#172D40] hover:bg-[#F4F0E7] dark:hover:bg-[#20394D] border-[#D6E0E7] dark:border-[#2D4B63]'
        }`}
        title={`Logged in as ${displayName} (${currentUser.callsign})`}
      >
        <UserAvatar user={currentUser} size="sm" showStatus={true} />

        <div className={`text-left ${compactOnMobile ? 'hidden sm:block' : 'block'}`}>
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-xs font-bold text-[#172D40] dark:text-white truncate max-w-[120px] font-sans">
              {displayName}
            </span>
            <span className="text-[9px] font-mono font-black text-[#D87C43] px-1 py-0.2 rounded bg-[#D87C43]/10 dark:bg-[#D87C43]/20">
              {currentUser.callsign}
            </span>
          </div>
          <span className="text-[10px] text-[#82909B] dark:text-[#8DB7D5] font-mono truncate max-w-[130px] block mt-0.5">
            {displayEmail}
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-[#82909B] dark:text-[#8DB7D5] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#D87C43]' : ''
          }`}
        />
      </button>

      {/* Account Popover Menu */}
      {isOpen && (
        <div
          role="menu"
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-2 w-72 sm:w-80 rounded-2xl bg-[#FCFAF5] dark:bg-[#101E2B] border-2 border-[#D6E0E7] dark:border-[#2D4B63] shadow-2xl z-50 text-[#172D40] dark:text-[#E3ECF3] font-sans overflow-hidden animate-fadeIn select-none`}
        >
          {/* 1. Account Dossier Overview */}
          <div className="p-4 bg-[#F4F0E7] dark:bg-[#172D40] border-b border-[#D6E0E7] dark:border-[#2D4B63]">
            <div className="flex items-start gap-3">
              <UserAvatar user={currentUser} size="lg" showStatus={true} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-mono font-bold text-[#D87C43] bg-[#D87C43]/10 dark:bg-[#D87C43]/20 px-1.5 py-0.5 rounded">
                    [{currentUser.callsign}]
                  </span>
                  <span className="text-[10px] font-mono text-[#467A67] bg-[#467A67]/10 dark:bg-[#467A67]/20 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    ONLINE
                  </span>
                </div>

                <h4 className="text-sm font-black text-[#172D40] dark:text-white mt-1 truncate">
                  {displayName}
                </h4>

                <p className="text-xs text-[#82909B] dark:text-[#8DB7D5] font-mono truncate">
                  {displayEmail}
                </p>

                <div className="mt-2 text-[10px] text-[#456D8B] dark:text-[#8DB7D5] font-mono bg-[#FCFAF5] dark:bg-[#101E2B] px-2 py-1 rounded border border-[#D6E0E7] dark:border-[#2D4B63] flex items-center justify-between">
                  <span className="truncate">{currentUser.role}</span>
                  <UserCheck className="w-3 h-3 text-[#467A67] shrink-0 ml-1" />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Primary Navigation & Settings */}
          <div className="p-2 border-b border-[#D6E0E7] dark:border-[#2D4B63] space-y-1">
            <button
              onClick={handleNavigateSettings}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium hover:bg-[#EBF3FA] dark:hover:bg-[#20394D] transition text-left"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#D87C43]" />
                <div className="flex flex-col">
                  <span className="font-bold text-[#172D40] dark:text-[#E3ECF3]">Profile &amp; Settings</span>
                  <span className="text-[10px] text-[#82909B] dark:text-[#8DB7D5] font-mono">
                    Edit dossier, callsign &amp; preferences
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#82909B] dark:text-[#8DB7D5]">/account</span>
            </button>
          </div>

          {/* 3. Appearance: Theme Mode Quick Controls */}
          <div className="p-3 border-b border-[#D6E0E7] dark:border-[#2D4B63] bg-[#FCFAF5] dark:bg-[#101E2B]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-[#82909B] dark:text-[#8DB7D5] uppercase tracking-wider">
                APPEARANCE MODE
              </span>
              <span className="text-[10px] font-mono text-[#D87C43] capitalize font-bold">
                {themeMode}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setThemeMode('light')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-mono transition border ${
                  themeMode === 'light'
                    ? 'bg-white text-[#D87C43] border-[#D87C43] font-bold shadow-2xs'
                    : 'bg-[#F4F0E7] dark:bg-[#172D40] text-[#172D40] dark:text-[#E3ECF3] border-[#D6E0E7] dark:border-[#2D4B63] hover:border-[#82909B]'
                }`}
              >
                <ThemeDayIcon size={12} />
                <span>Day</span>
              </button>

              <button
                onClick={() => setThemeMode('dark')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-mono transition border ${
                  themeMode === 'dark'
                    ? 'bg-[#172D40] text-[#D87C43] border-[#D87C43] font-bold shadow-2xs'
                    : 'bg-[#F4F0E7] dark:bg-[#172D40] text-[#172D40] dark:text-[#E3ECF3] border-[#D6E0E7] dark:border-[#2D4B63] hover:border-[#82909B]'
                }`}
              >
                <ThemeNightIcon size={12} />
                <span>Night</span>
              </button>

              <button
                onClick={() => setThemeMode('system')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-mono transition border ${
                  themeMode === 'system'
                    ? 'bg-white dark:bg-[#172D40] text-[#D87C43] border-[#D87C43] font-bold shadow-2xs'
                    : 'bg-[#F4F0E7] dark:bg-[#172D40] text-[#172D40] dark:text-[#E3ECF3] border-[#D6E0E7] dark:border-[#2D4B63] hover:border-[#82909B]'
                }`}
              >
                <ThemeAutoIcon size={12} />
                <span>Auto</span>
              </button>
            </div>
          </div>

          {/* 4. Security & Tactical Session Diagnostics */}
          <div className="p-3 border-b border-[#D6E0E7] dark:border-[#2D4B63] text-[11px] font-mono space-y-1.5 text-[#82909B] dark:text-[#8DB7D5]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-[#467A67]" />
                Auth Provider
              </span>
              <span className="font-bold text-[#172D40] dark:text-[#E3ECF3]">
                {currentUser.authProvider === 'demo' ? 'Evaluator Demo' : 'Password Auth'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Star className="w-3 h-3 text-[#C99B45]" />
                Pinned Watchlist
              </span>
              <span className="font-bold text-[#172D40] dark:text-[#E3ECF3]">
                {currentUser.watchlist.length} Aircraft
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-[#456D8B]" />
                Session Transponder
              </span>
              <span className="text-[#467A67] font-bold">ACTIVE</span>
            </div>
          </div>

          {/* 5. Sign Out Action */}
          <div className="p-2 bg-[#F4F0E7] dark:bg-[#172D40]">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-[#C94C4C] hover:text-red-600 dark:text-red-400 font-mono text-xs font-bold transition border border-red-200 dark:border-red-900/40"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Session</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
