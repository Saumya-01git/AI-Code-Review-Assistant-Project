import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, KeyRound, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      const payload = { name };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      await updateProfile(payload);
      setMessage('Profile updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in pb-16">
      <div>
        <h2 className="text-xl font-black text-[#3a142e]">Account Settings</h2>
        <p className="text-xs text-[#6C3A5C] font-semibold mt-1">Manage your developer profile and security preferences.</p>
      </div>

      <div className="glass-panel p-6 rounded-3xl border-2 border-[#E16F7C]/30 bg-white/95 shadow-xl">
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-[#3a142e] mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#faf5f8] border-2 border-[#E16F7C]/30 focus:border-[#CC4BC2] rounded-xl px-4 py-2.5 text-xs font-bold text-[#3a142e] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#3a142e] mb-1.5">Email Address</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full bg-[#faf5f8]/60 border-2 border-[#E16F7C]/20 rounded-xl px-4 py-2.5 text-xs font-semibold text-[#6C3A5C]/70 cursor-not-allowed outline-none"
            />
          </div>

          <div className="pt-4 border-t-2 border-[#E16F7C]/20 space-y-4">
            <h3 className="text-xs font-extrabold text-[#3a142e]">Change Password</h3>
            <div>
              <label className="block text-xs font-bold text-[#6C3A5C] mb-1.5">Current Password</label>
              <input
                type="password"
                placeholder="Required to set a new password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#faf5f8] border-2 border-[#E16F7C]/30 focus:border-[#CC4BC2] rounded-xl px-4 py-2.5 text-xs font-bold text-[#3a142e] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6C3A5C] mb-1.5">New Password</label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#faf5f8] border-2 border-[#E16F7C]/30 focus:border-[#CC4BC2] rounded-xl px-4 py-2.5 text-xs font-bold text-[#3a142e] outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] text-white font-extrabold text-xs shadow-lg shadow-[#DD5E98]/30 hover:scale-[1.02] transition"
          >
            {saving ? 'Saving Changes...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}
