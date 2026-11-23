import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Code2, 
  History, 
  Settings, 
  ShieldCheck,
  Cpu,
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
    <aside className="w-64 border-r border-slate-200/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex flex-col justify-between shrink-0 h-full z-30 transition-colors">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-200/80">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] flex items-center justify-center shadow-md shadow-[#DD5E98]/20 border border-white">
            <Cpu className="w-5 h-5 text-white" />
            <div className="absolute -top-1 -right-1">
              <Star className="w-3 h-3 text-[#C1AE7C] fill-[#C1AE7C] animate-star-shine" />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              AI Reviewer
            </h1>
            <p className="text-[11px] text-[#DD5E98] font-medium leading-none mt-0.5">
              Quality & Security Suite
            </p>
          </div>
        </div>

        {/* Navigation Links with Clean Typography */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono">
            Platform Menu
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E16F7C]/15 via-[#DD5E98]/15 to-[#CC4BC2]/15 text-[#6C3A5C] dark:text-pink-300 border-l-4 border-[#DD5E98] shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
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
      <div className="p-4 m-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center gap-2 mb-1.5 text-slate-900 dark:text-slate-100 font-bold text-xs">
          <ShieldCheck className="w-4 h-4 text-[#DD5E98]" />
          <span>Stage 1 & 2 Shields</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mb-3">
          AST Linter + AI Code Intelligence active.
        </p>
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden flex">
          <div className="bg-[#C1AE7C] h-full w-1/5" title="Sand (#C1AE7C)"></div>
          <div className="bg-[#E16F7C] h-full w-1/5" title="Bubblegum (#E16F7C)"></div>
          <div className="bg-[#DD5E98] h-full w-1/5" title="Peony (#DD5E98)"></div>
          <div className="bg-[#CC4BC2] h-full w-1/5" title="Orchid (#CC4BC2)"></div>
          <div className="bg-[#6C3A5C] h-full w-1/5" title="Blackberry (#6C3A5C)"></div>
        </div>
      </div>
    </aside>
  );
}
