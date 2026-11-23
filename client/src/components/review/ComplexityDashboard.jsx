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

  const getRatingBadge = (rating, color) => {
    const colorClasses = {
      emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
    };
    return colorClasses[color] || colorClasses.amber;
  };

  return (
    <div className="space-y-6 pt-6 border-t border-slate-800 animate-fade-in">
      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cyclomatic Complexity */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Cyclomatic Complexity</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">
            {cyclomaticComplexity.score || 1}
          </div>
          <div className="mt-2">
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${getRatingBadge(cyclomaticComplexity.rating, cyclomaticComplexity.color)}`}>
              {cyclomaticComplexity.rating || 'Low Risk'}
            </span>
          </div>
        </div>

        {/* Lines of Code */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Lines of Code (LOC)</span>
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">
            {metrics.linesOfCode || 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-2">
            <span>{metrics.sourceLines || 0} SLOC</span>
            <span>•</span>
            <span>{metrics.commentLines || 0} Comments</span>
          </div>
        </div>

        {/* Functions Count */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Functions Detected</span>
            <Code className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">
            {metrics.functionsCount || 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Average {(metrics.linesOfCode / Math.max(1, metrics.functionsCount)).toFixed(1)} lines/func
          </div>
        </div>

        {/* Classes & Code Smells */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Code Smells</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">
            {summary.totalSmells || 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {metrics.classesCount || 0} Class(es) defined
          </div>
        </div>
      </div>

      {/* Function-Level Complexity Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Function-Level Complexity Breakdown</span>
        </h3>

        {functionComplexity.length === 0 ? (
          <p className="text-xs text-slate-400">No individual functions detected in this code block.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="pb-3 font-medium">Function Name</th>
                  <th className="pb-3 font-medium">Line</th>
                  <th className="pb-3 font-medium">Length</th>
                  <th className="pb-3 font-medium">Parameters</th>
                  <th className="pb-3 font-medium">Cyclomatic Score</th>
                  <th className="pb-3 font-medium">Risk Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {functionComplexity.map((fn, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 text-cyan-300 font-semibold">{fn.name}()</td>
                    <td className="py-3 text-slate-400">
                      <button
                        onClick={() => onLineClick && onLineClick(fn.line)}
                        className="hover:text-cyan-400 underline underline-offset-2"
                      >
                        Line {fn.line}
                      </button>
                    </td>
                    <td className="py-3 text-slate-300">{fn.linesCount} lines</td>
                    <td className="py-3 text-slate-300">{fn.parameterCount} params</td>
                    <td className="py-3 text-slate-200 font-bold">{fn.cyclomaticComplexity}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        fn.risk === 'High'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : fn.risk === 'Moderate'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {fn.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Code Smells Report */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Code Smell Analysis ({codeSmells.length} Identified)</span>
        </h3>

        {codeSmells.length === 0 ? (
          <p className="text-xs text-slate-400">No code smells identified. The code adheres to clean modular principles!</p>
        ) : (
          <div className="space-y-3">
            {codeSmells.map((smell, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {smell.smellType || 'Code Smell'}
                    </span>
                    {smell.line_number && (
                      <button
                        onClick={() => onLineClick && onLineClick(smell.line_number)}
                        className="text-[11px] font-mono text-slate-400 hover:text-cyan-400 underline"
                      >
                        Line {smell.line_number}
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] uppercase font-mono text-slate-500">{smell.severity} severity</span>
                </div>
                <h4 className="text-xs font-semibold text-white">{smell.issue}</h4>
                <p className="text-xs text-slate-300">{smell.explanation}</p>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300">
                  <span className="text-slate-500 block text-[10px] uppercase mb-0.5">Refactoring Advice:</span>
                  {smell.suggested_fix}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
