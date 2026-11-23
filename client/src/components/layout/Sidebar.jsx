import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Code2, 
  History, 
  Settings, 
  ShieldCheck,
  Cpu,
  Sparkles,
  Star
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Review Studio', path: '/review', icon: Code2 },
  { name: 'Review History', path: '/history', icon: History },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-[#E16F7C]/20 dark:border-[#CC4BC2]/20 bg-white/80 dark:bg-[#1a0e18]/85 backdrop-blur-xl flex flex-col justify-between shrink-0 h-screen sticky top-0 transition-colors">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-[#E16F7C]/15 dark:border-white/10">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] flex items-center justify-center shadow-lg shadow-[#DD5E98]/30">
            <Cpu className="w-5 h-5 text-white" />
            <div className="absolute -top-1 -right-1">
              <Star className="w-3 h-3 text-[#C1AE7C] fill-[#C1AE7C] animate-star-shine" />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-extrabold bg-gradient-to-r from-[#6C3A5C] via-[#DD5E98] to-[#CC4BC2] dark:from-[#fdf2f8] dark:to-[#C1AE7C] bg-clip-text text-transparent">
              AI Code Review
            </h1>
            <p className="text-[10px] text-[#6C3A5C]/70 dark:text-[#C1AE7C]/80 font-mono tracking-tight font-semibold">
              Guardian Suite
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-[#6C3A5C]/60 dark:text-[#C1AE7C]/70 uppercase font-mono">
            Platform Menu
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E16F7C]/20 via-[#DD5E98]/15 to-[#CC4BC2]/20 text-[#6C3A5C] dark:text-[#fdf2f8] border border-[#DD5E98]/40 shadow-sm shadow-[#E16F7C]/10'
                      : 'text-[#6C3A5C]/75 dark:text-slate-300 hover:text-[#6C3A5C] dark:hover:text-white hover:bg-[#E16F7C]/10'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 text-[#DD5E98]" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Engine Status Widget with 5 Colors */}
      <div className="p-4 m-4 rounded-2xl glass-panel border border-[#E16F7C]/25 text-xs">
        <div className="flex items-center gap-2 mb-1.5 text-[#6C3A5C] dark:text-[#C1AE7C] font-bold">
          <ShieldCheck className="w-4 h-4 text-[#DD5E98]" />
          <span>Stage 1 & 2 Shields</span>
        </div>
        <p className="text-[11px] text-[#6C3A5C]/80 dark:text-slate-300 leading-relaxed mb-2.5">
          Static AST Linter + AI Code Intelligence active.
        </p>
        <div className="w-full bg-[#C1AE7C]/20 h-2 rounded-full overflow-hidden flex">
          <div className="bg-[#C1AE7C] h-full w-1/5" title="Sand"></div>
          <div className="bg-[#E16F7C] h-full w-1/5" title="Bubblegum"></div>
          <div className="bg-[#DD5E98] h-full w-1/5" title="Peony"></div>
          <div className="bg-[#CC4BC2] h-full w-1/5" title="Orchid"></div>
          <div className="bg-[#6C3A5C] h-full w-1/5" title="Blackberry"></div>
        </div>
      </div>
    </aside>
  );
}
