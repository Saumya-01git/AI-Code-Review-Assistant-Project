import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, KeyRound, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import TranslucentCodeBackground from '../components/layout/TranslucentCodeBackground';

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
    <div className="min-h-screen w-full p-4 sm:p-6 bg-gradient-to-br from-slate-100 via-[#f4f6fc] to-[#fbf5f8] flex items-center justify-center relative overflow-hidden">
      {/* Moving Ambient Aurora using the 5 Vibrant Colors */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(247, 37, 133, 0.25) 0%, transparent 45%),
            radial-gradient(circle at 90% 20%, rgba(67, 97, 238, 0.25) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(76, 201, 240, 0.20) 0%, transparent 50%),
            radial-gradient(circle at 20% 85%, rgba(114, 9, 183, 0.22) 0%, transparent 45%),
            radial-gradient(circle at 80% 85%, rgba(58, 12, 163, 0.20) 0%, transparent 50%),
            linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(244,247,254,0.8) 100%)
          `,
          backgroundSize: '200% 200%',
          animation: 'auroraMove 12s ease infinite alternate'
        }}
      />

      {/* Main Inner Concentric Square Frame */}
      <div className="relative z-10 w-full max-w-md p-7 sm:p-9 rounded-2xl border border-slate-200/90 bg-white shadow-2xl overflow-hidden">
        <TranslucentCodeBackground />

        <div className="relative z-10">
          <div className="text-center mb-7">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#F72585] via-[#7209B7] to-[#4361EE] items-center justify-center shadow-lg shadow-[#4361EE]/25 mb-3 border border-white">
              <KeyRound className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Reset Password
            </h1>
            <p className="text-xs sm:text-sm text-[#F72585] font-semibold mt-1">
              Secure Account Recovery
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{message}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRequestToken} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="saumya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#4361EE] focus:ring-1 focus:ring-[#4361EE]/25 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2.5 py-3 px-4 rounded-xl bg-gradient-to-r from-[#F72585] via-[#7209B7] to-[#4361EE] hover:opacity-95 text-white font-bold text-sm sm:text-base shadow-md shadow-[#4361EE]/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Requesting...' : 'Generate Reset Token'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Reset Token</label>
                <input
                  type="text"
                  required
                  placeholder="Paste reset token"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#4361EE] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#4361EE] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2.5 py-3 px-4 rounded-xl bg-gradient-to-r from-[#F72585] via-[#7209B7] to-[#4361EE] text-white font-bold text-sm sm:text-base shadow-md shadow-[#4361EE]/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Updating...' : 'Update Password'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F72585] to-[#4361EE] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#4361EE]/20"
              >
                <span>Return to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <p className="mt-5 text-center text-xs sm:text-sm text-slate-500 font-medium">
            Remembered your credentials?{' '}
            <Link to="/login" className="text-[#F72585] hover:text-[#4361EE] font-bold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
