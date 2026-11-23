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
    if (rating === 'High Risk') return 'bg-rose-100 text-rose-700 border-rose-300';
    if (rating === 'Moderate Risk') return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-emerald-100 text-emerald-700 border-emerald-300';
  };

  return (
    <div className="space-y-6 pt-6 border-t-2 border-[#E16F7C]/25 animate-fade-in">
      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cyclomatic Complexity */}
        <div className="glass-panel p-5 rounded-2xl border-2 border-[#E16F7C]/30 bg-white/95 shadow-sm">
          <div className="flex items-center justify-between text-[#6C3A5C]">
            <span className="text-xs font-bold">Cyclomatic Complexity</span>
            <Activity className="w-4 h-4 text-[#DD5E98]" />
          </div>
          <div className="text-3xl font-black text-[#3a142e] mt-2">
            {cyclomaticComplexity.score || 1}
          </div>
          <div className="mt-2">
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getRatingBadge(cyclomaticComplexity.rating)}`}>
              {cyclomaticComplexity.rating || 'Low Risk'}
            </span>
          </div>
        </div>

        {/* Lines of Code */}
        <div className="glass-panel p-5 rounded-2xl border-2 border-[#E16F7C]/30 bg-white/95 shadow-sm">
          <div className="flex items-center justify-between text-[#6C3A5C]">
            <span className="text-xs font-bold">Lines of Code (LOC)</span>
            <FileText className="w-4 h-4 text-[#C1AE7C]" />
          </div>
          <div className="text-3xl font-black text-[#3a142e] mt-2">
            {metrics.loc || 0}
          </div>
          <div className="text-[11px] text-[#6C3A5C] mt-2 font-semibold">
            {metrics.commentLines || 0} comment lines
          </div>
        </div>

        {/* Functions Detected */}
        <div className="glass-panel p-5 rounded-2xl border-2 border-[#E16F7C]/30 bg-white/95 shadow-sm">
          <div className="flex items-center justify-between text-[#6C3A5C]">
            <span className="text-xs font-bold">Functions Count</span>
            <Layers className="w-4 h-4 text-[#CC4BC2]" />
          </div>
          <div className="text-3xl font-black text-[#3a142e] mt-2">
            {functionComplexity.length || 0}
          </div>
          <div className="text-[11px] text-[#6C3A5C] mt-2 font-semibold">
            Analyzed subroutines
          </div>
        </div>

        {/* Code Smells */}
        <div className="glass-panel p-5 rounded-2xl border-2 border-[#E16F7C]/30 bg-white/95 shadow-sm">
          <div className="flex items-center justify-between text-[#6C3A5C]">
            <span className="text-xs font-bold">Code Smells Caught</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-[#3a142e] mt-2">
            {codeSmells.length || 0}
          </div>
          <div className="text-[11px] text-[#6C3A5C] mt-2 font-semibold">
            Structural refactoring tips
          </div>
        </div>
      </div>

      {/* Code Smells Breakdown */}
      {codeSmells.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border-2 border-amber-300 bg-white/95 shadow-md space-y-3">
          <h4 className="text-sm font-black text-[#3a142e] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Identified Code Smells & Architectural Warnings</span>
          </h4>
          <div className="space-y-2.5">
            {codeSmells.map((s, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1 font-medium">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-900">{s.name || s.type}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                    {s.severity || 'Medium'}
                  </span>
                </div>
                <p className="text-amber-800">{s.message || s.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
