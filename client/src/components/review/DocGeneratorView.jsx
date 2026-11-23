import React, { useState } from 'react';
import { 
  BookOpen, 
  Code, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  Globe, 
  FileText 
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
    <div className="space-y-6 pt-6 border-t-2 border-[#E16F7C]/25 animate-fade-in">
      {/* Doc View Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/95 p-3.5 rounded-2xl border-2 border-[#E16F7C]/30 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setDocTab('functions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              docTab === 'functions'
                ? 'bg-gradient-to-r from-[#E16F7C] to-[#DD5E98] text-white shadow-sm'
                : 'text-[#6C3A5C] hover:text-[#3a142e] hover:bg-[#E16F7C]/15'
            }`}
          >
            Functions ({functionDocs.length})
          </button>

          <button
            onClick={() => setDocTab('classes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              docTab === 'classes'
                ? 'bg-gradient-to-r from-[#E16F7C] to-[#DD5E98] text-white shadow-sm'
                : 'text-[#6C3A5C] hover:text-[#3a142e] hover:bg-[#E16F7C]/15'
            }`}
          >
            Classes ({classDocs.length})
          </button>

          <button
            onClick={() => setDocTab('apis')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              docTab === 'apis'
                ? 'bg-gradient-to-r from-[#E16F7C] to-[#DD5E98] text-white shadow-sm'
                : 'text-[#6C3A5C] hover:text-[#3a142e] hover:bg-[#E16F7C]/15'
            }`}
          >
            REST Endpoints ({apiDocs.length})
          </button>

          <button
            onClick={() => setDocTab('markdown')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              docTab === 'markdown'
                ? 'bg-gradient-to-r from-[#E16F7C] to-[#DD5E98] text-white shadow-sm'
                : 'text-[#6C3A5C] hover:text-[#3a142e] hover:bg-[#E16F7C]/15'
            }`}
          >
            Full Markdown
          </button>
        </div>

        <button
          onClick={downloadMarkdown}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#fff5f8] border-2 border-[#E16F7C]/30 text-xs font-bold text-[#6C3A5C] shadow-sm transition"
        >
          <Download className="w-3.5 h-3.5 text-[#DD5E98]" />
          <span>Export Markdown</span>
        </button>
      </div>

      {/* Doc Tab: Functions */}
      {docTab === 'functions' && (
        <div className="space-y-4">
          {functionDocs.length === 0 ? (
            <p className="text-xs text-[#6C3A5C] font-semibold">No standalone functions detected in snippet.</p>
          ) : (
            functionDocs.map((fn, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-2xl border-2 border-[#E16F7C]/25 bg-white/95 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-[#DD5E98]" />
                    <span className="text-xs font-mono font-bold text-[#3a142e]">{fn.name}()</span>
                  </div>
                  <button
                    onClick={() => copyText(fn.jsdoc, `fn-${idx}`)}
                    className="p-1.5 rounded-xl bg-white border border-[#E16F7C]/30 text-[#6C3A5C] hover:text-[#DD5E98] transition shadow-sm"
                  >
                    {copiedId === `fn-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-xs text-[#6C3A5C] font-medium">{fn.description}</p>
                <pre className="p-3 rounded-xl bg-[#faf5f8] border border-[#E16F7C]/25 text-xs font-mono text-[#3a142e] overflow-x-auto">
                  <code>{fn.jsdoc}</code>
                </pre>
              </div>
            ))
          )}
        </div>
      )}

      {/* Doc Tab: Full Markdown */}
      {docTab === 'markdown' && (
        <div className="glass-panel p-6 rounded-3xl border-2 border-[#E16F7C]/30 bg-white/95 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-[#3a142e]">Compiled Technical Documentation</h4>
            <button
              onClick={() => copyText(markdownSummary, 'md-all')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E16F7C]/30 text-xs font-bold text-[#6C3A5C] shadow-sm transition"
            >
              {copiedId === 'md-all' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#DD5E98]" />}
              <span>{copiedId === 'md-all' ? 'Copied' : 'Copy Markdown'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-[#faf5f8] border border-[#E16F7C]/25 text-xs font-mono text-[#3a142e] overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
            <code>{markdownSummary}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
