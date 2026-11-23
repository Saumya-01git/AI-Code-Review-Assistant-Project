import React from 'react';
import { 
  Activity, 
  Layers, 
  AlertTriangle, 
  FileText
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
    if (rating === 'High Risk') return 'bg-rose-50 text-rose-700 border-rose-200';
    if (rating === 'Moderate Risk') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="space-y-6 pt-5 border-t border-slate-200 animate-fade-in">
      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cyclomatic Complexity */}
        <div className="p-5 rounded-xl border border-slate-200/90 bg-white shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Cyclomatic Score</span>
            <Activity className="w-4 h-4 text-[#DD5E98]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1.5">
            {cyclomaticComplexity.score || 1}
          </div>
          <div className="mt-2">
            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getRatingBadge(cyclomaticComplexity.rating)}`}>
              {cyclomaticComplexity.rating || 'Low Risk'}
            </span>
          </div>
        </div>

        {/* Lines of Code */}
        <div className="p-5 rounded-xl border border-slate-200/90 bg-white shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Lines of Code (LOC)</span>
            <FileText className="w-4 h-4 text-[#C1AE7C]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1.5">
            {metrics.loc || 0}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {metrics.commentLines || 0} comment lines
          </div>
        </div>

        {/* Functions Detected */}
        <div className="p-5 rounded-xl border border-slate-200/90 bg-white shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Functions Count</span>
            <Layers className="w-4 h-4 text-[#CC4BC2]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1.5">
            {functionComplexity.length || 0}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Analyzed subroutines
          </div>
        </div>

        {/* Code Smells */}
        <div className="p-5 rounded-xl border border-slate-200/90 bg-white shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Code Smells Caught</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1.5">
            {codeSmells.length || 0}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Structural refactoring tips
          </div>
        </div>
      </div>

      {/* Code Smells Breakdown */}
      {codeSmells.length > 0 && (
        <div className="p-5 rounded-xl border border-amber-200 bg-white shadow-sm space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Identified Code Smells & Architectural Warnings</span>
          </h4>
          <div className="space-y-2">
            {codeSmells.map((s, i) => (
              <div key={i} className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950">{s.name || s.type}</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
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
