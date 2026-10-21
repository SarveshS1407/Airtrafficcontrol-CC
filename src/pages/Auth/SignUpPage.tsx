import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  Radio,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { Link, useRouter } from '../../router/Router';
import { useAuthStore } from '../../store/useAuthStore';
import {
  AviationEmblem,
  AviationRefreshIcon,
} from '../../components/AviationDesignSystem';

export const SignUpPage: React.FC = () => {
  const { navigate } = useRouter();
  const { signUp, isLoading, authError, clearError } = useAuthStore();

  const [name, setName] = useState('');
  const [callsign, setCallsign] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!name.trim()) {
      setLocalError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (!agreedToTerms) {
      setLocalError('Please confirm the aviation data usage policy terms.');
      return;
    }

    const assignedCallsign = callsign.trim() || `ATC-${Math.floor(100 + Math.random() * 900)}`;
    const success = await signUp(name, assignedCallsign, email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  const activeError = localError || authError;

  return (
    <div className="min-h-screen bg-[#F4F0E7] dark:bg-[#101E2B] text-[#172D40] dark:text-[#E3ECF3] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative font-sans selection:bg-[#D87C43]/20 selection:text-[#172D40] transition-colors duration-200">
      {/* Background blueprint grid */}
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
            CONTROLLER REGISTRATION // REG-01
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#172D40] dark:text-white tracking-tight font-sans">
            Register Controller Profile
          </h2>
          <p className="mt-1 text-xs text-[#82909B] dark:text-[#8DB7D5] font-mono">
            Create an operational account to pin watchlists &amp; save custom airspace sectors
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-[#FCFAF5] dark:bg-[#172D40] border-2 border-[#D6E0E7] dark:border-[#2D4B63] py-8 px-6 sm:px-10 shadow-xl rounded-2xl">
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {activeError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2 animate-fadeIn font-mono">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{activeError}</span>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-mono font-bold text-[#82909B] dark:text-[#8DB7D5] uppercase tracking-wider mb-1"
              >
                Full Name
              </label>
              <div className="relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#82909B]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Capt. Sarah Connor"
                  className="block w-full pl-9 pr-3 py-2.5 bg-[#F4F0E7] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] rounded-xl text-[#172D40] dark:text-[#E3ECF3] placeholder-[#82909B] font-mono text-xs focus:outline-none focus:border-[#D87C43] transition"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Callsign Field */}
            <div>
              <label
                htmlFor="callsign"
                className="block text-xs font-mono font-bold text-[#82909B] dark:text-[#8DB7D5] uppercase tracking-wider mb-1"
              >
                ATC Callsign / Handle <span className="text-[#82909B] text-[10px] font-normal">(Optional)</span>
              </label>
              <div className="relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#82909B]">
                  <Radio className="w-4 h-4" />
                </div>
                <input
                  id="callsign"
                  type="text"
                  value={callsign}
                  onChange={(e) => setCallsign(e.target.value.toUpperCase())}
                  placeholder="TOWER-LEAD"
                  className="block w-full pl-9 pr-3 py-2.5 bg-[#F4F0E7] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] rounded-xl text-[#172D40] dark:text-[#E3ECF3] placeholder-[#82909B] font-mono text-xs focus:outline-none focus:border-[#D87C43] transition uppercase"
                  disabled={isLoading}
                />
              </div>
            </div>

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@skywatch.aero"
                  className="block w-full pl-9 pr-3 py-2.5 bg-[#F4F0E7] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] rounded-xl text-[#172D40] dark:text-[#E3ECF3] placeholder-[#82909B] font-mono text-xs focus:outline-none focus:border-[#D87C43] transition"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-mono font-bold text-[#82909B] dark:text-[#8DB7D5] uppercase tracking-wider mb-1"
              >
                Password <span className="text-[#82909B] text-[10px] font-normal">(Min 8 chars)</span>
              </label>
              <div className="relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#82909B]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
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

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-mono font-bold text-[#82909B] dark:text-[#8DB7D5] uppercase tracking-wider mb-1"
              >
                Confirm Password
              </label>
              <div className="relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#82909B]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-3 py-2.5 bg-[#F4F0E7] dark:bg-[#101E2B] border border-[#D6E0E7] dark:border-[#2D4B63] rounded-xl text-[#172D40] dark:text-[#E3ECF3] placeholder-[#82909B] font-mono text-xs focus:outline-none focus:border-[#D87C43] transition"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#82909B] dark:text-[#8DB7D5]">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[#D6E0E7] text-[#D87C43] focus:ring-0"
                />
                <span>
                  I agree to adhere to OpenSky Network ADS-B fair-usage policies and understand
                  session telemetry is for observation only.
                </span>
              </label>
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
                    <span>Creating Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 pt-4 border-t border-[#D6E0E7] dark:border-[#2D4B63] text-center text-xs text-[#82909B] dark:text-[#8DB7D5]">
            <span>Already have a controller profile? </span>
            <Link to="/signin" className="text-[#D87C43] hover:underline font-bold font-mono">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
