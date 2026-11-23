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
    <aside className="w-68 border-r-2 border-[#E16F7C]/30 bg-white/95 dark:bg-[#281325]/95 backdrop-blur-2xl flex flex-col justify-between shrink-0 h-screen sticky top-0 shadow-[4px_0_24px_rgba(221,94,152,0.14)] z-30 transition-colors">
      <div>
        {/* Brand Header */}
        <div className="h-20 flex items-center gap-3.5 px-6 border-b-2 border-[#E16F7C]/25 bg-gradient-to-r from-white/90 via-[#fff5f8]/90 to-white/90">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] flex items-center justify-center shadow-xl shadow-[#DD5E98]/40 border-2 border-white">
            <Cpu className="w-6 h-6 text-white" />
            <div className="absolute -top-1.5 -right-1.5">
              <Star className="w-4 h-4 text-[#C1AE7C] fill-[#C1AE7C] animate-star-shine" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-black font-display bg-gradient-to-r from-[#6C3A5C] via-[#DD5E98] to-[#CC4BC2] bg-clip-text text-transparent">
              AI Code Review
            </h1>
            <p className="font-cursive text-base text-[#DD5E98] font-bold tracking-wide -mt-0.5">
              Guardian Suite
            </p>
          </div>
        </div>

        {/* Navigation Links with larger text */}
        <nav className="p-4 space-y-2">
          <div className="px-3 pb-2 text-xs font-black tracking-wider text-[#6C3A5C]/75 uppercase font-mono">
            Platform Menu
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E16F7C]/25 via-[#DD5E98]/20 to-[#CC4BC2]/25 text-[#3a142e] border-2 border-[#DD5E98]/50 shadow-md shadow-[#E16F7C]/20'
                      : 'text-[#6C3A5C] hover:text-[#3a142e] hover:bg-[#E16F7C]/15'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0 text-[#DD5E98]" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Engine Status Widget with 5 Colors & larger typography */}
      <div className="p-4 m-4 rounded-3xl bg-gradient-to-br from-white/95 to-[#fff5f8]/95 border-2 border-[#E16F7C]/30 shadow-xl shadow-[#DD5E98]/15">
        <div className="flex items-center gap-2 mb-2 text-[#3a142e] font-black text-sm">
          <ShieldCheck className="w-5 h-5 text-[#DD5E98]" />
          <span>Stage 1 & 2 Shields</span>
        </div>
        <p className="text-xs text-[#6C3A5C] leading-relaxed mb-3 font-semibold">
          Static AST Linter + AI Code Intelligence active.
        </p>
        <div className="w-full bg-[#C1AE7C]/30 h-3 rounded-full overflow-hidden flex border border-[#DD5E98]/30 shadow-inner">
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
