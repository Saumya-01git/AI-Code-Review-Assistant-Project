import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Sparkles, 
  User, 
  LogOut, 
  PlusCircle, 
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 transition-colors">
      <div className="flex items-center gap-3">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DD5E98] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E16F7C]"></span>
        </span>
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tracking-wider hidden sm:inline font-mono">
          GUARDIAN SHIELD ONLINE
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-[#C1AE7C]" /> : <Moon className="w-4 h-4 text-[#CC4BC2]" />}
        </button>

        {/* New Review Button in 5-Color Gradient */}
        <Link
          to="/review"
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] text-white shadow-md shadow-[#DD5E98]/25 hover:shadow-lg hover:shadow-[#DD5E98]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Review</span>
        </Link>

        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{user.name}</span>
              <span className="text-[11px] text-slate-500 font-mono">{user.email}</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#CC4BC2] via-[#DD5E98] to-[#6C3A5C] flex items-center justify-center text-xs font-bold text-white shadow-sm border border-white">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
