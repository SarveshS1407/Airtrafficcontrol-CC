import React, { useState } from 'react';
import {
  Radar,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  KeyRound,
  Shield,
  ArrowLeft,
} from 'lucide-react';
import { Link, useRouter } from '../../router/Router';
import { useAuthStore } from '../../store/useAuthStore';

export const SignInPage: React.FC = () => {
  const { navigate } = useRouter();
  const { signIn, demoLogin, isLoading, authError, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

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
      navigate('/dashboard');
    }
  };

  const handleDemoSignIn = () => {
    demoLogin();
    navigate('/dashboard');
  };

  const activeError = localError || authError;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background aesthetic grid & concentric rings */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />

      {/* Back to Home Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300 transition px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-xl shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Radar className="w-6 h-6 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </div>
        </div>

        <h2 className="text-center text-2xl font-extrabold text-white tracking-tight">
          Air Traffic Controller Sign In
        </h2>
        <p className="mt-2 text-center text-xs text-slate-400 font-mono">
          Access your radar console, saved watchlists & telemetry feeds
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 sm:px-10 shadow-2xl rounded-2xl">
          {/* Quick Demo One-Click Login */}
          <div className="mb-6 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                INSTANT EVALUATOR ACCESS
              </span>
              <span className="text-[10px] font-mono text-slate-400">Pre-seeded</span>
            </div>
            <p className="text-[11px] text-slate-300 mb-2.5">
              Evaluate the authenticated console, pinned watchlists, and flight settings with one click:
            </p>
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="w-full py-2 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-200 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Sign In as Commander Vance (Demo)</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-400 font-mono text-[10px]">
                Or enter credentials
              </span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {activeError && (
              <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2 animate-fadeIn font-mono">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{activeError}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1"
              >
                Controller Email
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="controller@skywatch.aero"
                  className="block w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-cyan-500 transition"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-mono text-slate-300 uppercase tracking-wider"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-10 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-cyan-500 transition"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
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
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-md shadow-cyan-500/25 transition disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Radar className="w-4 h-4 animate-spin" />
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

          {/* Footer Navigation */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>Don't have a controller profile? </span>
            <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold font-mono">
              Register here
            </Link>
          </div>

          <div className="mt-3 text-center text-xs text-slate-400">
            <span>Want to monitor without signing in? </span>
            <Link to="/dashboard" className="text-slate-300 hover:text-white underline font-mono">
              Open Public Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
