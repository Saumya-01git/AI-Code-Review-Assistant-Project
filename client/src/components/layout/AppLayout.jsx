import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import TranslucentCodeBackground from './TranslucentCodeBackground';

export default function AppLayout() {
  return (
    /* Outer Concentric Page Frame */
    <div className="min-h-screen w-full p-2 sm:p-3 md:p-4 relative overflow-x-hidden flex flex-col bg-[#faf4ef]">
      {/* Moving Light Translucent Aurora Mesh filling the small margin between both concentric frames */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-75"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 15%, rgba(193, 174, 124, 0.45) 0%, transparent 45%),
            radial-gradient(circle at 90% 15%, rgba(225, 111, 124, 0.45) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(221, 94, 152, 0.40) 0%, transparent 50%),
            radial-gradient(circle at 15% 85%, rgba(204, 75, 194, 0.45) 0%, transparent 45%),
            radial-gradient(circle at 85% 85%, rgba(108, 58, 92, 0.40) 0%, transparent 50%),
            linear-gradient(135deg, rgba(255,251,245,0.9) 0%, rgba(254,240,246,0.85) 50%, rgba(246,236,245,0.9) 100%)
          `,
          backgroundSize: '200% 200%',
          animation: 'auroraMove 10s ease infinite alternate'
        }}
      />

      {/* Dynamic diagonal light shimmer beam in the border gap */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
        style={{
          background: 'repeating-linear-gradient(60deg, transparent, transparent 25px, rgba(255,255,255,0.7) 25px, rgba(255,255,255,0.7) 50px)',
          animation: 'shineSweep 9s linear infinite'
        }}
      />

      {/* Main Inner App Frame (Concentric Inset Container with slightly smaller footprint) */}
      <div className="relative z-10 flex-1 flex rounded-[28px] sm:rounded-[36px] overflow-hidden border-2 border-[#E16F7C]/45 shadow-[0_25px_65px_rgba(108,58,92,0.16)] bg-[#fffbf7]/98 backdrop-blur-2xl transition-all">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Workspace Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          <Navbar />

          {/* Translucent Technical Code & Circuit Illustration Background below all cards */}
          <TranslucentCodeBackground />

          {/* Scrollable Main Content containing all cards and analytics */}
          <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto relative z-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
