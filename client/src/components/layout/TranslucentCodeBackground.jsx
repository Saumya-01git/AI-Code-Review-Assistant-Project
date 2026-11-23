import React from 'react';

export default function TranslucentCodeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Delicate 5-Color Radiant Radial Highlights */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-[#C1AE7C]/20 to-[#E16F7C]/15 blur-3xl"></div>
      <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-gradient-to-bl from-[#DD5E98]/20 to-[#CC4BC2]/15 blur-3xl"></div>
      <div className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#6C3A5C]/15 via-[#CC4BC2]/15 to-transparent blur-3xl"></div>

      {/* Translucent Geometric Code & Circuit Watermark Illustration */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.12] text-[#6C3A5C]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <pattern id="code-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
            <circle cx="0" cy="0" r="2.5" fill="#DD5E98" />
          </pattern>
          <linearGradient id="codeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C1AE7C" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#E16F7C" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#CC4BC2" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Subtle grid pattern background */}
        <rect width="100%" height="100%" fill="url(#code-grid)" />

        {/* Large Decorative Floating Code Brackets and Symbols */}
        <g stroke="url(#codeGrad1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Top Right Code Bracket */}
          <path d="M 680 80 L 730 130 L 680 180" />
          <path d="M 780 80 L 730 130 L 780 180" />
          <line x1="710" y1="180" x2="750" y2="80" strokeWidth="2" />

          {/* Left Side Code Node Network */}
          <circle cx="120" cy="280" r="16" stroke="#DD5E98" strokeWidth="2" />
          <line x1="136" y1="280" x2="220" y2="340" stroke="#CC4BC2" strokeDasharray="4 4" />
          <circle cx="220" cy="340" r="10" stroke="#C1AE7C" strokeWidth="2" />
          <line x1="220" y1="350" x2="180" y2="440" stroke="#E16F7C" />
          <circle cx="180" cy="440" r="14" stroke="#6C3A5C" strokeWidth="2" />

          {/* Abstract Binary & Logic Matrix */}
          <text x="80" y="520" fontFamily="monospace" fontSize="22" fill="#E16F7C" fontWeight="bold">
            01000001 01010011 01010100
          </text>
          <text x="80" y="550" fontFamily="monospace" fontSize="16" fill="#CC4BC2">
            const review = await ai.analyze(astTree);
          </text>

          {/* Right Floating Function Signature */}
          <text x="650" y="480" fontFamily="monospace" fontSize="20" fill="#DD5E98" fontWeight="bold">
            fn cyclomaticComplexity(node) =&gt; M
          </text>
          <path d="M 620 460 Q 640 475, 620 490" stroke="#C1AE7C" strokeWidth="2" />

          {/* Center Hexagonal Shield Silhouette */}
          <polygon points="500,200 560,235 560,305 500,340 440,305 440,235" stroke="#E16F7C" strokeWidth="1.8" />
          <polygon points="500,220 540,245 540,295 500,320 460,295 460,245" stroke="#CC4BC2" strokeDasharray="3 3" />
        </g>
      </svg>
    </div>
  );
}
