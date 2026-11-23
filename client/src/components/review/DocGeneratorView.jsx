import React, { useState } from 'react';
import { 
  Code, 
  Copy, 
  Check, 
  Download
} from 'lucide-react';

export default function DocGeneratorView({ docs, onLineClick }) {
  const [docTab, setDocTab] = useState('functions'); // 'functions' | 'classes' | 'apis' | 'markdown'
  const [copiedId, setCopiedId] = useState(null);

  if (!docs) return null;

  const { functionDocs = [], classDocs = [], apiDocs = [], markdownSummary, fileName } = docs;

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadMarkdown = () => {
    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(markdownSummary);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${fileName || 'code'}-documentation.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pt-5 border-t border-slate-200 animate-fade-in">
      {/* Doc View Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setDocTab('functions')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              docTab === 'functions'
                ? 'bg-gradient-to-r from-[#F72585] to-[#4361EE] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Functions ({functionDocs.length})
          </button>

          <button
            onClick={() => setDocTab('classes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              docTab === 'classes'
                ? 'bg-gradient-to-r from-[#F72585] to-[#4361EE] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Classes ({classDocs.length})
          </button>

          <button
            onClick={() => setDocTab('apis')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              docTab === 'apis'
                ? 'bg-gradient-to-r from-[#F72585] to-[#4361EE] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            REST Endpoints ({apiDocs.length})
          </button>

          <button
            onClick={() => setDocTab('markdown')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              docTab === 'markdown'
                ? 'bg-gradient-to-r from-[#F72585] to-[#4361EE] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Full Markdown
          </button>
        </div>

        <button
          onClick={downloadMarkdown}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 shadow-sm transition hover:border-[#4361EE]/40"
        >
          <Download className="w-4 h-4 text-[#4361EE]" />
          <span>Export Markdown</span>
        </button>
      </div>

      {/* Doc Tab: Functions */}
      {docTab === 'functions' && (
        <div className="space-y-4">
          {functionDocs.length === 0 ? (
            <p className="text-sm text-slate-500">No standalone functions detected in snippet.</p>
          ) : (
            functionDocs.map((fn, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-[#F72585]" />
                    <span className="text-sm sm:text-base font-mono font-bold text-slate-900">{fn.name}()</span>
                  </div>
                  <button
                    onClick={() => copyText(fn.jsdoc, `fn-${idx}`)}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#4361EE] transition shadow-sm"
                  >
                    {copiedId === `fn-${idx}` ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">{fn.description}</p>
                <pre className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-mono text-slate-800 overflow-x-auto">
                  <code>{fn.jsdoc}</code>
                </pre>
              </div>
            ))
          )}
        </div>
      )}

      {/* Doc Tab: Full Markdown */}
      {docTab === 'markdown' && (
        <div className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-900">Compiled Technical Documentation</h4>
            <button
              onClick={() => copyText(markdownSummary, 'md-all')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 shadow-sm transition hover:border-[#4361EE]/40"
            >
              {copiedId === 'md-all' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#4361EE]" />}
              <span>{copiedId === 'md-all' ? 'Copied' : 'Copy Markdown'}</span>
            </button>
          </div>
          <pre className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            <code>{markdownSummary}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
