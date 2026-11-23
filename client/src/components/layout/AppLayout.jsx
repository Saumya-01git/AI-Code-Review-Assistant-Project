import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import TranslucentCodeBackground from './TranslucentCodeBackground';

export default function AppLayout() {
  return (
    /* Outer Concentric Frame with Clean, Modern Aesthetic */
    <div className="min-h-screen w-full p-2 sm:p-2.5 md:p-3 relative overflow-x-hidden flex flex-col bg-slate-100/90">
      {/* Soft Multi-color Ambient Aura in Outer Border Gap */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 15%, rgba(193, 174, 124, 0.20) 0%, transparent 45%),
            radial-gradient(circle at 90% 15%, rgba(225, 111, 124, 0.20) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.10) 0%, transparent 50%),
            radial-gradient(circle at 85% 85%, rgba(204, 75, 194, 0.20) 0%, transparent 45%),
            linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(248,250,252,0.8) 100%)
          `,
          backgroundSize: '200% 200%',
          animation: 'auroraMove 14s ease infinite alternate'
        }}
      />

      {/* Main Inner App Frame (Clean, Crisp White Container) */}
      <div className="relative z-10 flex-1 flex rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl bg-white transition-all">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Workspace Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          <Navbar />

          {/* Translucent Technical Watermark Background below all cards */}
          <TranslucentCodeBackground />

          {/* Scrollable Main Content containing all cards and analytics */}
          <main className="flex-1 p-5 md:p-7 max-w-7xl w-full mx-auto overflow-y-auto relative z-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
