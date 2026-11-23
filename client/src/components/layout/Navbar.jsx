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
  Moon,
  Star
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
    <header className="h-16 border-b border-[#E16F7C]/30 bg-white/90 dark:bg-[#281325]/90 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DD5E98] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E16F7C]"></span>
          </span>
          <span className="text-xs font-extrabold text-[#6C3A5C] uppercase tracking-wider hidden sm:inline font-mono">
            Guardian Online
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          className="p-2 rounded-xl text-[#6C3A5C] hover:bg-[#E16F7C]/15 border-2 border-[#E16F7C]/30 transition shadow-sm bg-white/80"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-[#C1AE7C]" /> : <Moon className="w-4 h-4 text-[#CC4BC2]" />}
        </button>

        {/* New Review Button in 5-Color Gradient */}
        <Link
          to="/review"
          className="flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl bg-gradient-to-r from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] text-white shadow-lg shadow-[#DD5E98]/30 hover:shadow-[#DD5E98]/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Review</span>
        </Link>

        {user && (
          <div className="flex items-center gap-3 pl-2 border-l border-[#E16F7C]/30">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-extrabold text-[#3a142e]">{user.name}</span>
              <span className="text-[10px] text-[#6C3A5C] font-mono font-semibold">{user.email}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#CC4BC2] to-[#6C3A5C] flex items-center justify-center text-xs font-bold text-white shadow border-2 border-[#C1AE7C]">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-xl text-[#6C3A5C] hover:text-rose-600 hover:bg-rose-500/10 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
