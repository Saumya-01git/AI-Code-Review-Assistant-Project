import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import TranslucentCodeBackground from './TranslucentCodeBackground';

export default function AppLayout() {
  return (
    /* Outer Concentric Frame with Vibrant Multi-Color Light Gap */
    <div className="min-h-screen w-full p-2.5 sm:p-3 md:p-3.5 relative overflow-x-hidden flex flex-col bg-gradient-to-br from-slate-100 via-[#f4f6fc] to-[#fbf5f8]">
      {/* Moving Ambient Aurora in Outer Border Gap using the 5 Vibrant Colors */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: `
            radial-gradient(circle at 8% 12%, rgba(247, 37, 133, 0.22) 0%, transparent 45%),
            radial-gradient(circle at 92% 12%, rgba(67, 97, 238, 0.22) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(76, 201, 240, 0.16) 0%, transparent 50%),
            radial-gradient(circle at 15% 85%, rgba(114, 9, 183, 0.18) 0%, transparent 45%),
            radial-gradient(circle at 85% 85%, rgba(58, 12, 163, 0.18) 0%, transparent 45%),
            linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(244,247,254,0.8) 100%)
          `,
          backgroundSize: '200% 200%',
          animation: 'auroraMove 12s ease infinite alternate'
        }}
      />

      {/* Main Inner App Frame (Clean, Crisp White Container with Subtle Vibrant Ring) */}
      <div className="relative z-10 flex-1 flex rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl shadow-indigo-950/5 bg-white transition-all">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Workspace Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          <Navbar />

          {/* Translucent Technical Watermark Background below all cards */}
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
