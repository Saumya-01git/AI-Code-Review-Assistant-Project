import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Zap, 
  HelpCircle, 
  Lightbulb
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
    <div className="space-y-6 pt-5 border-t border-slate-200 animate-fade-in">
      {/* AI Overview Header Card */}
      <div className="relative overflow-hidden rounded-xl bg-white border border-slate-200/90 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E16F7C]/15 text-[#DD5E98] border border-[#E16F7C]/30 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-[#C1AE7C]" />
                <span>{provider || 'AI Intelligence Engine'}</span>
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Stage 2 AI Executive Summary</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-3xl leading-relaxed">
              {overview}
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">AI Quality Score</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1">{aiScore}/100</div>
            <span className="text-[11px] text-[#DD5E98] font-semibold">Senior Benchmark</span>
          </div>
        </div>
      </div>

      {/* Code Explanation & Logical Understanding */}
      <div className="p-6 rounded-xl border border-slate-200/90 bg-white shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
          <HelpCircle className="w-4 h-4 text-[#CC4BC2]" />
          <span>Code Logic & Purpose Explanation</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {codeExplanation}
        </p>
      </div>

      {/* Grid: Potential Bugs & Refactoring Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Bugs Caught */}
        <div className="p-5 rounded-xl border border-slate-200/90 bg-white shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Potential Logic Flaws & Vulnerabilities</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              {bugs.length} Issues
            </span>
          </div>

          {bugs.length === 0 ? (
            <p className="text-xs text-emerald-700">No critical logic flaws detected by AI model.</p>
          ) : (
            <div className="space-y-2.5">
              {bugs.map((b, i) => (
                <div key={i} className="p-3 rounded-lg bg-rose-50/60 border border-rose-200 text-xs text-rose-900 space-y-1">
                  <div>{b.description || b}</div>
                  {b.suggestedFix && (
                    <div className="text-[11px] font-mono text-rose-700 font-semibold">Fix: {b.suggestedFix}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Naming & Performance Suggestions */}
        <div className="p-5 rounded-xl border border-slate-200/90 bg-white shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <Lightbulb className="w-4 h-4 text-[#C1AE7C]" />
              <span>Best Practices & Naming Enhancements</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#C1AE7C]/15 text-[#8f7535] border border-[#C1AE7C]/30">
              {namingSuggestions.length + performanceOptimizations.length} Tips
            </span>
          </div>

          <div className="space-y-2">
            {namingSuggestions.map((n, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-0.5">
                <span className="font-bold text-slate-900">Naming Suggestion: </span>
                <span>{n.suggestion || n}</span>
              </div>
            ))}

            {performanceOptimizations.map((p, i) => (
              <div key={i} className="p-3 rounded-lg bg-[#fff5f9] border border-pink-100 text-xs text-slate-700 space-y-0.5">
                <span className="font-bold text-[#DD5E98]">Performance Tip: </span>
                <span>{p.suggestion || p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Refactored Code Preview */}
      {refactoredCode && (
        <div className="p-5 rounded-xl border border-slate-200/90 bg-white shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Zap className="w-4 h-4 text-[#CC4BC2]" />
              <span>AI Recommended Refactored Implementation</span>
            </div>
            <button
              onClick={copyRefactoredCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm transition"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#CC4BC2]" />}
              <span>{copiedCode ? 'Copied' : 'Copy Refactored Code'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 border border-slate-800 overflow-x-auto text-xs font-mono leading-relaxed">
            <code>{refactoredCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
