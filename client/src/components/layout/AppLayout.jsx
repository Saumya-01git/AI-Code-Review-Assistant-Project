import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import TranslucentCodeBackground from './TranslucentCodeBackground';

export default function AppLayout() {
  return (
    /* Outer Concentric Page Frame with Vivid Aurora Border Gap */
    <div className="min-h-screen w-full p-2.5 sm:p-4 md:p-5 relative overflow-x-hidden flex flex-col bg-gradient-to-br from-[#E16F7C]/30 via-[#DD5E98]/25 via-[#06b6d4]/20 via-[#CC4BC2]/25 to-[#C1AE7C]/35">
      {/* Moving Light Translucent Aurora Mesh filling the small border gap */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-85"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 15%, rgba(193, 174, 124, 0.55) 0%, transparent 45%),
            radial-gradient(circle at 90% 15%, rgba(225, 111, 124, 0.55) 0%, transparent 45%),
            radial-gradient(circle at 50% 35%, rgba(6, 182, 212, 0.40) 0%, transparent 50%),
            radial-gradient(circle at 15% 85%, rgba(204, 75, 194, 0.55) 0%, transparent 45%),
            radial-gradient(circle at 85% 85%, rgba(108, 58, 92, 0.50) 0%, transparent 50%),
            linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(254,242,248,0.85) 50%, rgba(244,247,255,0.92) 100%)
          `,
          backgroundSize: '200% 200%',
          animation: 'auroraMove 9s ease infinite alternate'
        }}
      />

      {/* Dynamic diagonal light shimmer beam in the border gap */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-35 mix-blend-overlay"
        style={{
          background: 'repeating-linear-gradient(60deg, transparent, transparent 30px, rgba(255,255,255,0.85) 30px, rgba(255,255,255,0.85) 60px)',
          animation: 'shineSweep 8s linear infinite'
        }}
      />

      {/* Main Inner App Frame (Concentric Inset Container with slightly smaller footprint) */}
      <div className="relative z-10 flex-1 flex rounded-[32px] sm:rounded-[42px] overflow-hidden border-[3px] border-[#DD5E98]/45 shadow-[0_25px_75px_rgba(204,75,194,0.22)] bg-[#fffbf8]/98 backdrop-blur-3xl transition-all">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Workspace Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          <Navbar />

          {/* Translucent Technical Code & Circuit Illustration Background below all cards */}
          <TranslucentCodeBackground />

          {/* Scrollable Main Content containing all cards and analytics */}
          <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto overflow-y-auto relative z-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
