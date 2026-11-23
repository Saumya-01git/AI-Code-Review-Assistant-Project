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
    <div className="space-y-8 pt-6 border-t-2 border-[#DD5E98]/30 animate-fade-in">
      {/* AI Overview Header Card */}
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-white/95 via-[#fff3f8]/95 to-white/95 border-2 border-[#DD5E98]/40 p-8 shadow-2xl shadow-[#DD5E98]/15">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#E16F7C]/25 text-[#2d0f25] border border-[#E16F7C]/40 flex items-center gap-2 shadow-sm font-mono">
                <Sparkles className="w-4 h-4 text-[#C1AE7C]" />
                <span>{provider || 'AI Intelligence Engine'}</span>
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display text-[#2d0f25]">Stage 2 AI Executive Summary</h3>
            <p className="text-sm sm:text-base text-[#6C3A5C] font-bold mt-2 max-w-3xl leading-relaxed">
              {overview}
            </p>
          </div>

          <div className="shrink-0 p-6 rounded-3xl bg-white border-2 border-[#DD5E98]/40 text-center shadow-lg">
            <span className="text-xs font-black uppercase tracking-wider text-[#6C3A5C]">AI Quality Score</span>
            <div className="text-4xl sm:text-5xl font-black font-display text-[#2d0f25] mt-1.5">{aiScore}/100</div>
            <span className="text-xs text-[#DD5E98] font-black">Senior Benchmark</span>
          </div>
        </div>
      </div>

      {/* Code Explanation & Logical Understanding */}
      <div className="glass-panel p-8 rounded-[36px] border-2 border-[#DD5E98]/35 bg-white/95 shadow-md space-y-3">
        <div className="flex items-center gap-2.5 text-[#DD5E98] font-black text-lg sm:text-xl">
          <HelpCircle className="w-5 h-5 text-[#CC4BC2]" />
          <span>Code Logic & Purpose Explanation</span>
        </div>
        <p className="text-sm sm:text-base text-[#6C3A5C] leading-relaxed whitespace-pre-line font-bold">
          {codeExplanation}
        </p>
      </div>

      {/* Grid: Potential Bugs & Refactoring Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bugs Caught */}
        <div className="glass-panel p-8 rounded-[36px] border-2 border-rose-300 bg-white/95 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-rose-600 font-black text-lg">
              <AlertCircle className="w-5 h-5" />
              <span>Potential Logic Flaws & Vulnerabilities</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800">
              {bugs.length} Issues
            </span>
          </div>

          {bugs.length === 0 ? (
            <p className="text-sm text-emerald-700 font-bold">No critical logic flaws detected by AI model.</p>
          ) : (
            <div className="space-y-3">
              {bugs.map((b, i) => (
                <div key={i} className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-sm text-rose-900 space-y-1.5 font-bold">
                  <div>{b.description || b}</div>
                  {b.suggestedFix && (
                    <div className="text-xs font-mono font-black text-rose-700">Fix: {b.suggestedFix}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Naming & Performance Suggestions */}
        <div className="glass-panel p-8 rounded-[36px] border-2 border-[#C1AE7C]/50 bg-white/95 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-[#6C3A5C] font-black text-lg">
              <Lightbulb className="w-5 h-5 text-[#C1AE7C]" />
              <span>Best Practices & Naming Enhancements</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#C1AE7C]/25 text-[#2d0f25]">
              {namingSuggestions.length + performanceOptimizations.length} Tips
            </span>
          </div>

          <div className="space-y-3">
            {namingSuggestions.map((n, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#faf6ea] border-2 border-[#C1AE7C]/40 text-sm text-[#6C3A5C] space-y-1 font-bold">
                <span className="text-[#2d0f25] font-black">Naming Suggestion: </span>
                <span>{n.suggestion || n}</span>
              </div>
            ))}

            {performanceOptimizations.map((p, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#fff5f9] border-2 border-[#E16F7C]/40 text-sm text-[#6C3A5C] space-y-1 font-bold">
                <span className="text-[#DD5E98] font-black">Performance Tip: </span>
                <span>{p.suggestion || p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Refactored Code Preview */}
      {refactoredCode && (
        <div className="glass-panel p-8 rounded-[36px] border-2 border-[#CC4BC2]/45 bg-white/95 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-[#2d0f25] font-black text-lg">
              <Zap className="w-5 h-5 text-[#CC4BC2]" />
              <span>AI Recommended Refactored Implementation</span>
            </div>
            <button
              onClick={copyRefactoredCode}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#fff5f9] border-2 border-[#CC4BC2]/40 text-sm font-black text-[#6C3A5C] shadow-sm transition"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#CC4BC2]" />}
              <span>{copiedCode ? 'Copied' : 'Copy Refactored Code'}</span>
            </button>
          </div>

          <pre className="p-5 rounded-2xl bg-[#faf5f9] border-2 border-[#CC4BC2]/30 overflow-x-auto text-sm sm:text-base font-mono text-[#2d0f25] leading-relaxed shadow-inner font-bold">
            <code>{refactoredCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
