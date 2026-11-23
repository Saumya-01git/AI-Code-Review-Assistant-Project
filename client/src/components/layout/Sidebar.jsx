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
    <aside className="w-64 border-r border-slate-200/90 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex flex-col justify-between shrink-0 h-full z-30 transition-colors">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-200/90">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F72585] via-[#7209B7] to-[#4361EE] flex items-center justify-center shadow-md shadow-[#4361EE]/20 border border-white">
            <Cpu className="w-5 h-5 text-white" />
            <div className="absolute -top-1 -right-1">
              <Star className="w-3.5 h-3.5 text-[#4CC9F0] fill-[#4CC9F0] animate-star-shine" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
              AI Reviewer
            </h1>
            <p className="text-xs text-[#F72585] font-semibold leading-none mt-0.5">
              Quality & Security Suite
            </p>
          </div>
        </div>

        {/* Navigation Links with Slightly Increased Font Size */}
        <nav className="p-3.5 space-y-1.5">
          <div className="px-3 py-2 text-xs font-extrabold tracking-wider text-slate-400 uppercase font-mono">
            Platform Menu
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm sm:text-base font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#F72585]/15 via-[#7209B7]/15 to-[#4361EE]/15 text-[#3A0CA3] dark:text-pink-300 border-l-4 border-[#F72585] shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0 text-[#4361EE]" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Engine Status Widget with 5 New Vibrant Colors */}
      <div className="p-4 m-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/90 dark:border-slate-700/80">
        <div className="flex items-center gap-2 mb-1.5 text-slate-900 dark:text-slate-100 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-[#F72585]" />
          <span>Stage 1 & 2 Shields</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug mb-3">
          AST Linter + AI Code Intelligence active.
        </p>
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden flex">
          <div className="bg-[#F72585] h-full w-1/5" title="Neon Pink (#F72585)"></div>
          <div className="bg-[#7209B7] h-full w-1/5" title="Indigo Bloom (#7209B7)"></div>
          <div className="bg-[#3A0CA3] h-full w-1/5" title="Vivid Royal (#3A0CA3)"></div>
          <div className="bg-[#4361EE] h-full w-1/5" title="Electric Sapphire (#4361EE)"></div>
          <div className="bg-[#4CC9F0] h-full w-1/5" title="Sky Aqua (#4CC9F0)"></div>
        </div>
      </div>
    </aside>
  );
}
