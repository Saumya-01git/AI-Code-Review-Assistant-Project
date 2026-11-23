import React from 'react';
import { Code2, Sparkles, UploadCloud } from 'lucide-react';

export default function ReviewStudioPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <span>Review Studio</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Submit code snippets or source files for automated two-stage analysis.
          </p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-3 border border-cyan-500/20">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white">Review Studio Ready</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
          Monaco Editor and Multer file upload integration ready for Day 4.
        </p>
      </div>
    </div>
  );
}
