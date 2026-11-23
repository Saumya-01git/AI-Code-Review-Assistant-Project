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
    <header className="h-24 border-b-2 border-[#DD5E98]/30 bg-white/95 dark:bg-[#281325]/95 backdrop-blur-2xl px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-3.5 w-3.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DD5E98] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#E16F7C]"></span>
          </span>
          <span className="text-base font-black text-[#6C3A5C] uppercase tracking-wider hidden sm:inline font-mono">
            Guardian Shield Online
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          className="p-3 rounded-2xl text-[#6C3A5C] hover:bg-[#E16F7C]/20 border-2 border-[#DD5E98]/35 transition shadow-sm bg-white"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-[#C1AE7C]" /> : <Moon className="w-5 h-5 text-[#CC4BC2]" />}
        </button>

        {/* New Review Button in 5-Color Gradient with Bigger Text */}
        <Link
          to="/review"
          className="flex items-center gap-3 px-6 py-3 text-base font-black rounded-2xl bg-gradient-to-r from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] text-white shadow-xl shadow-[#DD5E98]/35 hover:shadow-[#DD5E98]/55 hover:scale-[1.03] active:scale-[0.98] transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          <span>New Review</span>
        </Link>

        {user && (
          <div className="flex items-center gap-4 pl-4 border-l-2 border-[#DD5E98]/30">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-base font-black text-[#2d0f25]">{user.name}</span>
              <span className="text-xs text-[#6C3A5C] font-mono font-bold">{user.email}</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#CC4BC2] via-[#DD5E98] to-[#6C3A5C] flex items-center justify-center text-base font-black text-white shadow-md border-2 border-[#C1AE7C]">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-3 rounded-2xl text-[#6C3A5C] hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
