import React, { useState } from 'react';
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  Filter,
  ShieldCheck,
  ShieldAlert,
  Code
} from 'lucide-react';

export default function StaticAnalysisResults({ results, onLineClick }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'error' | 'warning' | 'info'
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!results) return null;

  const { overallScore, findings = [], summary = {}, fileName, language, lineCount } = results;

  const filteredFindings = findings.filter(f => {
    if (filter === 'all') return true;
    return f.severity === filter;
  });

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-800 border-emerald-400 bg-emerald-50';
    if (score >= 75) return 'text-[#DD5E98] border-[#DD5E98]/50 bg-[#DD5E98]/15';
    if (score >= 60) return 'text-[#C1AE7C] border-[#C1AE7C]/50 bg-[#C1AE7C]/20';
    return 'text-rose-800 border-rose-400 bg-rose-50';
  };

  const getScoreGrade = (score) => {
    if (score >= 95) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 75) return 'B';
    if (score >= 60) return 'C';
    return 'F';
  };

  const copyFix = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const copySummaryReport = () => {
    const text = `Static Code Review Report for ${fileName || 'code'}
Overall Score: ${overallScore}/100 (Grade ${getScoreGrade(overallScore)})
Total Findings: ${findings.length} (Errors: ${summary.errors || 0}, Warnings: ${summary.warnings || 0}, Info: ${summary.infos || 0})

Issues:
${findings.map((f, i) => `${i + 1}. [${f.severity.toUpperCase()}] Line ${f.line_number}: ${f.issue} (${f.rule || 'rule'}) - ${f.suggested_fix}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `static-analysis-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 pt-6 border-t-2 border-[#DD5E98]/30 animate-fade-in">
      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Score Card */}
        <div className={`p-6 rounded-3xl border-2 shadow-md flex items-center justify-between ${getScoreColor(overallScore)}`}>
          <div>
            <span className="text-sm font-black uppercase tracking-wider opacity-90">Static Score</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl sm:text-5xl font-black font-display">{overallScore}</span>
              <span className="text-base font-bold opacity-80">/100</span>
            </div>
            <span className="text-xs sm:text-sm font-bold opacity-90 mt-1.5 inline-block">
              Grade {getScoreGrade(overallScore)} Rating
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/80 shadow border border-current text-3xl font-black">
            {getScoreGrade(overallScore)}
          </div>
        </div>

        {/* Errors Card */}
        <div className="glass-panel p-6 rounded-3xl border-2 border-rose-300 bg-white/95 shadow-md">
          <div className="flex items-center justify-between text-rose-600 font-black">
            <span className="text-sm font-black">Errors</span>
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="text-4xl font-black font-display text-[#2d0f25] mt-2">{summary.errors || 0}</div>
          <span className="text-xs sm:text-sm text-[#6C3A5C] mt-1.5 block font-bold">Critical syntax & security</span>
        </div>

        {/* Warnings Card */}
        <div className="glass-panel p-6 rounded-3xl border-2 border-amber-300 bg-white/95 shadow-md">
          <div className="flex items-center justify-between text-amber-600 font-black">
            <span className="text-sm font-black">Warnings</span>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-4xl font-black font-display text-[#2d0f25] mt-2">{summary.warnings || 0}</div>
          <span className="text-xs sm:text-sm text-[#6C3A5C] mt-1.5 block font-bold">Unused vars, loose equality</span>
        </div>

        {/* Info & Style Card */}
        <div className="glass-panel p-6 rounded-3xl border-2 border-[#DD5E98]/30 bg-white/95 shadow-md">
          <div className="flex items-center justify-between text-[#DD5E98] font-black">
            <span className="text-sm font-black">Styling & Spacing</span>
            <Info className="w-5 h-5" />
          </div>
          <div className="text-4xl font-black font-display text-[#2d0f25] mt-2">{summary.infos || 0}</div>
          <span className="text-xs sm:text-sm text-[#6C3A5C] mt-1.5 block font-bold">Formatting, console logs</span>
        </div>
      </div>

      {/* Filter and Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/95 p-5 rounded-3xl border-2 border-[#DD5E98]/35 shadow-md">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-5 h-5 text-[#6C3A5C] ml-1 mr-2" />
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-2xl text-sm sm:text-base font-black transition ${
              filter === 'all'
                ? 'bg-gradient-to-r from-[#E16F7C] to-[#DD5E98] text-white shadow-md'
                : 'text-[#6C3A5C] hover:text-[#2d0f25] hover:bg-[#E16F7C]/15'
            }`}
          >
            All ({findings.length})
          </button>
          <button
            onClick={() => setFilter('error')}
            className={`px-4 py-2 rounded-2xl text-sm sm:text-base font-black transition ${
              filter === 'error'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-[#6C3A5C] hover:text-rose-600 hover:bg-rose-50'
            }`}
          >
            Errors ({summary.errors || 0})
          </button>
          <button
            onClick={() => setFilter('warning')}
            className={`px-4 py-2 rounded-2xl text-sm sm:text-base font-black transition ${
              filter === 'warning'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-[#6C3A5C] hover:text-amber-600 hover:bg-amber-50'
            }`}
          >
            Warnings ({summary.warnings || 0})
          </button>
          <button
            onClick={() => setFilter('info')}
            className={`px-4 py-2 rounded-2xl text-sm sm:text-base font-black transition ${
              filter === 'info'
                ? 'bg-[#CC4BC2] text-white shadow-md'
                : 'text-[#6C3A5C] hover:text-[#CC4BC2] hover:bg-[#CC4BC2]/15'
            }`}
          >
            Info ({summary.infos || 0})
          </button>
        </div>

        {/* Export & Copy buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={copySummaryReport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#fff5f9] text-[#6C3A5C] text-sm sm:text-base font-black border-2 border-[#DD5E98]/40 shadow-sm transition"
          >
            {copiedSummary ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#DD5E98]" />}
            <span>{copiedSummary ? 'Copied' : 'Copy Report'}</span>
          </button>
          <button
            onClick={downloadJson}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#fff5f9] text-[#6C3A5C] text-sm sm:text-base font-black border-2 border-[#DD5E98]/40 shadow-sm transition"
          >
            <Download className="w-4 h-4 text-[#CC4BC2]" />
            <span>Download JSON</span>
          </button>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {filteredFindings.length === 0 ? (
          <div className="glass-panel p-10 rounded-[36px] border-2 border-[#DD5E98]/35 text-center bg-white/95">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h4 className="text-lg font-black text-[#2d0f25]">No Issues in this Category</h4>
            <p className="text-sm sm:text-base text-[#6C3A5C] mt-1.5 font-bold">
              {filter === 'all' 
                ? 'Your code passed all static analysis checks cleanly!' 
                : `No ${filter} issues were detected in this analysis.`}
            </p>
          </div>
        ) : (
          filteredFindings.map((finding, idx) => {
            const isError = finding.severity === 'error';
            const isWarning = finding.severity === 'warning';
            const badgeBg = isError 
              ? 'bg-rose-100 text-rose-800 border-rose-300' 
              : isWarning 
              ? 'bg-amber-100 text-amber-900 border-amber-300' 
              : 'bg-[#E16F7C]/25 text-[#2d0f25] border-[#E16F7C]/50';

            const Icon = isError ? AlertCircle : isWarning ? AlertTriangle : Info;

            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-3xl border-2 border-[#DD5E98]/30 hover:border-[#CC4BC2]/60 transition group bg-white/95 shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-xl text-xs font-black border uppercase tracking-wider flex items-center gap-2 ${badgeBg}`}>
                      <Icon className="w-4 h-4" />
                      <span>{finding.severity}</span>
                    </span>

                    {finding.line_number && (
                      <button
                        onClick={() => onLineClick && onLineClick(finding.line_number)}
                        className="px-3 py-1 rounded-xl bg-[#faf5f9] text-[#6C3A5C] text-xs font-mono font-black border-2 border-[#DD5E98]/40 hover:border-[#DD5E98] transition shadow-sm"
                      >
                        Line {finding.line_number}
                      </button>
                    )}

                    {finding.rule && (
                      <span className="text-xs font-mono font-bold text-[#6C3A5C]/90">
                        rule: {finding.rule}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-mono font-bold text-[#6C3A5C]/80">
                    {finding.file_name || fileName || 'code'}
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-black text-[#2d0f25] group-hover:text-[#DD5E98] transition">
                  {finding.issue}
                </h4>

                <p className="text-sm sm:text-base text-[#6C3A5C] mt-2 leading-relaxed font-bold">
                  {finding.explanation}
                </p>

                {finding.suggested_fix && (
                  <div className="mt-4 p-4 rounded-2xl bg-[#fff7fa] border-2 border-[#DD5E98]/35 flex items-start justify-between gap-4 shadow-inner">
                    <div className="space-y-1.5 overflow-x-auto">
                      <span className="text-xs font-black tracking-wider text-[#DD5E98] uppercase">
                        Recommended Solution:
                      </span>
                      <p className="text-sm sm:text-base font-mono font-black text-[#2d0f25]">
                        {finding.suggested_fix}
                      </p>
                    </div>

                    <button
                      onClick={() => copyFix(finding.suggested_fix, idx)}
                      title="Copy Fix"
                      className="p-2 rounded-xl bg-white border border-[#DD5E98]/40 text-[#6C3A5C] hover:text-[#DD5E98] transition shrink-0 shadow-sm"
                    >
                      {copiedIdx === idx ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
