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
    <div className="space-y-8 pt-6 border-t-2 border-[#DD5E98]/30 animate-fade-in">
      {/* Doc View Navigation with Strictly Increased Sizes */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/95 p-5 rounded-3xl border-2 border-[#DD5E98]/35 shadow-md">
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setDocTab('functions')}
            className={`px-4 py-2 rounded-2xl text-sm sm:text-base font-black transition ${
              docTab === 'functions'
                ? 'bg-gradient-to-r from-[#E16F7C] to-[#DD5E98] text-white shadow-md'
                : 'text-[#6C3A5C] hover:text-[#2d0f25] hover:bg-[#E16F7C]/15'
            }`}
          >
            Functions ({functionDocs.length})
          </button>

          <button
            onClick={() => setDocTab('classes')}
            className={`px-4 py-2 rounded-2xl text-sm sm:text-base font-black transition ${
              docTab === 'classes'
                ? 'bg-gradient-to-r from-[#E16F7C] to-[#DD5E98] text-white shadow-md'
                : 'text-[#6C3A5C] hover:text-[#2d0f25] hover:bg-[#E16F7C]/15'
            }`}
          >
            Classes ({classDocs.length})
          </button>

          <button
            onClick={() => setDocTab('apis')}
            className={`px-4 py-2 rounded-2xl text-sm sm:text-base font-black transition ${
              docTab === 'apis'
                ? 'bg-gradient-to-r from-[#E16F7C] to-[#DD5E98] text-white shadow-md'
                : 'text-[#6C3A5C] hover:text-[#2d0f25] hover:bg-[#E16F7C]/15'
            }`}
          >
            REST Endpoints ({apiDocs.length})
          </button>

          <button
            onClick={() => setDocTab('markdown')}
            className={`px-4 py-2 rounded-2xl text-sm sm:text-base font-black transition ${
              docTab === 'markdown'
                ? 'bg-gradient-to-r from-[#E16F7C] to-[#DD5E98] text-white shadow-md'
                : 'text-[#6C3A5C] hover:text-[#2d0f25] hover:bg-[#E16F7C]/15'
            }`}
          >
            Full Markdown
          </button>
        </div>

        <button
          onClick={downloadMarkdown}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-[#fff5f9] border-2 border-[#DD5E98]/40 text-sm sm:text-base font-black text-[#6C3A5C] shadow-sm transition"
        >
          <Download className="w-5 h-5 text-[#DD5E98]" />
          <span>Export Markdown</span>
        </button>
      </div>

      {/* Doc Tab: Functions */}
      {docTab === 'functions' && (
        <div className="space-y-5">
          {functionDocs.length === 0 ? (
            <p className="text-base text-[#6C3A5C] font-bold">No standalone functions detected in snippet.</p>
          ) : (
            functionDocs.map((fn, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-3xl border-2 border-[#DD5E98]/30 bg-white/95 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Code className="w-5 h-5 text-[#DD5E98]" />
                    <span className="text-base font-mono font-black text-[#2d0f25]">{fn.name}()</span>
                  </div>
                  <button
                    onClick={() => copyText(fn.jsdoc, `fn-${idx}`)}
                    className="p-2 rounded-xl bg-white border border-[#DD5E98]/40 text-[#6C3A5C] hover:text-[#DD5E98] transition shadow-sm"
                  >
                    {copiedId === `fn-${idx}` ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-sm sm:text-base text-[#6C3A5C] font-bold">{fn.description}</p>
                <pre className="p-4 rounded-2xl bg-[#faf5f9] border-2 border-[#DD5E98]/30 text-sm font-mono text-[#2d0f25] overflow-x-auto font-bold">
                  <code>{fn.jsdoc}</code>
                </pre>
              </div>
            ))
          )}
        </div>
      )}

      {/* Doc Tab: Full Markdown */}
      {docTab === 'markdown' && (
        <div className="glass-panel p-8 rounded-[36px] border-2 border-[#DD5E98]/35 bg-white/95 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-black text-[#2d0f25]">Compiled Technical Documentation</h4>
            <button
              onClick={() => copyText(markdownSummary, 'md-all')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border-2 border-[#DD5E98]/40 text-sm font-black text-[#6C3A5C] shadow-sm transition"
            >
              {copiedId === 'md-all' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#DD5E98]" />}
              <span>{copiedId === 'md-all' ? 'Copied' : 'Copy Markdown'}</span>
            </button>
          </div>
          <pre className="p-5 rounded-2xl bg-[#faf5f9] border-2 border-[#DD5E98]/30 text-sm font-mono text-[#2d0f25] overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner font-bold">
            <code>{markdownSummary}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
