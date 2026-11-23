import React from 'react';
import { History, Search, Filter } from 'lucide-react';

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <span>Review History</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Explore and audit past code reviews, scores, and findings.
          </p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center">
        <h3 className="text-base font-semibold text-white">Review History Log</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
          Historical search, filtering, and detailed report viewer ready for Day 11.
        </p>
      </div>
    </div>
  );
}
