import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';

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
    <div className="space-y-7 max-w-2xl animate-fade-in pb-16">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Account Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Manage your developer profile and security preferences.</p>
      </div>

      <div className="p-7 rounded-2xl border border-slate-200/90 bg-white shadow-sm">
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#4361EE] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-400 cursor-not-allowed outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-3.5">
            <h3 className="text-sm font-bold text-slate-900">Change Password</h3>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-600 mb-1">Current Password</label>
              <input
                type="password"
                placeholder="Required to set a new password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#4361EE] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-600 mb-1">New Password</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#4361EE] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F72585] to-[#4361EE] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-[#4361EE]/20 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}
