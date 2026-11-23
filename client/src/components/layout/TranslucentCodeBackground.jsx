import React from 'react';

export default function TranslucentCodeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Soft Multi-Color Ambient Glows in 5 Vibrant Cyber Colors */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#F72585]/14 via-[#7209B7]/10 to-transparent blur-3xl"></div>
      <div className="absolute top-1/4 -right-24 w-96 h-96 rounded-full bg-gradient-to-bl from-[#4CC9F0]/16 via-[#4361EE]/12 to-transparent blur-3xl"></div>
      <div className="absolute -bottom-24 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#3A0CA3]/12 via-[#F72585]/10 to-transparent blur-3xl"></div>

      {/* Gentle Tech & Code Grid Watermark */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.09] text-slate-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <pattern id="clean-code-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
            <circle cx="0" cy="0" r="1.5" fill="#F72585" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#clean-code-grid)" />

        {/* Large Decorative Floating Code Brackets in Sapphire & Neon Pink */}
        <g stroke="#4361EE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M 720 80 L 760 120 L 720 160" />
          <path d="M 800 80 L 760 120 L 800 160" />
          <line x1="740" y1="160" x2="780" y2="80" strokeWidth="1.5" />

          {/* Connected Circuit Node Network */}
          <circle cx="100" cy="240" r="12" stroke="#F72585" strokeWidth="1.5" />
          <line x1="112" y1="240" x2="180" y2="290" stroke="#4CC9F0" strokeDasharray="4 4" strokeWidth="1.5" />
          <circle cx="180" cy="290" r="8" stroke="#4361EE" strokeWidth="1.5" />
          <line x1="180" y1="298" x2="150" y2="360" stroke="#7209B7" strokeWidth="1.5" />
          <circle cx="150" cy="360" r="10" stroke="#3A0CA3" strokeWidth="1.5" />

          {/* Abstract Binary Matrix */}
          <text x="60" y="440" fontFamily="monospace" fontSize="18" fill="#F72585" fontWeight="bold">
            01000001 01010011 01010100
          </text>
          <text x="60" y="470" fontFamily="monospace" fontSize="14" fill="#4361EE">
            const review = await ai.analyze(astTree);
          </text>
        </g>
      </svg>
    </div>
  );
}
