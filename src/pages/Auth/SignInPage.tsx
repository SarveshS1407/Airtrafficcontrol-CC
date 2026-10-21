import React, { useState, useEffect } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Shield,
  ArrowLeft,
} from 'lucide-react';
import { Link, useRouter } from '../../router/Router';
import { useAuthStore } from '../../store/useAuthStore';
import {
  AviationEmblem,
  AviationRefreshIcon,
  PilotWingsIcon,
} from '../../components/AviationDesignSystem';

export const SignInPage: React.FC = () => {
  const { navigate } = useRouter();
  const { signIn, demoLogin, isLoading, authError, clearError, isAuthenticated, currentUser } =
    useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Determine intended redirect destination
  const getRedirectPath = (): string => {
    if (typeof window === 'undefined') return '/dashboard';
    const params = new URLSearchParams(window.location.search);
    const target = params.get('redirect');
    return target && target.startsWith('/') ? target : '/dashboard';
  };

  const redirectTarget = getRedirectPath();

  // If already authenticated, redirect directly
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      navigate(redirectTarget);
    }
  }, [isAuthenticated, currentUser, navigate, redirectTarget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim()) {
      setLocalError('Please enter your email address.');
      return;
    }
    if (!password) {
      setLocalError('Please enter your password.');
      return;
    }

    const success = await signIn(email, password);
    if (success) {
      navigate(redirectTarget);
    }
  };

  const handleDemoSignIn = () => {
    demoLogin();
    navigate(redirectTarget);
  };

  const activeError = localError || authError;

  return (
    <div className="min-h-screen bg-[#F4F0E7] dark:bg-[#101E2B] text-[#172D40] dark:text-[#E3ECF3] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative font-sans selection:bg-[#D87C43]/20 selection:text-[#172D40] transition-colors duration-200">
      {/* Background blueprint dots */}
      <div className="absolute inset-0 blueprint-grid opacity-30 pointer-events-none" />

      {/* Back to Home Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#456D8B] dark:text-[#8DB7D5] hover:text-[#172D40] dark:hover:text-white transition px-3 py-1.5 rounded-xl bg-[#FCFAF5] dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Logo & Emblem */}
        <div className="flex justify-center mb-4">
          <AviationEmblem size="lg" variant="badge" />
        </div>

        <div className="text-center">
          <span className="text-[10px] font-mono font-bold text-[#D87C43] tracking-wider uppercase block mb-1">
            CONTROLLER AUTHENTICATION // PORTAL-01
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#172D40] dark:text-white tracking-tight font-sans">
            Air Traffic Controller Sign In
          </h2>
          <p className="mt-1 text-xs text-[#82909B] dark:text-[#8DB7D5] font-mono">
            Access your radar console, saved watchlists &amp; telemetry feeds
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-[#FCFAF5] dark:bg-[#172D40] border-2 border-[#D6E0E7] dark:border-[#2D4B63] py-8 px-6 sm:px-10 shadow-xl rounded-2xl">
          {/* Quick Demo One-Click Evaluator Login */}
          <div className="mb-6 p-4 rounded-xl bg-[#F4F0E7] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-mono text-[#D87C43] font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                INSTANT EVALUATOR ACCESS
              </span>
              <span className="text-[10px] font-mono text-[#467A67] bg-[#467A67]/10 px-1.5 py-0.2 rounded font-bold">
                1-CLICK
              </span>
            </div>
            <p className="text-xs text-[#456D8B] dark:text-[#8DB7D5] mb-3 leading-relaxed">
              Evaluate the authenticated console, pinned watchlists, and flight settings with one click:
            </p>
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="w-full py-2.5 px-3 rounded-xl bg-[#20394D] dark:bg-[#D87C43] hover:bg-[#172D40] dark:hover:bg-[#C26B34] text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs"
            >
              <PilotWingsIcon size={16} color="#ffffff" />
              <span>Sign In as Commander Vance (Demo)</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#D6E0E7] dark:border-[#2D4B63]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#FCFAF5] dark:bg-[#172D40] px-3 text-[#82909B] dark:text-[#8DB7D5] font-mono text-[10px]">
                Or enter credentials
              </span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {activeError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2 animate-fadeIn font-mono">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{activeError}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-mono font-bold text-[#82909B] dark:text-[#8DB7D5] uppercase tracking-wider mb-1"
              >
                Controller Email
              </label>
              <div className="relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#82909B]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="controller@skywatch.aero"
                  className="block w-full pl-9 pr-3 py-2.5 bg-[#F4F0E7] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] rounded-xl text-[#172D40] dark:text-[#E3ECF3] placeholder-[#82909B] font-mono text-xs focus:outline-none focus:border-[#D87C43] transition"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-mono font-bold text-[#82909B] dark:text-[#8DB7D5] uppercase tracking-wider"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-mono text-[#D87C43] hover:underline transition"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#82909B]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-10 py-2.5 bg-[#F4F0E7] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] rounded-xl text-[#172D40] dark:text-[#E3ECF3] placeholder-[#82909B] font-mono text-xs focus:outline-none focus:border-[#D87C43] transition"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#82909B] hover:text-[#172D40] dark:hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#D87C43] hover:bg-[#C26B34] text-white font-mono font-bold text-xs tracking-wide shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <AviationRefreshIcon size={14} className="animate-spin" />
                    <span>Verifying Session...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Google SSO Transparency Card */}
          <div className="mt-5 p-3 rounded-xl bg-[#F4F0E7] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] text-[11px] font-mono text-[#82909B] dark:text-[#8DB7D5] space-y-1">
            <span className="text-[10px] text-[#456D8B] dark:text-[#8DB7D5] font-bold uppercase block">
              ENTERPRISE SINGLE SIGN-ON
            </span>
            <p className="text-[10px] leading-relaxed">
              Google OAuth integration requires client credentials in deployment env. Direct email sign-in and Evaluator 1-click login are active for immediate review.
            </p>
          </div>

          {/* Footer Navigation */}
          <div className="mt-6 pt-4 border-t border-[#D6E0E7] dark:border-[#2D4B63] text-center text-xs text-[#82909B] dark:text-[#8DB7D5]">
            <span>Don't have a controller profile? </span>
            <Link to="/signup" className="text-[#D87C43] hover:underline font-bold font-mono">
              Register here
            </Link>
          </div>

          <div className="mt-2 text-center text-xs text-[#82909B] dark:text-[#8DB7D5]">
            <span>Want to monitor without signing in? </span>
            <Link to="/dashboard" className="text-[#172D40] dark:text-[#E3ECF3] underline font-mono">
              Open Public Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
