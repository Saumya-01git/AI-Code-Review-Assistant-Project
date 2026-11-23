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
    /* Outer Concentric Page Frame */
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
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              AI Code Review
            </h1>
            <p className="text-xs text-[#DD5E98] font-medium mt-0.5">
              Automated Code Quality Workstation
            </p>

            {/* 5-Color Mini Swatches */}
            <div className="flex items-center justify-center gap-1.5 mt-2.5">
              <span className="w-3 h-1.5 rounded-full bg-[#C1AE7C]" title="Sand"></span>
              <span className="w-3 h-1.5 rounded-full bg-[#E16F7C]" title="Pink"></span>
              <span className="w-3 h-1.5 rounded-full bg-[#DD5E98]" title="Peony"></span>
              <span className="w-3 h-1.5 rounded-full bg-[#CC4BC2]" title="Orchid"></span>
              <span className="w-3 h-1.5 rounded-full bg-[#6C3A5C]" title="Blackberry"></span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
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

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-[#DD5E98] hover:text-[#CC4BC2] font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#DD5E98] focus:ring-1 focus:ring-[#DD5E98]/20 rounded-lg pl-9 pr-3 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] hover:opacity-95 text-white font-semibold text-xs shadow-md shadow-[#DD5E98]/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-4 pt-3.5 border-t border-slate-200">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={submitting}
              className="w-full py-2.5 px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C1AE7C]" />
              <span>One-Click Demo Login</span>
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#DD5E98] hover:text-[#CC4BC2] font-semibold">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
