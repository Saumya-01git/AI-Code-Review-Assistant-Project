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
    <header className="h-20 border-b-2 border-[#E16F7C]/30 bg-white/90 dark:bg-[#281325]/90 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DD5E98] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E16F7C]"></span>
          </span>
          <span className="text-sm font-black text-[#6C3A5C] uppercase tracking-wider hidden sm:inline font-mono">
            Guardian Online
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-5">
        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          className="p-2.5 rounded-2xl text-[#6C3A5C] hover:bg-[#E16F7C]/15 border-2 border-[#E16F7C]/30 transition shadow-sm bg-white/90"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-[#C1AE7C]" /> : <Moon className="w-5 h-5 text-[#CC4BC2]" />}
        </button>

        {/* New Review Button in 5-Color Gradient */}
        <Link
          to="/review"
          className="flex items-center gap-2.5 px-5 py-2.5 text-sm font-black rounded-2xl bg-gradient-to-r from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] text-white shadow-xl shadow-[#DD5E98]/30 hover:shadow-[#DD5E98]/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Review</span>
        </Link>

        {user && (
          <div className="flex items-center gap-3.5 pl-3 border-l-2 border-[#E16F7C]/30">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-black text-[#3a142e]">{user.name}</span>
              <span className="text-xs text-[#6C3A5C] font-mono font-bold">{user.email}</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#CC4BC2] to-[#6C3A5C] flex items-center justify-center text-sm font-black text-white shadow-md border-2 border-[#C1AE7C]">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2.5 rounded-2xl text-[#6C3A5C] hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
