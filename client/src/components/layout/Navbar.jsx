import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  PlusCircle, 
  Sun,
  Moon,
  LogOut
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
    <header className="h-16 border-b border-slate-200/90 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 transition-colors">
      <div className="flex items-center gap-3">
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F72585] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#4361EE]"></span>
        </span>
        <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 tracking-wider hidden sm:inline font-mono">
          GUARDIAN SHIELD ONLINE
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-[#4CC9F0]" /> : <Moon className="w-4 h-4 text-[#7209B7]" />}
        </button>

        {/* New Review Button in Vibrant Gradient */}
        <Link
          to="/review"
          className="flex items-center gap-2 px-5 py-2.5 text-sm sm:text-base font-bold rounded-xl bg-gradient-to-r from-[#F72585] via-[#7209B7] to-[#4361EE] text-white shadow-md shadow-[#4361EE]/25 hover:shadow-lg hover:shadow-[#F72585]/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>New Review</span>
        </Link>

        {user && (
          <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-slate-200 dark:border-slate-700">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{user.name}</span>
              <span className="text-xs text-slate-500 font-mono">{user.email}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F72585] via-[#7209B7] to-[#4361EE] flex items-center justify-center text-sm font-bold text-white shadow-sm border border-white">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
