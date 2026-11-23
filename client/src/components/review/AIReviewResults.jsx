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
  FileCode,
  Star
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
    <div className="space-y-6 pt-6 border-t-2 border-[#E16F7C]/25 animate-fade-in">
      {/* AI Overview Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white/95 via-[#fff3f7]/95 to-white/95 border-2 border-[#E16F7C]/40 p-6 shadow-xl shadow-[#DD5E98]/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#E16F7C]/20 text-[#6C3A5C] border border-[#E16F7C]/40 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#C1AE7C]" />
                <span>{provider || 'AI Intelligence Engine'}</span>
              </span>
            </div>
            <h3 className="text-base font-black text-[#3a142e]">Stage 2 AI Executive Summary</h3>
            <p className="text-xs text-[#6C3A5C] font-semibold mt-1 max-w-2xl leading-relaxed">
              {overview}
            </p>
          </div>

          <div className="shrink-0 p-5 rounded-2xl bg-white border-2 border-[#E16F7C]/35 text-center shadow-md">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6C3A5C]">AI Quality Score</span>
            <div className="text-3xl font-black text-[#3a142e] mt-1">{aiScore}/100</div>
            <span className="text-[10px] text-[#DD5E98] font-bold">Senior Benchmark</span>
          </div>
        </div>
      </div>

      {/* Code Explanation & Logical Understanding */}
      <div className="glass-panel p-6 rounded-3xl border-2 border-[#E16F7C]/30 bg-white/95 shadow-md space-y-3">
        <div className="flex items-center gap-2 text-[#DD5E98] font-black text-sm">
          <HelpCircle className="w-4 h-4 text-[#CC4BC2]" />
          <span>Code Logic & Purpose Explanation</span>
        </div>
        <p className="text-xs text-[#6C3A5C] leading-relaxed whitespace-pre-line font-medium">
          {codeExplanation}
        </p>
      </div>

      {/* Grid: Potential Bugs & Refactoring Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bugs Caught */}
        <div className="glass-panel p-6 rounded-3xl border-2 border-rose-300 bg-white/95 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-600 font-black text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Potential Logic Flaws & Vulnerabilities</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
              {bugs.length} Issues
            </span>
          </div>

          {bugs.length === 0 ? (
            <p className="text-xs text-emerald-600 font-bold">No critical logic flaws detected by AI model.</p>
          ) : (
            <div className="space-y-3">
              {bugs.map((b, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1 font-medium">
                  <div className="font-bold">{b.description || b}</div>
                  {b.suggestedFix && (
                    <div className="text-[11px] text-rose-600 font-mono">Fix: {b.suggestedFix}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Naming & Performance Suggestions */}
        <div className="glass-panel p-6 rounded-3xl border-2 border-[#C1AE7C]/40 bg-white/95 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#6C3A5C] font-black text-sm">
              <Lightbulb className="w-4 h-4 text-[#C1AE7C]" />
              <span>Best Practices & Naming Enhancements</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C1AE7C]/20 text-[#6C3A5C]">
              {namingSuggestions.length + performanceOptimizations.length} Tips
            </span>
          </div>

          <div className="space-y-3">
            {namingSuggestions.map((n, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-[#faf6ea] border border-[#C1AE7C]/30 text-xs text-[#6C3A5C] space-y-1 font-medium">
                <span className="font-bold text-[#3a142e]">Naming Suggestion: </span>
                <span>{n.suggestion || n}</span>
              </div>
            ))}

            {performanceOptimizations.map((p, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-[#fff5f8] border border-[#E16F7C]/30 text-xs text-[#6C3A5C] space-y-1 font-medium">
                <span className="font-bold text-[#DD5E98]">Performance Tip: </span>
                <span>{p.suggestion || p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Refactored Code Preview */}
      {refactoredCode && (
        <div className="glass-panel p-6 rounded-3xl border-2 border-[#CC4BC2]/40 bg-white/95 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#3a142e] font-black text-sm">
              <Zap className="w-4 h-4 text-[#CC4BC2]" />
              <span>AI Recommended Refactored Implementation</span>
            </div>
            <button
              onClick={copyRefactoredCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#fff5f8] border-2 border-[#CC4BC2]/30 text-xs font-bold text-[#6C3A5C] shadow-sm transition"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#CC4BC2]" />}
              <span>{copiedCode ? 'Copied' : 'Copy Refactored Code'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-[#faf5f8] border-2 border-[#CC4BC2]/25 overflow-x-auto text-xs font-mono text-[#3a142e] leading-relaxed shadow-inner">
            <code>{refactoredCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
