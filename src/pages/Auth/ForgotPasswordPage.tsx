import React, { useState } from 'react';
import {
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { Link } from '../../router/Router';
import { useAuthStore } from '../../store/useAuthStore';
import {
  AviationEmblem,
  AviationRefreshIcon,
} from '../../components/AviationDesignSystem';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuthStore();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid controller email address.');
      return;
    }

    setIsLoading(true);
    const res = await resetPassword(email);
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage(res.message);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F0E7] dark:bg-[#101E2B] text-[#172D40] dark:text-[#E3ECF3] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative font-sans selection:bg-[#D87C43]/20 selection:text-[#172D40] transition-colors duration-200">
      {/* Background blueprint grid */}
      <div className="absolute inset-0 blueprint-grid opacity-30 pointer-events-none" />

      {/* Back to Sign In Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/signin"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#456D8B] dark:text-[#8DB7D5] hover:text-[#172D40] dark:hover:text-white transition px-3 py-1.5 rounded-xl bg-[#FCFAF5] dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Logo & Emblem */}
        <div className="flex justify-center mb-4">
          <AviationEmblem size="lg" variant="badge" />
        </div>

        <div className="text-center">
          <span className="text-[10px] font-mono font-bold text-[#D87C43] tracking-wider uppercase block mb-1">
            SECURITY DISPATCH // RESET-AUTH
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#172D40] dark:text-white tracking-tight font-sans">
            Password Recovery
          </h2>
          <p className="mt-1 text-xs text-[#82909B] dark:text-[#8DB7D5] font-mono">
            Enter your registered email to receive an authorization link
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-[#FCFAF5] dark:bg-[#172D40] border-2 border-[#D6E0E7] dark:border-[#2D4B63] py-8 px-6 sm:px-10 shadow-xl rounded-2xl">
          {successMessage ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[#467A67] dark:text-emerald-400 text-xs font-mono flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Reset Instructions Dispatched</span>
                  <p className="text-[#20394D] dark:text-[#E3ECF3] leading-relaxed">{successMessage}</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/signin"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#D87C43] hover:bg-[#C26B34] text-white font-mono font-bold text-xs shadow-xs transition"
                >
                  <span>Return to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2 animate-fadeIn font-mono">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-mono font-bold text-[#82909B] dark:text-[#8DB7D5] uppercase tracking-wider mb-1"
                >
                  Registered Email
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#D87C43] hover:bg-[#C26B34] text-white font-mono font-bold text-xs tracking-wide shadow-xs transition disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <AviationRefreshIcon size={14} className="animate-spin" />
                      <span>Sending Instructions...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Recovery Link</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-[#D6E0E7] dark:border-[#2D4B63] text-center text-xs text-[#82909B] dark:text-[#8DB7D5]">
            <span>Remembered your password? </span>
            <Link to="/signin" className="text-[#D87C43] hover:underline font-bold font-mono">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
