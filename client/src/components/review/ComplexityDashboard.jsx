import React from 'react';
import { 
  Cpu, 
  Activity, 
  Code, 
  Layers, 
  AlertTriangle, 
  FileText, 
  ArrowRight,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';

export default function ComplexityDashboard({ complexity, onLineClick }) {
  if (!complexity) return null;

  const {
    metrics = {},
    cyclomaticComplexity = {},
    functionComplexity = [],
    codeSmells = [],
    summary = {}
  } = complexity;

  const getRatingBadge = (rating) => {
    if (rating === 'High Risk') return 'bg-rose-100 text-rose-800 border-rose-300';
    if (rating === 'Moderate Risk') return 'bg-amber-100 text-amber-900 border-amber-300';
    return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  };

  return (
    <div className="space-y-8 pt-6 border-t-2 border-[#DD5E98]/30 animate-fade-in">
      {/* Metric KPI Cards with Strictly Increased Sizes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Cyclomatic Complexity */}
        <div className="glass-panel p-6 rounded-3xl border-2 border-[#DD5E98]/35 bg-white/95 shadow-md">
          <div className="flex items-center justify-between text-[#6C3A5C]">
            <span className="text-sm font-black">Cyclomatic Complexity</span>
            <Activity className="w-5 h-5 text-[#DD5E98]" />
          </div>
          <div className="text-4xl sm:text-5xl font-black font-display text-[#2d0f25] mt-2.5">
            {cyclomaticComplexity.score || 1}
          </div>
          <div className="mt-3">
            <span className={`px-3 py-1 rounded-xl text-xs font-black border ${getRatingBadge(cyclomaticComplexity.rating)}`}>
              {cyclomaticComplexity.rating || 'Low Risk'}
            </span>
          </div>
        </div>

        {/* Lines of Code */}
        <div className="glass-panel p-6 rounded-3xl border-2 border-[#DD5E98]/35 bg-white/95 shadow-md">
          <div className="flex items-center justify-between text-[#6C3A5C]">
            <span className="text-sm font-black">Lines of Code (LOC)</span>
            <FileText className="w-5 h-5 text-[#C1AE7C]" />
          </div>
          <div className="text-4xl sm:text-5xl font-black font-display text-[#2d0f25] mt-2.5">
            {metrics.loc || 0}
          </div>
          <div className="text-xs sm:text-sm text-[#6C3A5C] mt-2.5 font-bold">
            {metrics.commentLines || 0} comment lines
          </div>
        </div>

        {/* Functions Detected */}
        <div className="glass-panel p-6 rounded-3xl border-2 border-[#DD5E98]/35 bg-white/95 shadow-md">
          <div className="flex items-center justify-between text-[#6C3A5C]">
            <span className="text-sm font-black">Functions Count</span>
            <Layers className="w-5 h-5 text-[#CC4BC2]" />
          </div>
          <div className="text-4xl sm:text-5xl font-black font-display text-[#2d0f25] mt-2.5">
            {functionComplexity.length || 0}
          </div>
          <div className="text-xs sm:text-sm text-[#6C3A5C] mt-2.5 font-bold">
            Analyzed subroutines
          </div>
        </div>

        {/* Code Smells */}
        <div className="glass-panel p-6 rounded-3xl border-2 border-[#DD5E98]/35 bg-white/95 shadow-md">
          <div className="flex items-center justify-between text-[#6C3A5C]">
            <span className="text-sm font-black">Code Smells Caught</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-4xl sm:text-5xl font-black font-display text-[#2d0f25] mt-2.5">
            {codeSmells.length || 0}
          </div>
          <div className="text-xs sm:text-sm text-[#6C3A5C] mt-2.5 font-bold">
            Structural refactoring tips
          </div>
        </div>
      </div>

      {/* Code Smells Breakdown */}
      {codeSmells.length > 0 && (
        <div className="glass-panel p-8 rounded-[36px] border-2 border-amber-300 bg-white/95 shadow-md space-y-4">
          <h4 className="text-lg font-black text-[#2d0f25] flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>Identified Code Smells & Architectural Warnings</span>
          </h4>
          <div className="space-y-3">
            {codeSmells.map((s, i) => (
              <div key={i} className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-sm space-y-1.5 font-bold">
                <div className="flex items-center justify-between">
                  <span className="font-black text-amber-950 text-base">{s.name || s.type}</span>
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-amber-200 text-amber-900">
                    {s.severity || 'Medium'}
                  </span>
                </div>
                <p className="text-amber-900">{s.message || s.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
