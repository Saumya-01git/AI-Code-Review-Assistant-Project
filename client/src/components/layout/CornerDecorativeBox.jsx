import React, { useState } from 'react';
import { Sparkles, Star, Cpu, ShieldCheck, Zap, Award, Compass, Heart } from 'lucide-react';

export default function CornerDecorativeBox() {
  const [minimized, setMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState('guardian');

  return (
    <div 
      className="fixed bottom-0 right-0 z-50 pointer-events-auto select-none transition-all duration-500 ease-out"
      style={{ filter: 'drop-shadow(0 0 24px rgba(204, 75, 194, 0.28))' }}
    >
      {/* Outer Glowing Star Shimmer Backdrop */}
      <div className="absolute -top-3 -left-3 w-full h-full rounded-tl-[40px] bg-gradient-to-br from-[#E16F7C]/30 via-[#CC4BC2]/25 to-[#C1AE7C]/30 blur-2xl pointer-events-none animate-pulse-glow"></div>

      {/* Main Square touching the 2 corner edges (bottom & right) with equal dimensions (48x48) */}
      <div 
        className={`relative transition-all duration-500 ease-in-out ${
          minimized 
            ? 'w-16 h-16 rounded-tl-3xl' 
            : 'w-48 h-48 sm:w-52 sm:h-52 rounded-tl-[36px]'
        } bg-[#fffbf7]/90 dark:bg-[#20101d]/90 backdrop-blur-2xl border-t-2 border-l-2 border-[#E16F7C]/60 dark:border-[#CC4BC2]/60 shadow-[0_-10px_40px_rgba(221,94,152,0.22)] flex flex-col justify-between overflow-hidden group`}
      >
        {/* Moving Light Animated Background Mesh Image Effect */}
        <div 
          className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(225, 111, 124, 0.45) 0%, transparent 45%),
              radial-gradient(circle at 80% 20%, rgba(204, 75, 194, 0.45) 0%, transparent 45%),
              radial-gradient(circle at 50% 80%, rgba(193, 174, 124, 0.40) 0%, transparent 50%),
              radial-gradient(circle at 90% 90%, rgba(108, 58, 92, 0.50) 0%, transparent 55%),
              linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(221,94,152,0.25) 50%, rgba(108,58,92,0.3) 100%)
            `,
            backgroundSize: '200% 200%',
            animation: 'auroraMove 7s ease-in-out infinite alternate'
          }}
        />

        {/* Dynamic moving diagonal ray of light */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
          style={{
            background: 'repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(255,255,255,0.6) 15px, rgba(255,255,255,0.6) 30px)',
            animation: 'shineSweep 9s linear infinite'
          }}
        />

        {/* Floating Stars with Star Shining Effect */}
        {/* Star 1: Top-left corner */}
        <div className="absolute top-2.5 left-3 animate-star-shine pointer-events-none">
          <Star className="w-5 h-5 text-[#C1AE7C] fill-[#C1AE7C] drop-shadow-[0_0_12px_#C1AE7C]" />
        </div>

        {/* Star 2: Top-right corner */}
        <div className="absolute top-3 right-3 animate-star-shine pointer-events-none" style={{ animationDelay: '1.4s' }}>
          <Sparkles className="w-4 h-4 text-[#DD5E98] drop-shadow-[0_0_10px_#CC4BC2]" />
        </div>

        {/* Star 3: Center sparkle */}
        <div className="absolute bottom-8 left-3.5 animate-star-shine pointer-events-none" style={{ animationDelay: '2.5s' }}>
          <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#E16F7C]" />
        </div>

        {/* Star 4: Center-right glittering star */}
        <div className="absolute bottom-12 right-4 animate-star-shine pointer-events-none" style={{ animationDelay: '0.8s' }}>
          <Star className="w-3.5 h-3.5 text-white fill-white drop-shadow-[0_0_8px_#CC4BC2]" />
        </div>

        {minimized ? (
          /* Minimized State */
          <button 
            onClick={() => setMinimized(false)}
            className="w-full h-full flex flex-col items-center justify-center relative z-10 text-[#6C3A5C] dark:text-[#fdf2f8] hover:scale-110 transition-transform"
            title="Expand AI Guardian"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#E16F7C] to-[#CC4BC2] flex items-center justify-center text-white shadow-lg shadow-[#DD5E98]/40 animate-pulse-glow">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-black text-[#6C3A5C] dark:text-[#C1AE7C] mt-0.5 font-mono">AI</span>
          </button>
        ) : (
          /* Full Square Interactive Content */
          <div className="relative z-10 flex flex-col justify-between h-full p-3.5 text-[#2e1828] dark:text-white">
            {/* Header: Status and minimize toggle */}
            <div className="flex items-center justify-between pl-6 pr-1 pt-0.5">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/85 dark:bg-[#34182e]/85 border border-[#DD5E98]/40 shadow-sm backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E16F7C] animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-wider text-[#6C3A5C] dark:text-[#C1AE7C] font-mono">
                  Guardian
                </span>
              </div>
              <button
                onClick={() => setMinimized(true)}
                className="w-5 h-5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-xs font-bold text-[#6C3A5C] dark:text-slate-300"
                title="Minimize corner box"
              >
                ×
              </button>
            </div>

            {/* Core Graphic Visual & Status */}
            <div className="text-center my-auto px-1 py-0.5">
              <div className="inline-flex relative p-2.5 rounded-2xl bg-gradient-to-tr from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] text-white shadow-lg shadow-[#DD5E98]/40 group-hover:scale-110 transition-transform duration-300">
                <Cpu className="w-6 h-6 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#C1AE7C] rounded-full border-2 border-white flex items-center justify-center shadow">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="text-xs font-extrabold tracking-tight mt-1 text-[#451f3b] dark:text-[#fdf2f8] drop-shadow-sm">
                AST & AI Shield Active
              </div>
              <div className="text-[10px] font-semibold text-[#8a3f6a] dark:text-[#C1AE7C] flex items-center justify-center gap-1">
                <span>100% Quality Guard</span>
              </div>
            </div>

            {/* Bottom 5-Color Palette Swatch Bar */}
            <div className="pt-1.5 border-t border-[#6C3A5C]/15 dark:border-white/10 flex flex-col gap-1">
              <div className="flex items-center justify-center gap-1.5">
                <span className="w-3 h-2 rounded-full bg-[#C1AE7C] shadow-sm hover:scale-125 transition-transform" title="Sand (#C1AE7C)"></span>
                <span className="w-3 h-2 rounded-full bg-[#E16F7C] shadow-sm hover:scale-125 transition-transform" title="Bubblegum Pink (#E16F7C)"></span>
                <span className="w-3 h-2 rounded-full bg-[#DD5E98] shadow-sm hover:scale-125 transition-transform" title="Sweet Peony (#DD5E98)"></span>
                <span className="w-3 h-2 rounded-full bg-[#CC4BC2] shadow-sm hover:scale-125 transition-transform" title="Vivid Orchid (#CC4BC2)"></span>
                <span className="w-3 h-2 rounded-full bg-[#6C3A5C] shadow-sm hover:scale-125 transition-transform" title="Blackberry Cream (#6C3A5C)"></span>
              </div>
              <div className="text-[8.5px] text-center font-mono font-medium text-[#6C3A5C]/80 dark:text-slate-300">
                Carbon Guardian Palette
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
