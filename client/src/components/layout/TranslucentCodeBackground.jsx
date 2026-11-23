import React from 'react';

export default function TranslucentCodeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Attractive Radiant Color Blooms: 5 Colors + Cyan & Violet */}
      <div className="absolute -top-32 -left-32 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-[#E16F7C]/30 via-[#DD5E98]/25 to-transparent blur-3xl"></div>
      <div className="absolute top-1/4 -right-28 w-[450px] h-[450px] rounded-full bg-gradient-to-bl from-[#06b6d4]/25 via-[#CC4BC2]/25 to-transparent blur-3xl"></div>
      <div className="absolute -bottom-36 left-1/3 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#C1AE7C]/30 via-[#DD5E98]/25 to-transparent blur-3xl"></div>

      {/* Translucent Geometric Code & Circuit Watermark Illustration */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.16] text-[#6C3A5C]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <pattern id="code-grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="0" cy="0" r="3.5" fill="#DD5E98" />
            <circle cx="100" cy="100" r="3.5" fill="#06b6d4" />
          </pattern>
          <linearGradient id="codeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C1AE7C" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#E16F7C" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#CC4BC2" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Subtle grid pattern background */}
        <rect width="100%" height="100%" fill="url(#code-grid)" />

        {/* Large Decorative Floating Code Brackets and Symbols */}
        <g stroke="url(#codeGrad1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Top Right Code Bracket */}
          <path d="M 660 70 L 720 130 L 660 190" />
          <path d="M 780 70 L 720 130 L 780 190" />
          <line x1="690" y1="190" x2="750" y2="70" strokeWidth="2.5" />

          {/* Left Side Code Node Network */}
          <circle cx="120" cy="280" r="20" stroke="#DD5E98" strokeWidth="2.5" />
          <line x1="140" y1="280" x2="230" y2="350" stroke="#CC4BC2" strokeDasharray="5 5" strokeWidth="2" />
          <circle cx="230" cy="350" r="14" stroke="#06b6d4" strokeWidth="2.5" />
          <line x1="230" y1="364" x2="180" y2="460" stroke="#E16F7C" strokeWidth="2" />
          <circle cx="180" cy="460" r="18" stroke="#6C3A5C" strokeWidth="2.5" />

          {/* Abstract Binary & Logic Matrix */}
          <text x="80" y="540" fontFamily="monospace" fontSize="26" fill="#E16F7C" fontWeight="bold">
            01000001 01010011 01010100
          </text>
          <text x="80" y="580" fontFamily="monospace" fontSize="20" fill="#CC4BC2" fontWeight="600">
            const review = await ai.analyze(astTree);
          </text>

          {/* Right Floating Function Signature */}
          <text x="620" y="490" fontFamily="monospace" fontSize="24" fill="#DD5E98" fontWeight="bold">
            fn cyclomaticComplexity(node) =&gt; M
          </text>
          <path d="M 590 470 Q 610 485, 590 500" stroke="#C1AE7C" strokeWidth="2.5" />

          {/* Center Hexagonal Shield Silhouette */}
          <polygon points="500,180 580,225 580,315 500,360 420,315 420,225" stroke="#E16F7C" strokeWidth="2.5" />
          <polygon points="500,205 555,235 555,300 500,335 445,300 445,235" stroke="#06b6d4" strokeDasharray="4 4" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}
