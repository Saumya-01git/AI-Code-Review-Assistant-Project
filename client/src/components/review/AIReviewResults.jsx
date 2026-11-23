import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Zap, 
  HelpCircle,
  Lightbulb,
  FileCode
} from 'lucide-react';

export default function AIReviewResults({ aiResults, onLineClick }) {
  const [copiedCode, setCopiedCode] = useState(false);

  if (!aiResults) return null;

  const {
    overview,
    codeExplanation,
    aiScore = 85,
    bugs = [],
    namingSuggestions = [],
    performanceOptimizations = [],
    refactoredCode,
    provider
  } = aiResults;

  const copyRefactoredCode = () => {
    if (refactoredCode) {
      navigator.clipboard.writeText(refactoredCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="space-y-6 pt-6 border-t border-slate-800 animate-fade-in">
      {/* AI Overview Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>{provider || 'AI Intelligence Engine'}</span>
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Stage 2 AI Executive Summary</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {overview}
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-center">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300">AI Quality Score</span>
            <div className="text-3xl font-extrabold text-white mt-1">{aiScore}/100</div>
            <span className="text-[10px] text-slate-400">Senior Benchmark</span>
          </div>
        </div>
      </div>

      {/* Code Explanation Section */}
      {codeExplanation && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            <span>Plain-English Code Logic & Workflow</span>
          </h4>
          <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            {codeExplanation}
          </p>
        </div>
      )}

      {/* Detected Cognitive & Runtime Bugs */}
      {bugs.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>AI Bug Risks & Logical Flaws ({bugs.length})</span>
          </h4>
          <div className="space-y-3">
            {bugs.map((bug, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      bug.severity === 'high'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {bug.severity} Risk
                    </span>
                    {bug.lineNumber && (
                      <button
                        onClick={() => onLineClick && onLineClick(bug.lineNumber)}
                        className="text-[11px] font-mono text-slate-400 hover:text-cyan-400 underline"
                      >
                        Line {bug.lineNumber}
                      </button>
                    )}
                  </div>
                </div>
                <h5 className="text-xs font-semibold text-white">{bug.title}</h5>
                <p className="text-xs text-slate-300 mt-1">{bug.description}</p>
                {bug.recommendation && (
                  <div className="mt-2 text-xs font-mono text-emerald-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase mb-0.5">AI Fix:</span>
                    {bug.recommendation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Naming & Performance Optimization Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Naming Suggestions */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            <span>Better Naming Suggestions</span>
          </h4>
          {namingSuggestions.length === 0 ? (
            <p className="text-xs text-slate-400">Identifiers follow clear idioms.</p>
          ) : (
            <div className="space-y-2.5">
              {namingSuggestions.map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-rose-400 line-through">{item.original}</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-emerald-400 font-semibold">{item.suggested}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{item.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Performance Optimizations */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Performance & Algorithmic Optimizations</span>
          </h4>
          {performanceOptimizations.length === 0 ? (
            <p className="text-xs text-slate-400">No major performance bottlenecks detected.</p>
          ) : (
            <div className="space-y-2.5">
              {performanceOptimizations.map((opt, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white">{opt.area}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300">
                      Impact: {opt.estimatedImpact}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">{opt.suggestion}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Senior Refactored Code Snippet */}
      {refactoredCode && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <FileCode className="w-4 h-4" />
              <span>Recommended Production Refactored Code</span>
            </h4>
            <button
              onClick={copyRefactoredCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Refactored Code'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
            {refactoredCode}
          </pre>
        </div>
      )}
    </div>
  );
}
