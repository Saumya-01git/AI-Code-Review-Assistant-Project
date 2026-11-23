import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Cpu, ArrowRight, AlertCircle, Sparkles, Star } from 'lucide-react';
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
    <div className="min-h-screen w-full p-2.5 sm:p-4 bg-[#faf4ef] flex items-center justify-center relative overflow-hidden">
      {/* Moving Light Translucent Aurora Mesh */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(193, 174, 124, 0.45) 0%, transparent 45%),
            radial-gradient(circle at 90% 20%, rgba(225, 111, 124, 0.45) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(221, 94, 152, 0.40) 0%, transparent 50%),
            radial-gradient(circle at 20% 85%, rgba(204, 75, 194, 0.45) 0%, transparent 45%),
            radial-gradient(circle at 80% 85%, rgba(108, 58, 92, 0.40) 0%, transparent 50%),
            linear-gradient(135deg, rgba(255,251,245,0.9) 0%, rgba(254,240,246,0.85) 50%, rgba(246,236,245,0.9) 100%)
          `,
          backgroundSize: '200% 200%',
          animation: 'auroraMove 10s ease infinite alternate'
        }}
      />

      {/* Main Inner Concentric Square Frame */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-[36px] border-2 border-[#E16F7C]/45 bg-[#fffbf7]/98 backdrop-blur-2xl shadow-[0_25px_65px_rgba(108,58,92,0.18)] overflow-hidden">
        {/* Translucent Code Background Illustration inside the card */}
        <TranslucentCodeBackground />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] items-center justify-center shadow-xl shadow-[#DD5E98]/35 mb-3 border-2 border-white">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black font-display text-[#3a142e] tracking-tight">
              AI Code Review
            </h1>
            <p className="font-cursive text-xl text-[#DD5E98] font-bold mt-1">
              Automated Code Quality Workstation
            </p>

            {/* 5-Color Mini Swatches */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="w-3.5 h-2 rounded-full bg-[#C1AE7C]" title="Sand"></span>
              <span className="w-3.5 h-2 rounded-full bg-[#E16F7C]" title="Pink"></span>
              <span className="w-3.5 h-2 rounded-full bg-[#DD5E98]" title="Peony"></span>
              <span className="w-3.5 h-2 rounded-full bg-[#CC4BC2]" title="Orchid"></span>
              <span className="w-3.5 h-2 rounded-full bg-[#6C3A5C]" title="Blackberry"></span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-2 shadow-sm">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-[#3a142e] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#DD5E98] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="saumya@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#faf5f8] border-2 border-[#E16F7C]/30 focus:border-[#CC4BC2] focus:ring-2 focus:ring-[#CC4BC2]/20 rounded-2xl pl-10 pr-4 py-3 text-xs font-bold text-[#3a142e] placeholder-[#6C3A5C]/40 outline-none transition"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-extrabold text-[#3a142e]">Password</label>
                <Link to="/forgot-password" className="text-xs text-[#DD5E98] hover:text-[#CC4BC2] font-bold">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#DD5E98] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#faf5f8] border-2 border-[#E16F7C]/30 focus:border-[#CC4BC2] focus:ring-2 focus:ring-[#CC4BC2]/20 rounded-2xl pl-10 pr-4 py-3 text-xs font-bold text-[#3a142e] placeholder-[#6C3A5C]/40 outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] hover:opacity-95 text-white font-black text-sm shadow-xl shadow-[#DD5E98]/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t-2 border-[#E16F7C]/20">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={submitting}
              className="w-full py-3 px-3 rounded-2xl bg-white hover:bg-[#fff5f8] border-2 border-[#DD5E98]/40 text-[#6C3A5C] text-xs font-black flex items-center justify-center gap-2 transition shadow-md"
            >
              <Sparkles className="w-4 h-4 text-[#C1AE7C]" />
              <span>One-Click Demo Login</span>
            </button>
          </div>

          <p className="mt-6 text-center text-xs font-bold text-[#6C3A5C]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#DD5E98] hover:text-[#CC4BC2] font-black">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
