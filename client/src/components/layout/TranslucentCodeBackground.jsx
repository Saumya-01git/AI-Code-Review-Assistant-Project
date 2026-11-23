import React from 'react';

export default function TranslucentCodeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Soft Multi-Color Ambient Glows */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-gradient-to-br from-[#E16F7C]/15 via-[#DD5E98]/10 to-transparent blur-3xl"></div>
      <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-gradient-to-bl from-[#06b6d4]/12 via-[#CC4BC2]/10 to-transparent blur-3xl"></div>
      <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-gradient-to-tr from-[#C1AE7C]/15 via-[#DD5E98]/10 to-transparent blur-3xl"></div>

      {/* Gentle Tech & Code Grid Watermark */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.07] text-slate-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <pattern id="clean-code-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
            <circle cx="0" cy="0" r="1.5" fill="#DD5E98" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#clean-code-grid)" />

        {/* Large Decorative Floating Code Brackets */}
        <g stroke="#CC4BC2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M 720 80 L 760 120 L 720 160" />
          <path d="M 800 80 L 760 120 L 800 160" />
          <line x1="740" y1="160" x2="780" y2="80" strokeWidth="1.5" />

          {/* Node network */}
          <circle cx="100" cy="240" r="12" stroke="#DD5E98" strokeWidth="1.5" />
          <line x1="112" y1="240" x2="180" y2="290" stroke="#06b6d4" strokeDasharray="4 4" strokeWidth="1.5" />
          <circle cx="180" cy="290" r="8" stroke="#C1AE7C" strokeWidth="1.5" />
          <line x1="180" y1="298" x2="150" y2="360" stroke="#E16F7C" strokeWidth="1.5" />
          <circle cx="150" cy="360" r="10" stroke="#6C3A5C" strokeWidth="1.5" />

          {/* Abstract Binary Matrix */}
          <text x="60" y="440" fontFamily="monospace" fontSize="18" fill="#E16F7C" fontWeight="bold">
            01000001 01010011 01010100
          </text>
          <text x="60" y="470" fontFamily="monospace" fontSize="14" fill="#CC4BC2">
            const review = await ai.analyze(astTree);
          </text>
        </g>
      </svg>
    </div>
  );
}
