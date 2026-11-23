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
    <aside className="w-72 border-r-[3px] border-[#DD5E98]/30 bg-white/95 dark:bg-[#281325]/95 backdrop-blur-3xl flex flex-col justify-between shrink-0 h-screen sticky top-0 shadow-[6px_0_28px_rgba(204,75,194,0.15)] z-30 transition-colors">
      <div>
        {/* Brand Header */}
        <div className="h-24 flex items-center gap-4 px-7 border-b-2 border-[#E16F7C]/25 bg-gradient-to-r from-white/95 via-[#fff5f9]/95 to-white/95">
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] flex items-center justify-center shadow-xl shadow-[#DD5E98]/40 border-2 border-white">
            <Cpu className="w-7 h-7 text-white" />
            <div className="absolute -top-1.5 -right-1.5">
              <Star className="w-4 h-4 text-[#C1AE7C] fill-[#C1AE7C] animate-star-shine" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black font-display bg-gradient-to-r from-[#6C3A5C] via-[#DD5E98] to-[#CC4BC2] bg-clip-text text-transparent">
              AI Reviewer
            </h1>
            <p className="font-cursive text-lg text-[#DD5E98] font-bold tracking-wide -mt-1">
              Quality & Security Suite
            </p>
          </div>
        </div>

        {/* Navigation Links with Strictly Increased Font Size */}
        <nav className="p-5 space-y-2.5">
          <div className="px-4 pb-2 text-xs font-black tracking-widest text-[#6C3A5C]/80 uppercase font-mono">
            Platform Menu
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-base sm:text-lg font-black transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E16F7C]/30 via-[#DD5E98]/25 to-[#CC4BC2]/30 text-[#2d0f25] border-2 border-[#DD5E98]/60 shadow-md shadow-[#E16F7C]/25 scale-[1.02]'
                      : 'text-[#6C3A5C] hover:text-[#2d0f25] hover:bg-[#E16F7C]/15 hover:scale-[1.01]'
                  }`
                }
              >
                <Icon className="w-6 h-6 shrink-0 text-[#DD5E98]" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Engine Status Widget with 5 Colors & Big Typography */}
      <div className="p-5 m-5 rounded-3xl bg-gradient-to-br from-white to-[#fff5f9] border-2 border-[#DD5E98]/35 shadow-xl shadow-[#DD5E98]/15">
        <div className="flex items-center gap-2.5 mb-2 text-[#2d0f25] font-black text-base">
          <ShieldCheck className="w-6 h-6 text-[#DD5E98]" />
          <span>Stage 1 & 2 Shields</span>
        </div>
        <p className="text-sm text-[#6C3A5C] leading-relaxed mb-3.5 font-bold">
          Static AST Linter + AI Code Intelligence active.
        </p>
        <div className="w-full bg-[#C1AE7C]/30 h-3.5 rounded-full overflow-hidden flex border-2 border-[#DD5E98]/40 shadow-inner">
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
