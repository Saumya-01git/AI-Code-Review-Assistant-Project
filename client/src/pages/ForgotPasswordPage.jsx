import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, KeyRound, ArrowRight, AlertCircle, CheckCircle2, Sparkles, Star } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to request reset token');

      setMessage('Reset token generated! Copy the token below to update your password.');
      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Password reset failed');

      setMessage('Password reset successful! You can now sign in.');
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f5] dark:bg-[#150b13] flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-tr from-[#E16F7C]/25 via-[#DD5E98]/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-bl from-[#CC4BC2]/25 via-[#C1AE7C]/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* Floating Stars */}
      <div className="absolute top-12 left-16 animate-star-shine pointer-events-none">
        <Star className="w-6 h-6 text-[#C1AE7C] fill-[#C1AE7C] drop-shadow-[0_0_12px_#C1AE7C]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] items-center justify-center shadow-xl shadow-[#DD5E98]/30 mb-3 border border-white/60">
            <KeyRound className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#6C3A5C] via-[#DD5E98] to-[#CC4BC2] dark:from-white dark:to-[#C1AE7C] bg-clip-text text-transparent tracking-tight">
            Password Recovery
          </h1>
          <p className="text-xs text-[#6C3A5C]/75 dark:text-slate-300 mt-1 font-medium">
            Reset your AI Code Review Assistant credentials
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl shadow-2xl border border-[#E16F7C]/30 bg-white/85 dark:bg-[#1e101c]/85">
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRequestToken} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6C3A5C] dark:text-slate-200 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#DD5E98] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="developer@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#faf7f5] dark:bg-[#140a12] border border-[#E16F7C]/30 focus:border-[#CC4BC2] focus:ring-2 focus:ring-[#CC4BC2]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2e1828] dark:text-white placeholder-[#6C3A5C]/40 outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-[#DD5E98]/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Sending Request...' : 'Send Recovery Token'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6C3A5C] dark:text-slate-200 mb-1.5">Reset Token</label>
                <input
                  type="text"
                  required
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  className="w-full bg-[#faf7f5] dark:bg-[#140a12] border border-[#E16F7C]/30 focus:border-[#CC4BC2] rounded-xl px-4 py-2.5 text-xs font-mono text-[#2e1828] dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6C3A5C] dark:text-slate-200 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#DD5E98] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#faf7f5] dark:bg-[#140a12] border border-[#E16F7C]/30 focus:border-[#CC4BC2] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2e1828] dark:text-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] text-white font-bold text-xs shadow-lg shadow-[#DD5E98]/30 transition flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Resetting Password...' : 'Save New Password'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-4">
              <p className="text-xs text-[#6C3A5C] dark:text-slate-200 mb-4">Your password has been reset successfully.</p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] text-white text-xs font-bold shadow-lg shadow-[#DD5E98]/30"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-[#6C3A5C]/75 dark:text-slate-300">
            <Link to="/login" className="text-[#DD5E98] hover:text-[#CC4BC2] font-bold">
              ← Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
