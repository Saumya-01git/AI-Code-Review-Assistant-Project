import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Cpu, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import TranslucentCodeBackground from '../components/layout/TranslucentCodeBackground';

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setSubmitting(true);
    try {
      await login('saumya@example.com', 'developer123');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      try {
        await register('Saumya Developer', 'saumya@example.com', 'developer123');
        navigate('/dashboard', { replace: true });
      } catch (regErr) {
        setError(regErr.message || 'Demo login failed');
      }
    } finally {
      setSubmitting(false);
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
              <Cpu className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Code Review
            </h1>
            <p className="text-xs sm:text-sm text-[#F72585] font-semibold mt-1">
              Automated Code Quality Workstation
            </p>

            {/* 5-Color Mini Swatches */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="w-3.5 h-1.5 rounded-full bg-[#F72585]" title="Neon Pink"></span>
              <span className="w-3.5 h-1.5 rounded-full bg-[#7209B7]" title="Indigo Bloom"></span>
              <span className="w-3.5 h-1.5 rounded-full bg-[#3A0CA3]" title="Vivid Royal"></span>
              <span className="w-3.5 h-1.5 rounded-full bg-[#4361EE]" title="Electric Sapphire"></span>
              <span className="w-3.5 h-1.5 rounded-full bg-[#4CC9F0]" title="Sky Aqua"></span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs sm:text-sm font-bold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs sm:text-sm text-[#F72585] hover:text-[#4361EE] font-semibold">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#4361EE] focus:ring-1 focus:ring-[#4361EE]/25 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2.5 py-3 px-4 rounded-xl bg-gradient-to-r from-[#F72585] via-[#7209B7] to-[#4361EE] hover:opacity-95 text-white font-bold text-sm sm:text-base shadow-md shadow-[#4361EE]/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition shadow-sm hover:border-[#4361EE]/40"
            >
              <Sparkles className="w-4 h-4 text-[#4CC9F0]" />
              <span>One-Click Demo Login</span>
            </button>
          </div>

          <p className="mt-5 text-center text-xs sm:text-sm text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#F72585] hover:text-[#4361EE] font-bold">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
