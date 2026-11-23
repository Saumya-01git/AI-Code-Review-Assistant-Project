import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Cpu, ArrowRight, AlertCircle, Sparkles, Star } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
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
      <div className="absolute bottom-20 right-24 animate-star-shine pointer-events-none" style={{ animationDelay: '1.5s' }}>
        <Sparkles className="w-7 h-7 text-[#DD5E98] drop-shadow-[0_0_15px_#CC4BC2]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] items-center justify-center shadow-xl shadow-[#DD5E98]/30 mb-3 border border-white/60">
            <Cpu className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#6C3A5C] via-[#DD5E98] to-[#CC4BC2] dark:from-white dark:to-[#C1AE7C] bg-clip-text text-transparent tracking-tight">
            Create Developer Account
          </h1>
          <p className="text-xs text-[#6C3A5C]/75 dark:text-slate-300 mt-1 font-medium">
            Get instant static analysis and AI-powered reviews
          </p>
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
              <label className="block text-xs font-bold text-[#6C3A5C] dark:text-slate-200 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#DD5E98] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Saumya Garg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#faf7f5] dark:bg-[#140a12] border border-[#E16F7C]/30 focus:border-[#CC4BC2] focus:ring-2 focus:ring-[#CC4BC2]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2e1828] dark:text-white placeholder-[#6C3A5C]/40 outline-none transition"
                />
              </div>
            </div>

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

            <div>
              <label className="block text-xs font-bold text-[#6C3A5C] dark:text-slate-200 mb-1.5">Password</label>
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

            <div>
              <label className="block text-xs font-bold text-[#6C3A5C] dark:text-slate-200 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#DD5E98] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#faf7f5] dark:bg-[#140a12] border border-[#E16F7C]/30 focus:border-[#CC4BC2] focus:ring-2 focus:ring-[#CC4BC2]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2e1828] dark:text-white placeholder-[#6C3A5C]/40 outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-[#DD5E98]/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{submitting ? 'Creating account...' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#6C3A5C]/75 dark:text-slate-300">
            Already have an account?{' '}
            <Link to="/login" className="text-[#DD5E98] hover:text-[#CC4BC2] font-bold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
