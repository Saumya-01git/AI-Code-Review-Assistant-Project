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
  ShieldCheck
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
    if (score >= 90) return 'text-emerald-700 border-emerald-300 bg-emerald-50';
    if (score >= 75) return 'text-[#DD5E98] border-[#DD5E98]/30 bg-[#DD5E98]/10';
    if (score >= 60) return 'text-[#8f7535] border-[#C1AE7C]/40 bg-[#C1AE7C]/15';
    return 'text-rose-700 border-rose-300 bg-rose-50';
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
    <div className="space-y-6 pt-5 border-t border-slate-200 animate-fade-in">
      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Score Card */}
        <div className={`p-5 rounded-xl border shadow-sm flex items-center justify-between ${getScoreColor(overallScore)}`}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider opacity-85">Static Score</span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-display">{overallScore}</span>
              <span className="text-xs font-semibold opacity-75">/100</span>
            </div>
            <span className="text-xs font-medium opacity-85 mt-1 inline-block">
              Grade {getScoreGrade(overallScore)} Rating
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/90 shadow-sm border border-current text-xl font-bold">
            {getScoreGrade(overallScore)}
          </div>
        </div>

        {/* Errors Card */}
        <div className="p-5 rounded-xl border border-slate-200/90 bg-white shadow-sm">
          <div className="flex items-center justify-between text-rose-600 font-semibold">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Errors</span>
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1.5">{summary.errors || 0}</div>
          <span className="text-xs text-slate-500 mt-1 block">Critical syntax & security</span>
        </div>

        {/* Warnings Card */}
        <div className="p-5 rounded-xl border border-slate-200/90 bg-white shadow-sm">
          <div className="flex items-center justify-between text-amber-600 font-semibold">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Warnings</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1.5">{summary.warnings || 0}</div>
          <span className="text-xs text-slate-500 mt-1 block">Unused vars, loose equality</span>
        </div>

        {/* Info & Style Card */}
        <div className="p-5 rounded-xl border border-slate-200/90 bg-white shadow-sm">
          <div className="flex items-center justify-between text-[#DD5E98] font-semibold">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Styling & Spacing</span>
            <Info className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1.5">{summary.infos || 0}</div>
          <span className="text-xs text-slate-500 mt-1 block">Formatting, console logs</span>
        </div>
      </div>

      {/* Filter and Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400 ml-1 mr-1" />
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'all'
                ? 'bg-gradient-to-r from-[#E16F7C] to-[#DD5E98] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All ({findings.length})
          </button>
          <button
            onClick={() => setFilter('error')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'error'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50'
            }`}
          >
            Errors ({summary.errors || 0})
          </button>
          <button
            onClick={() => setFilter('warning')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'warning'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
            }`}
          >
            Warnings ({summary.warnings || 0})
          </button>
          <button
            onClick={() => setFilter('info')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'info'
                ? 'bg-[#CC4BC2] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#CC4BC2] hover:bg-purple-50'
            }`}
          >
            Info ({summary.infos || 0})
          </button>
        </div>

        {/* Export & Copy buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={copySummaryReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-sm transition"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#DD5E98]" />}
            <span>{copiedSummary ? 'Copied' : 'Copy Report'}</span>
          </button>
          <button
            onClick={downloadJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-[#CC4BC2]" />
            <span>Download JSON</span>
          </button>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {filteredFindings.length === 0 ? (
          <div className="p-8 rounded-xl border border-slate-200 text-center bg-white">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-900">No Issues in this Category</h4>
            <p className="text-xs text-slate-500 mt-1">
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
              ? 'bg-rose-50 text-rose-700 border-rose-200' 
              : isWarning 
              ? 'bg-amber-50 text-amber-700 border-amber-200' 
              : 'bg-[#E16F7C]/10 text-[#DD5E98] border-[#E16F7C]/30';

            const Icon = isError ? AlertCircle : isWarning ? AlertTriangle : Info;

            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl border border-slate-200/90 hover:border-[#DD5E98]/40 transition group bg-white shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border uppercase tracking-wider flex items-center gap-1.5 ${badgeBg}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{finding.severity}</span>
                    </span>

                    {finding.line_number && (
                      <button
                        onClick={() => onLineClick && onLineClick(finding.line_number)}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-mono font-semibold border border-slate-200 hover:border-[#DD5E98] transition"
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

                  <span className="text-[11px] font-mono text-slate-400">
                    {finding.file_name || fileName || 'code'}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#DD5E98] transition">
                  {finding.issue}
                </h4>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {finding.explanation}
                </p>

                {finding.suggested_fix && (
                  <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                    <div className="space-y-1 overflow-x-auto">
                      <span className="text-[11px] font-bold tracking-wider text-[#DD5E98] uppercase">
                        Recommended Solution:
                      </span>
                      <p className="text-xs font-mono text-slate-800">
                        {finding.suggested_fix}
                      </p>
                    </div>

                    <button
                      onClick={() => copyFix(finding.suggested_fix, idx)}
                      title="Copy Fix"
                      className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-[#DD5E98] transition shrink-0"
                    >
                      {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
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
