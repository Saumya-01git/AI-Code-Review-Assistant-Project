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
    <div className="min-h-screen w-full p-3 sm:p-5 bg-slate-100/90 flex items-center justify-center relative overflow-hidden">
      {/* Moving Light Translucent Aurora Mesh */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(193, 174, 124, 0.20) 0%, transparent 45%),
            radial-gradient(circle at 90% 20%, rgba(225, 111, 124, 0.20) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(221, 94, 152, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 20% 85%, rgba(204, 75, 194, 0.20) 0%, transparent 45%),
            radial-gradient(circle at 80% 85%, rgba(108, 58, 92, 0.15) 0%, transparent 50%),
            linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(248,250,252,0.8) 100%)
          `,
          backgroundSize: '200% 200%',
          animation: 'auroraMove 12s ease infinite alternate'
        }}
      />

      {/* Main Inner Concentric Square Frame */}
      <div className="relative z-10 w-full max-w-md p-6 sm:p-8 rounded-2xl border border-slate-200/90 bg-white shadow-xl overflow-hidden">
        <TranslucentCodeBackground />

        <div className="relative z-10">
          <div className="text-center mb-6">
            <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-tr from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] items-center justify-center shadow-md shadow-[#DD5E98]/20 mb-3 border border-white">
              <KeyRound className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Reset Password
            </h1>
            <p className="text-xs text-[#DD5E98] font-medium mt-0.5">
              Secure Account Recovery
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{message}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRequestToken} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="saumya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#DD5E98] focus:ring-1 focus:ring-[#DD5E98]/20 rounded-lg pl-9 pr-3 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] hover:opacity-95 text-white font-semibold text-xs shadow-md shadow-[#DD5E98]/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Requesting...' : 'Generate Reset Token'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reset Token</label>
                <input
                  type="text"
                  required
                  placeholder="Paste reset token"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#DD5E98] rounded-lg px-3 py-2 text-xs font-mono text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#DD5E98] rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] text-white font-semibold text-xs shadow-md shadow-[#DD5E98]/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#E16F7C] to-[#DD5E98] text-white text-xs font-semibold shadow-sm"
              >
                <span>Return to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <p className="mt-4 text-center text-xs text-slate-500">
            Remembered your credentials?{' '}
            <Link to="/login" className="text-[#DD5E98] hover:text-[#CC4BC2] font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
