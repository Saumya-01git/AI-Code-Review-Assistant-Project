import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Cpu, ArrowRight, AlertCircle, Sparkles, Star } from 'lucide-react';

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
    <div className="min-h-screen bg-[#faf7f5] dark:bg-[#150b13] flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors">
      {/* Background radiant mesh and shining stars */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-tr from-[#E16F7C]/25 via-[#DD5E98]/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-bl from-[#CC4BC2]/25 via-[#C1AE7C]/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* Floating Stars */}
      <div className="absolute top-12 left-16 animate-star-shine pointer-events-none">
        <Star className="w-6 h-6 text-[#C1AE7C] fill-[#C1AE7C] drop-shadow-[0_0_12px_#C1AE7C]" />
      </div>
      <div className="absolute top-20 right-24 animate-star-shine pointer-events-none" style={{ animationDelay: '1.2s' }}>
        <Sparkles className="w-7 h-7 text-[#DD5E98] drop-shadow-[0_0_15px_#CC4BC2]" />
      </div>
      <div className="absolute bottom-20 left-28 animate-star-shine pointer-events-none" style={{ animationDelay: '2.3s' }}>
        <Star className="w-5 h-5 text-[#E16F7C] fill-[#E16F7C] drop-shadow-[0_0_10px_#E16F7C]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] items-center justify-center shadow-xl shadow-[#DD5E98]/30 mb-3 border border-white/60">
            <Cpu className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#6C3A5C] via-[#DD5E98] to-[#CC4BC2] dark:from-white dark:to-[#C1AE7C] bg-clip-text text-transparent tracking-tight">
            AI Code Review Assistant
          </h1>
          <p className="text-xs text-[#6C3A5C]/75 dark:text-slate-300 mt-1 font-medium">
            Sign in to your automated code quality workstation
          </p>

          {/* 5-Color Mini Swatch Accent */}
          <div className="flex items-center justify-center gap-1.5 mt-2.5">
            <span className="w-3 h-1.5 rounded-full bg-[#C1AE7C]"></span>
            <span className="w-3 h-1.5 rounded-full bg-[#E16F7C]"></span>
            <span className="w-3 h-1.5 rounded-full bg-[#DD5E98]"></span>
            <span className="w-3 h-1.5 rounded-full bg-[#CC4BC2]"></span>
            <span className="w-3 h-1.5 rounded-full bg-[#6C3A5C]"></span>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl shadow-2xl border border-[#E16F7C]/30 bg-white/85 dark:bg-[#1e101c]/85">
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#6C3A5C] dark:text-slate-200 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#DD5E98] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="saumya@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#faf7f5] dark:bg-[#140a12] border border-[#E16F7C]/30 focus:border-[#CC4BC2] focus:ring-2 focus:ring-[#CC4BC2]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2e1828] dark:text-white placeholder-[#6C3A5C]/40 outline-none transition"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-[#6C3A5C] dark:text-slate-200">Password</label>
                <Link to="/forgot-password" className="text-[11px] text-[#DD5E98] hover:text-[#CC4BC2] font-semibold">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#DD5E98] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#faf7f5] dark:bg-[#140a12] border border-[#E16F7C]/30 focus:border-[#CC4BC2] focus:ring-2 focus:ring-[#CC4BC2]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2e1828] dark:text-white placeholder-[#6C3A5C]/40 outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-[#DD5E98]/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#E16F7C]/20 dark:border-white/10">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={submitting}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#C1AE7C]/20 via-[#E16F7C]/20 to-[#CC4BC2]/20 hover:from-[#C1AE7C]/30 hover:to-[#CC4BC2]/30 border border-[#DD5E98]/40 text-[#6C3A5C] dark:text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#C1AE7C]" />
              <span>One-Click Demo Login</span>
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-[#6C3A5C]/75 dark:text-slate-300">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#DD5E98] hover:text-[#CC4BC2] font-bold">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
