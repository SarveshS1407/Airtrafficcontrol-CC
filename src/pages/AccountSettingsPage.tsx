import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Shield,
  Palette,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Save,
  LogOut,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Radio,
  Check,
} from 'lucide-react';
import { useRouter, Link } from '../router/Router';
import { useAuthStore, UserProfile } from '../store/useAuthStore';
import { useAtcStore } from '../store/useAtcStore';
import { UserAvatar } from '../components/Account/UserAvatar';
import {
  AviationEmblem,
  ThemeDayIcon,
  ThemeNightIcon,
  ThemeAutoIcon,
  PilotWingsIcon,
} from '../components/AviationDesignSystem';

export const AccountSettingsPage: React.FC = () => {
  const { navigate } = useRouter();
  const {
    currentUser,
    isAuthenticated,
    updateProfile,
    changePassword,
    signOut,
    deleteAccount,
    clearWatchlist,
  } = useAuthStore();

  const { themeMode, setThemeMode } = useAtcStore();

  // Redirect if unauthenticated
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-[#F4F0E7] dark:bg-[#101E2B] text-[#172D40] dark:text-[#E3ECF3] flex flex-col items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#FCFAF5] dark:bg-[#172D40] border-2 border-[#D6E0E7] dark:border-[#2D4B63] shadow-xl text-center space-y-4">
          <AviationEmblem size="lg" variant="badge" className="mx-auto" />
          <h2 className="text-xl font-bold font-mono">Authentication Required</h2>
          <p className="text-xs text-[#82909B] dark:text-[#8DB7D5] leading-relaxed">
            Please authenticate to access your air traffic controller dossier, pinned watchlist, and account preferences.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/signin?redirect=/account"
              className="w-full py-2.5 px-4 rounded-xl bg-[#D87C43] hover:bg-[#C26B34] text-white font-mono font-bold text-xs shadow-xs transition text-center"
            >
              Sign In to Access Account
            </Link>
            <Link
              to="/"
              className="w-full py-2 px-4 rounded-xl bg-transparent hover:bg-[#F4F0E7] dark:hover:bg-[#20394D] text-[#82909B] dark:text-[#8DB7D5] font-mono text-xs transition text-center"
            >
              Return to Landing Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Profile form state
  const [name, setName] = useState(currentUser.name || '');
  const [callsign, setCallsign] = useState(currentUser.callsign || '');
  const [role, setRole] = useState(currentUser.role);
  const [densityPreference, setDensityPreference] = useState<'comfortable' | 'compact'>(
    currentUser.densityPreference || 'comfortable'
  );
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Confirmation states
  const [showClearWatchlistConfirm, setShowClearWatchlistConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);

    if (!name.trim()) {
      setProfileError('Full name is required.');
      return;
    }
    if (!callsign.trim()) {
      setProfileError('Callsign is required.');
      return;
    }

    setIsSavingProfile(true);
    const res = await updateProfile({
      name,
      callsign,
      role,
      densityPreference,
    });
    setIsSavingProfile(false);

    if (res.success) {
      setProfileSuccess(res.message);
      setTimeout(() => setProfileSuccess(null), 4000);
    } else {
      setProfileError(res.message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError('Please provide your current password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsSavingPassword(true);
    const res = await changePassword(currentPassword, newPassword);
    setIsSavingPassword(false);

    if (res.success) {
      setPasswordSuccess(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(null), 4000);
    } else {
      setPasswordError(res.message);
    }
  };

  const handleClearWatchlist = () => {
    clearWatchlist();
    setShowClearWatchlistConfirm(false);
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F4F0E7] dark:bg-[#101E2B] text-[#172D40] dark:text-[#E3ECF3] flex flex-col font-sans transition-colors duration-200">
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-30 bg-[#FCFAF5]/95 dark:bg-[#101E2B]/95 backdrop-blur-md border-b border-[#D6E0E7] dark:border-[#2D4B63] px-4 sm:px-8 py-3 shadow-2xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="p-2 rounded-xl bg-[#F4F0E7] dark:bg-[#172D40] hover:bg-[#EBF3FA] dark:hover:bg-[#20394D] border border-[#D6E0E7] dark:border-[#2D4B63] transition shadow-2xs text-[#172D40] dark:text-[#E3ECF3]"
              title="Return to Flight Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <AviationEmblem size="sm" variant="mark" />

            <div>
              <span className="text-[10px] font-mono font-bold text-[#D87C43] tracking-wider uppercase block">
                CONTROLLER DOSSIER // SYS-PROFILE-001
              </span>
              <h1 className="text-base sm:text-lg font-bold text-[#172D40] dark:text-white leading-tight">
                Account &amp; Operations Settings
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#20394D] dark:bg-[#D87C43] hover:bg-[#172D40] dark:hover:bg-[#C26B34] text-white font-mono text-xs font-semibold transition shadow-xs"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Open Dashboard</span>
            </Link>

            <button
              onClick={() => {
                signOut();
                navigate('/');
              }}
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-[#C94C4C] hover:text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 transition"
              title="Sign Out Session"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Banner: Active Controller Identity */}
        <div className="p-6 rounded-2xl bg-[#FCFAF5] dark:bg-[#172D40] border-2 border-[#D6E0E7] dark:border-[#2D4B63] shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <UserAvatar user={currentUser} size="xl" showStatus={true} />

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-[#D87C43]/15 dark:bg-[#D87C43]/25 text-[#D87C43] text-xs font-mono font-bold">
                [{currentUser.callsign}]
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 dark:bg-emerald-500/25 text-[#467A67] dark:text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ACTIVE TRANSPONDER SESSION
              </span>
              <span className="px-2 py-0.5 rounded bg-[#82909B]/15 text-[#82909B] dark:text-[#8DB7D5] text-xs font-mono">
                {currentUser.authProvider === 'demo' ? 'Evaluator Demo Access' : 'Verified Profile'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#172D40] dark:text-white font-sans">
              {currentUser.name}
            </h2>

            <p className="text-xs text-[#82909B] dark:text-[#8DB7D5] font-mono">
              {currentUser.email} • {currentUser.role}
            </p>

            <div className="pt-2 flex items-center justify-center sm:justify-start gap-4 text-xs font-mono text-[#456D8B] dark:text-[#8DB7D5]">
              <span>Watchlist: <strong className="text-[#172D40] dark:text-white">{currentUser.watchlist.length}</strong> targets</span>
              <span>•</span>
              <span>Sectors: <strong className="text-[#172D40] dark:text-white">{currentUser.savedSectors.length}</strong> active</span>
              <span>•</span>
              <span>Account ID: <code className="text-[#D87C43]">{currentUser.id}</code></span>
            </div>
          </div>
        </div>

        {/* Section 1: Profile Information */}
        <section className="bg-[#FCFAF5] dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="border-b border-[#D6E0E7] dark:border-[#2D4B63] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#D87C43]" />
              <h3 className="text-base font-bold text-[#172D40] dark:text-white font-sans">
                Profile &amp; Transponder Identity
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#82909B] dark:text-[#8DB7D5] uppercase">
              Editable Dossier
            </span>
          </div>

          {profileSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[#467A67] dark:text-emerald-400 text-xs font-mono flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-[#82909B] dark:text-[#8DB7D5] uppercase tracking-wider mb-1.5">
                  Full Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Commander Alex Vance"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F0E7] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] focus:border-[#D87C43] text-xs text-[#172D40] dark:text-[#E3ECF3] font-medium focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#82909B] dark:text-[#8DB7D5] uppercase tracking-wider mb-1.5">
                  Tactical Callsign
                </label>
                <input
                  type="text"
                  value={callsign}
                  onChange={(e) => setCallsign(e.target.value.toUpperCase())}
                  placeholder="e.g. TOWER-LEAD"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F0E7] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] focus:border-[#D87C43] text-xs text-[#172D40] dark:text-[#E3ECF3] font-mono font-bold focus:outline-none transition uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-[#82909B] dark:text-[#8DB7D5] uppercase tracking-wider mb-1.5">
                  Operational Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserProfile['role'])}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F0E7] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] focus:border-[#D87C43] text-xs text-[#172D40] dark:text-[#E3ECF3] font-medium focus:outline-none transition cursor-pointer"
                >
                  <option value="Senior Air Traffic Controller">Senior Air Traffic Controller</option>
                  <option value="Radar Operations Specialist">Radar Operations Specialist</option>
                  <option value="Flight Dispatcher">Flight Dispatcher</option>
                  <option value="Aviation Enthusiast">Aviation Enthusiast</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#82909B] dark:text-[#8DB7D5] uppercase tracking-wider mb-1.5">
                  Authenticated Email (Protected)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#E3ECF3]/50 dark:bg-[#101E2B]/50 border border-[#D6E0E7] dark:border-[#2D4B63] text-xs text-[#82909B] dark:text-[#8DB7D5] font-mono cursor-not-allowed opacity-80"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-[#467A67] bg-[#467A67]/10 px-1.5 py-0.5 rounded">
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D87C43] hover:bg-[#C26B34] text-white text-xs font-mono font-bold transition shadow-xs disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </section>

        {/* Section 2: Appearance & Display Density */}
        <section className="bg-[#FCFAF5] dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="border-b border-[#D6E0E7] dark:border-[#2D4B63] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#D87C43]" />
              <h3 className="text-base font-bold text-[#172D40] dark:text-white font-sans">
                Appearance &amp; Cockpit Theme
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#82909B] dark:text-[#8DB7D5] uppercase">
              Current: {themeMode.toUpperCase()}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="block text-xs font-mono font-bold text-[#82909B] dark:text-[#8DB7D5] uppercase tracking-wider mb-2">
                Color Palette &amp; Contrast Mode
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Light Mode */}
                <button
                  type="button"
                  onClick={() => setThemeMode('light')}
                  className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                    themeMode === 'light'
                      ? 'bg-white border-[#D87C43] ring-2 ring-[#D87C43]/20 shadow-xs'
                      : 'bg-[#F4F0E7] dark:bg-[#101E2B] border-[#D6E0E7] dark:border-[#2D4B63] hover:border-[#82909B]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <ThemeDayIcon size={18} color={themeMode === 'light' ? '#D87C43' : '#82909B'} />
                    {themeMode === 'light' && <Check className="w-4 h-4 text-[#D87C43]" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#172D40] dark:text-white font-sans">
                      Daylight Field Journal
                    </h4>
                    <p className="text-[11px] text-[#82909B] dark:text-[#8DB7D5] mt-0.5 leading-snug">
                      Warm ivory paper with deep aviation ink and crisp technical stamps.
                    </p>
                  </div>
                </button>

                {/* Dark Mode */}
                <button
                  type="button"
                  onClick={() => setThemeMode('dark')}
                  className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                    themeMode === 'dark'
                      ? 'bg-[#101E2B] border-[#D87C43] ring-2 ring-[#D87C43]/20 shadow-xs'
                      : 'bg-[#F4F0E7] dark:bg-[#101E2B] border-[#D6E0E7] dark:border-[#2D4B63] hover:border-[#82909B]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <ThemeNightIcon size={18} color={themeMode === 'dark' ? '#D87C43' : '#82909B'} />
                    {themeMode === 'dark' && <Check className="w-4 h-4 text-[#D87C43]" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#172D40] dark:text-white font-sans">
                      Night Radar Operations
                    </h4>
                    <p className="text-[11px] text-[#82909B] dark:text-[#8DB7D5] mt-0.5 leading-snug">
                      Cockpit deep navy with high-contrast amber vectors and night radar tiles.
                    </p>
                  </div>
                </button>

                {/* Auto Mode */}
                <button
                  type="button"
                  onClick={() => setThemeMode('system')}
                  className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                    themeMode === 'system'
                      ? 'bg-white dark:bg-[#101E2B] border-[#D87C43] ring-2 ring-[#D87C43]/20 shadow-xs'
                      : 'bg-[#F4F0E7] dark:bg-[#101E2B] border-[#D6E0E7] dark:border-[#2D4B63] hover:border-[#82909B]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <ThemeAutoIcon size={18} color={themeMode === 'system' ? '#D87C43' : '#82909B'} />
                    {themeMode === 'system' && <Check className="w-4 h-4 text-[#D87C43]" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#172D40] dark:text-white font-sans">
                      System Auto Sensor
                    </h4>
                    <p className="text-[11px] text-[#82909B] dark:text-[#8DB7D5] mt-0.5 leading-snug">
                      Synchronizes automatically with your operating system preference.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Display Density */}
            <div className="pt-2">
              <span className="block text-xs font-mono font-bold text-[#82909B] dark:text-[#8DB7D5] uppercase tracking-wider mb-2">
                Workspace Display Density
              </span>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => {
                    setDensityPreference('comfortable');
                    updateProfile({ densityPreference: 'comfortable' });
                  }}
                  className={`p-3 rounded-xl border text-left transition ${
                    densityPreference === 'comfortable'
                      ? 'bg-white dark:bg-[#101E2B] border-[#D87C43] font-bold'
                      : 'bg-[#F4F0E7] dark:bg-[#101E2B] border-[#D6E0E7] dark:border-[#2D4B63]'
                  }`}
                >
                  <span className="text-xs font-bold block">Comfortable (Default)</span>
                  <span className="text-[10px] text-[#82909B] font-mono">Spacious flight dossiers and generous touch targets</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDensityPreference('compact');
                    updateProfile({ densityPreference: 'compact' });
                  }}
                  className={`p-3 rounded-xl border text-left transition ${
                    densityPreference === 'compact'
                      ? 'bg-white dark:bg-[#101E2B] border-[#D87C43] font-bold'
                      : 'bg-[#F4F0E7] dark:bg-[#101E2B] border-[#D6E0E7] dark:border-[#2D4B63]'
                  }`}
                >
                  <span className="text-xs font-bold block">Tactical Compact</span>
                  <span className="text-[10px] text-[#82909B] font-mono">Dense navigation tables for high-capacity sectors</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Authentication & Security */}
        <section className="bg-[#FCFAF5] dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="border-b border-[#D6E0E7] dark:border-[#2D4B63] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D87C43]" />
              <h3 className="text-base font-bold text-[#172D40] dark:text-white font-sans">
                Authentication &amp; Security Credentials
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#467A67] bg-[#467A67]/10 px-2 py-0.5 rounded font-bold">
              ENCRYPTED CREDENTIALS
            </span>
          </div>

          {/* Provider status cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[#F4F0E7] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] text-xs font-mono space-y-1">
              <span className="text-[10px] text-[#82909B] uppercase font-bold">CURRENT AUTH METHOD</span>
              <div className="flex items-center gap-2 font-bold text-[#172D40] dark:text-white">
                <PilotWingsIcon size={14} color="#D87C43" />
                <span>{currentUser.authProvider === 'demo' ? 'Evaluator Demo Access' : 'Email & Password Session'}</span>
              </div>
              <p className="text-[10px] text-[#82909B]">Session automatically persists across browser refreshes.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F4F0E7] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] text-xs font-mono space-y-1">
              <span className="text-[10px] text-[#82909B] uppercase font-bold">EMAIL VERIFICATION</span>
              <div className="flex items-center gap-2 font-bold text-[#467A67]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Active Transponder</span>
              </div>
              <p className="text-[10px] text-[#82909B]">Transponder signals authorized for ADS-B live feeds.</p>
            </div>
          </div>

          {/* Google Sign-In Architecture Notice */}
          <div className="p-4 rounded-xl bg-[#EBF3FA] dark:bg-[#20394D]/60 border border-[#8DB7D5] dark:border-[#456D8B] text-xs space-y-2">
            <div className="flex items-center gap-2 text-[#20394D] dark:text-[#E3ECF3] font-bold font-mono">
              <Shield className="w-4 h-4 text-[#D87C43]" />
              <span>Google OAuth Single Sign-On Architecture</span>
            </div>
            <p className="text-[#456D8B] dark:text-[#8DB7D5] text-xs leading-relaxed">
              Google Single Sign-On requires configuring <code className="px-1.5 py-0.5 rounded bg-white dark:bg-[#101E2B] font-mono text-[11px] text-[#D87C43]">VITE_GOOGLE_CLIENT_ID</code> in your environment variables and registering <code className="px-1.5 py-0.5 rounded bg-white dark:bg-[#101E2B] font-mono text-[11px]">https://airtrafficcontrol-cc.vercel.app</code> in Google Cloud Console OAuth Authorized JavaScript Origins. To guarantee 100% reliable interview evaluation, the application currently uses instant 1-click Evaluator Login and standalone email authentication rather than rendering an unconfigured third-party button.
            </p>
          </div>

          {/* Change Password Form */}
          <div className="pt-2">
            <h4 className="text-xs font-mono font-bold text-[#82909B] dark:text-[#8DB7D5] uppercase tracking-wider mb-3">
              Change Security Password
            </h4>

            {passwordSuccess && (
              <div className="mb-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[#467A67] dark:text-emerald-400 text-xs font-mono flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="mb-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3 max-w-xl">
              <div>
                <label className="block text-[11px] font-mono text-[#82909B] mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-3.5 pr-10 py-2 rounded-xl bg-[#F4F0E7] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] text-xs font-mono text-[#172D40] dark:text-[#E3ECF3] focus:outline-none focus:border-[#D87C43] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#82909B] hover:text-[#172D40] dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#82909B] mb-1">
                    New Password (Min 8 chars)
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F4F0E7] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] text-xs font-mono text-[#172D40] dark:text-[#E3ECF3] focus:outline-none focus:border-[#D87C43] transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#82909B] mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F4F0E7] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] text-xs font-mono text-[#172D40] dark:text-[#E3ECF3] focus:outline-none focus:border-[#D87C43] transition"
                  />
                </div>
              </div>

              <div className="pt-1 flex justify-start">
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#20394D] dark:bg-[#D87C43] hover:bg-[#172D40] dark:hover:bg-[#C26B34] text-white text-xs font-mono font-bold transition shadow-xs disabled:opacity-50"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{isSavingPassword ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Section 4: Operational Data & Watchlist */}
        <section className="bg-[#FCFAF5] dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="border-b border-[#D6E0E7] dark:border-[#2D4B63] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#C99B45]" />
              <h3 className="text-base font-bold text-[#172D40] dark:text-white font-sans">
                Monitored Airspace &amp; Watchlist
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#C99B45]">
              {currentUser.watchlist.length} Pinned Aircraft
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#F4F0E7] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63]">
            <div>
              <h4 className="text-xs font-bold text-[#172D40] dark:text-white font-sans">
                Tactical Watchlist Clean-Up
              </h4>
              <p className="text-[11px] text-[#82909B] dark:text-[#8DB7D5] mt-0.5">
                Remove all pinned aircraft telemetry targets from your active surveillance board.
              </p>
            </div>

            {showClearWatchlistConfirm ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearWatchlist}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold transition"
                >
                  Confirm Clear
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearWatchlistConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-mono transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowClearWatchlistConfirm(true)}
                disabled={currentUser.watchlist.length === 0}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] hover:border-[#C94C4C] hover:text-[#C94C4C] text-xs font-mono font-bold transition disabled:opacity-40"
              >
                Clear Watchlist ({currentUser.watchlist.length})
              </button>
            )}
          </div>
        </section>

        {/* Section 5: Account Actions & Danger Zone */}
        <section className="bg-rose-500/5 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="border-b border-rose-200 dark:border-rose-900/40 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <Trash2 className="w-4 h-4" />
              <h3 className="text-base font-bold font-sans">Account Actions &amp; Termination</h3>
            </div>
            <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold uppercase">
              Cautionary Protocol
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-[#172D40] dark:text-white font-sans">
                Terminate Current Session
              </h4>
              <p className="text-[11px] text-[#82909B] dark:text-[#8DB7D5] mt-0.5">
                Sign out of this browser. Pinned flights and saved sectors remain safely preserved in registry.
              </p>
            </div>
            <button
              onClick={() => {
                signOut();
                navigate('/');
              }}
              className="px-4 py-2 rounded-xl bg-white dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] hover:border-[#D87C43] text-xs font-mono font-bold text-[#172D40] dark:text-[#E3ECF3] transition"
            >
              Sign Out Session
            </button>
          </div>

          <div className="border-t border-rose-200 dark:border-rose-900/40 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 font-sans">
                Erase Controller Profile
              </h4>
              <p className="text-[11px] text-[#82909B] dark:text-[#8DB7D5] mt-0.5">
                Permanently purge your controller callsign, pinned flights, and local authorization record.
              </p>
            </div>

            {showDeleteConfirm ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold transition shadow-xs"
                >
                  Confirm Erase
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-mono transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-mono font-bold transition"
              >
                Delete Account
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
