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
    <aside className="w-64 border-r border-[#E16F7C]/30 bg-white/95 dark:bg-[#281325]/95 backdrop-blur-2xl flex flex-col justify-between shrink-0 h-screen sticky top-0 shadow-[4px_0_24px_rgba(221,94,152,0.12)] z-30 transition-colors">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-[#E16F7C]/20 bg-gradient-to-r from-white/80 via-[#fff5f8]/80 to-white/80 dark:from-[#281325] dark:to-[#281325]">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] flex items-center justify-center shadow-lg shadow-[#DD5E98]/30">
            <Cpu className="w-5 h-5 text-white" />
            <div className="absolute -top-1 -right-1">
              <Star className="w-3 h-3 text-[#C1AE7C] fill-[#C1AE7C] animate-star-shine" />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-extrabold bg-gradient-to-r from-[#6C3A5C] via-[#DD5E98] to-[#CC4BC2] bg-clip-text text-transparent">
              AI Code Review
            </h1>
            <p className="text-[10px] text-[#6C3A5C] font-mono tracking-tight font-bold">
              Guardian Suite
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-extrabold tracking-wider text-[#6C3A5C]/70 uppercase font-mono">
            Platform Menu
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E16F7C]/25 via-[#DD5E98]/20 to-[#CC4BC2]/25 text-[#451f3b] border-2 border-[#DD5E98]/50 shadow-md shadow-[#E16F7C]/15'
                      : 'text-[#6C3A5C] hover:text-[#451f3b] hover:bg-[#E16F7C]/15'
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
      <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-white/95 to-[#fff5f8]/95 dark:bg-[#34182e]/90 border-2 border-[#E16F7C]/30 shadow-lg shadow-[#DD5E98]/10 text-xs">
        <div className="flex items-center gap-2 mb-1.5 text-[#451f3b] font-extrabold">
          <ShieldCheck className="w-4 h-4 text-[#DD5E98]" />
          <span>Stage 1 & 2 Shields</span>
        </div>
        <p className="text-[11px] text-[#6C3A5C] leading-relaxed mb-2.5 font-medium">
          Static AST Linter + AI Code Intelligence active.
        </p>
        <div className="w-full bg-[#C1AE7C]/30 h-2.5 rounded-full overflow-hidden flex border border-[#DD5E98]/30">
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
