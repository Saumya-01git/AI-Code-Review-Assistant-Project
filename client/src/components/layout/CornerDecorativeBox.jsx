import React, { useState } from 'react';
import { Sparkles, Star, Cpu, ShieldCheck, Zap, Award, Compass, Heart, Activity } from 'lucide-react';

export default function CornerDecorativeBox() {
  const [minimized, setMinimized] = useState(false);

  return (
    <div 
      className="fixed bottom-0 right-0 z-50 pointer-events-auto select-none transition-all duration-500 ease-out"
      style={{ filter: 'drop-shadow(0 0 35px rgba(204, 75, 194, 0.35))' }}
    >
      {/* Outer Glowing Star Shimmer Aura spanning the 5 colors */}
      <div className="absolute -top-6 -left-6 w-full h-full rounded-tl-[60px] bg-gradient-to-br from-[#C1AE7C]/40 via-[#DD5E98]/35 to-[#CC4BC2]/40 blur-3xl pointer-events-none animate-pulse-glow"></div>

      {/* Main Large Square touching bottom & right corner edges */}
      <div 
        className={`relative transition-all duration-500 ease-in-out ${
          minimized 
            ? 'w-20 h-20 rounded-tl-3xl' 
            : 'w-80 h-80 sm:w-96 sm:h-96 md:w-[380px] md:h-[380px] rounded-tl-[52px]'
        } bg-[#fffbf6]/95 dark:bg-[#1f0d1b]/95 backdrop-blur-3xl border-t-[3px] border-l-[3px] border-[#E16F7C]/60 shadow-[0_-15px_50px_rgba(221,94,152,0.3)] flex flex-col justify-between overflow-hidden group`}
      >
        {/* Dynamic Multi-Color Moving Aurora & Floating Orbs combining ALL 5 Colors */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated 5-Color Moving Mesh Gradient */}
          <div 
            className="absolute inset-0 opacity-80"
            style={{
              backgroundImage: `
                radial-gradient(circle at 15% 20%, rgba(193, 174, 124, 0.55) 0%, transparent 45%),
                radial-gradient(circle at 85% 20%, rgba(225, 111, 124, 0.55) 0%, transparent 45%),
                radial-gradient(circle at 50% 50%, rgba(221, 94, 152, 0.50) 0%, transparent 50%),
                radial-gradient(circle at 20% 85%, rgba(204, 75, 194, 0.55) 0%, transparent 50%),
                radial-gradient(circle at 80% 85%, rgba(108, 58, 92, 0.60) 0%, transparent 55%),
                linear-gradient(135deg, rgba(255,251,245,0.85) 0%, rgba(254,240,245,0.7) 50%, rgba(247,235,245,0.85) 100%)
              `,
              backgroundSize: '250% 250%',
              animation: 'auroraMove 8s ease infinite alternate'
            }}
          />

          {/* Floating Orb 1: Sand Gold (#C1AE7C) */}
          <div 
            className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-[#C1AE7C]/45 blur-2xl animate-swirl"
          />

          {/* Floating Orb 2: Vivid Orchid (#CC4BC2) */}
          <div 
            className="absolute top-20 right-0 w-48 h-48 rounded-full bg-[#CC4BC2]/40 blur-2xl animate-swirl"
            style={{ animationDelay: '3s' }}
          />

          {/* Floating Orb 3: Bubblegum Pink (#E16F7C) */}
          <div 
            className="absolute bottom-10 left-10 w-44 h-44 rounded-full bg-[#E16F7C]/45 blur-2xl animate-swirl"
            style={{ animationDelay: '6s' }}
          />

          {/* Floating Orb 4: Blackberry Cream (#6C3A5C) */}
          <div 
            className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-[#6C3A5C]/40 blur-2xl animate-blob-spin"
          />

          {/* Moving Diagonal Light Ray */}
          <div 
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              background: 'repeating-linear-gradient(60deg, transparent, transparent 20px, rgba(255,255,255,0.8) 20px, rgba(255,255,255,0.8) 40px)',
              animation: 'shineSweep 7s linear infinite'
            }}
          />
        </div>

        {/* Floating Shining Stars across the 5 colors */}
        {/* Star 1: Top-left Sand Gold Star */}
        <div className="absolute top-4 left-5 animate-star-shine pointer-events-none z-20">
          <Star className="w-8 h-8 text-[#C1AE7C] fill-[#C1AE7C] drop-shadow-[0_0_15px_#C1AE7C]" />
        </div>

        {/* Star 2: Top-right Peony Star */}
        <div className="absolute top-5 right-6 animate-star-shine pointer-events-none z-20" style={{ animationDelay: '1.2s' }}>
          <Sparkles className="w-7 h-7 text-[#DD5E98] drop-shadow-[0_0_15px_#CC4BC2]" />
        </div>

        {/* Star 3: Center-left Orchid Star */}
        <div className="absolute top-1/2 left-3 animate-star-shine pointer-events-none z-20" style={{ animationDelay: '2.4s' }}>
          <Star className="w-6 h-6 text-[#CC4BC2] fill-[#CC4BC2] drop-shadow-[0_0_12px_#CC4BC2]" />
        </div>

        {/* Star 4: Bottom Bubblegum Glitter */}
        <div className="absolute bottom-16 right-5 animate-star-shine pointer-events-none z-20" style={{ animationDelay: '1.8s' }}>
          <div className="w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_12px_#E16F7C]" />
        </div>

        {minimized ? (
          /* Minimized State */
          <button 
            onClick={() => setMinimized(false)}
            className="w-full h-full flex flex-col items-center justify-center relative z-20 text-[#6C3A5C] hover:scale-110 transition-transform"
            title="Expand AI Guardian"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] flex items-center justify-center text-white shadow-xl shadow-[#DD5E98]/40 animate-pulse-glow">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xs font-black font-cursive text-[#6C3A5C] mt-1">Guardian</span>
          </button>
        ) : (
          /* Full Large Interactive Square Content */
          <div className="relative z-20 flex flex-col justify-between h-full p-6 text-[#2e1828]">
            {/* Header: Title in Cursive & Minimize Button */}
            <div className="flex items-center justify-between pl-8 pr-1 pt-1">
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full bg-white/90 border-2 border-[#DD5E98]/40 shadow-sm backdrop-blur-md flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E16F7C] animate-ping" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#6C3A5C] font-mono">
                    Live Guardian
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMinimized(true)}
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-[#E16F7C]/30 flex items-center justify-center text-lg font-black text-[#6C3A5C] transition shadow-sm"
                title="Minimize corner box"
              >
                ×
              </button>
            </div>

            {/* Central Visual: Cursive Script Headline & Shield Status */}
            <div className="text-center my-auto px-2 py-1">
              {/* Central Glowing Icon */}
              <div className="inline-flex relative p-4 rounded-3xl bg-gradient-to-tr from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] text-white shadow-2xl shadow-[#DD5E98]/50 group-hover:scale-110 transition-transform duration-300 border-2 border-white/60">
                <Cpu className="w-9 h-9 animate-pulse" />
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#C1AE7C] rounded-full border-2 border-white flex items-center justify-center shadow">
                  <Star className="w-3 h-3 text-white fill-white" />
                </div>
              </div>

              {/* Distinctive Cursive Heading with Larger Text */}
              <h3 className="font-cursive text-3xl sm:text-4xl font-extrabold text-[#3a142e] tracking-wide mt-2 drop-shadow-sm">
                AI Code Quality Guardian
              </h3>

              {/* Serif / Display Subtitle */}
              <p className="font-display italic text-sm sm:text-base font-bold text-[#6C3A5C] mt-0.5">
                Stage 1 AST Linter & Stage 2 AI Review
              </p>

              {/* Status Pills */}
              <div className="flex items-center justify-center gap-2 mt-2.5">
                <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
                  ✓ 100% Active Shield
                </span>
                <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-[#C1AE7C]/25 text-[#6C3A5C] border border-[#C1AE7C]/40 shadow-sm">
                  ★ Grade A Guard
                </span>
              </div>
            </div>

            {/* Bottom: 5-Color Palette Swatches with Clear Labels */}
            <div className="pt-3 border-t-2 border-[#E16F7C]/25 flex flex-col gap-1.5 bg-white/70 -mx-6 -mb-6 p-4 rounded-b-none backdrop-blur-md">
              <div className="flex items-center justify-center gap-3">
                <div className="flex flex-col items-center">
                  <span className="w-5 h-3 rounded-full bg-[#C1AE7C] shadow border border-white" title="Sand (#C1AE7C)"></span>
                  <span className="text-[9px] font-bold text-[#6C3A5C] font-mono mt-0.5">Sand</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="w-5 h-3 rounded-full bg-[#E16F7C] shadow border border-white" title="Bubblegum (#E16F7C)"></span>
                  <span className="text-[9px] font-bold text-[#6C3A5C] font-mono mt-0.5">Pink</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="w-5 h-3 rounded-full bg-[#DD5E98] shadow border border-white" title="Peony (#DD5E98)"></span>
                  <span className="text-[9px] font-bold text-[#6C3A5C] font-mono mt-0.5">Peony</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="w-5 h-3 rounded-full bg-[#CC4BC2] shadow border border-white" title="Orchid (#CC4BC2)"></span>
                  <span className="text-[9px] font-bold text-[#6C3A5C] font-mono mt-0.5">Orchid</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="w-5 h-3 rounded-full bg-[#6C3A5C] shadow border border-white" title="Blackberry (#6C3A5C)"></span>
                  <span className="text-[9px] font-bold text-[#6C3A5C] font-mono mt-0.5">Blackberry</span>
                </div>
              </div>
              <div className="text-center font-cursive text-sm font-bold text-[#6C3A5C]">
                World-Class 5-Color Radiant Guardian
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
