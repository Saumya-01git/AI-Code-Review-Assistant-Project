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
    if (score >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 75) return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
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
    <div className="space-y-6 pt-6 border-t border-slate-800 animate-fade-in">
      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Score Card */}
        <div className={`p-5 rounded-2xl border flex items-center justify-between ${getScoreColor(overallScore)}`}>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Static Score</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold">{overallScore}</span>
              <span className="text-xs opacity-75">/100</span>
            </div>
            <span className="text-[11px] font-medium opacity-90 mt-1 inline-block">
              Grade {getScoreGrade(overallScore)} Rating
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-black/20 text-2xl font-bold">
            {getScoreGrade(overallScore)}
          </div>
        </div>

        {/* Errors Card */}
        <div className="glass-panel p-5 rounded-2xl border border-rose-500/20">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-medium">Errors</span>
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white mt-1">{summary.errors || 0}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Critical syntax & security</span>
        </div>

        {/* Warnings Card */}
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/20">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-medium">Warnings</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white mt-1">{summary.warnings || 0}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Unused vars, loose equality</span>
        </div>

        {/* Info & Style Card */}
        <div className="glass-panel p-5 rounded-2xl border border-sky-500/20">
          <div className="flex items-center justify-between text-sky-400">
            <span className="text-xs font-medium">Styling & Spacing</span>
            <Info className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white mt-1">{summary.infos || 0}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Formatting, console logs</span>
        </div>
      </div>

      {/* Filter and Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1 mr-2" />
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              filter === 'all'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({findings.length})
          </button>
          <button
            onClick={() => setFilter('error')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              filter === 'error'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            Errors ({summary.errors || 0})
          </button>
          <button
            onClick={() => setFilter('warning')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              filter === 'warning'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            Warnings ({summary.warnings || 0})
          </button>
          <button
            onClick={() => setFilter('info')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              filter === 'info'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-sky-300'
            }`}
          >
            Info ({summary.infos || 0})
          </button>
        </div>

        {/* Export & Copy buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={copySummaryReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSummary ? 'Copied Report' : 'Copy Report'}</span>
          </button>
          <button
            onClick={downloadJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON</span>
          </button>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {filteredFindings.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-white">No Issues in this Category</h4>
            <p className="text-xs text-slate-400 mt-1">
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
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
              : isWarning 
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
              : 'bg-sky-500/10 text-sky-400 border-sky-500/20';

            const Icon = isError ? AlertCircle : isWarning ? AlertTriangle : Info;

            return (
              <div
                key={idx}
                className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border uppercase tracking-wider flex items-center gap-1.5 ${badgeBg}`}>
                      <Icon className="w-3 h-3" />
                      <span>{finding.severity}</span>
                    </span>

                    {finding.line_number && (
                      <button
                        onClick={() => onLineClick && onLineClick(finding.line_number)}
                        className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700 hover:border-cyan-500 transition"
                      >
                        Line {finding.line_number}
                      </button>
                    )}

                    {finding.rule && (
                      <span className="text-[11px] font-mono text-slate-500">
                        rule: {finding.rule}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono">
                    {finding.file_name || fileName || 'code'}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition">
                  {finding.issue}
                </h4>

                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {finding.explanation}
                </p>

                {finding.suggested_fix && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-start justify-between gap-3">
                    <div className="space-y-1 overflow-x-auto">
                      <span className="text-[10px] font-semibold tracking-wider text-cyan-400 uppercase">
                        Recommended Solution:
                      </span>
                      <p className="text-xs font-mono text-emerald-300">
                        {finding.suggested_fix}
                      </p>
                    </div>

                    <button
                      onClick={() => copyFix(finding.suggested_fix, idx)}
                      title="Copy Fix"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition shrink-0"
                    >
                      {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
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
