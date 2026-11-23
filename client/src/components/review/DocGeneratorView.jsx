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
    <div className="space-y-6 pt-6 border-t border-slate-800 animate-fade-in">
      {/* Doc View Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDocTab('functions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              docTab === 'functions'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Functions ({functionDocs.length})
          </button>

          <button
            onClick={() => setDocTab('classes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              docTab === 'classes'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Classes ({classDocs.length})
          </button>

          <button
            onClick={() => setDocTab('apis')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              docTab === 'apis'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            REST Endpoints ({apiDocs.length})
          </button>

          <button
            onClick={() => setDocTab('markdown')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              docTab === 'markdown'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Markdown Spec
          </button>
        </div>

        <button
          onClick={downloadMarkdown}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Markdown</span>
        </button>
      </div>

      {/* Tab: Functions */}
      {docTab === 'functions' && (
        <div className="space-y-4">
          {functionDocs.length === 0 ? (
            <p className="text-xs text-slate-400">No standalone functions detected for docstring generation.</p>
          ) : (
            functionDocs.map((fn, i) => (
              <div key={i} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-sm font-bold text-white">{fn.signature}</span>
                    <button
                      onClick={() => onLineClick && onLineClick(fn.line)}
                      className="text-[11px] text-slate-400 hover:text-cyan-400 underline"
                    >
                      Line {fn.line}
                    </button>
                  </div>
                  <button
                    onClick={() => copyText(fn.jsdoc, `fn-${i}`)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                  >
                    {copiedId === `fn-${i}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy JSDoc</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300">{fn.purpose}</p>

                {fn.params.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-500">
                          <th className="pb-1.5">Param</th>
                          <th className="pb-1.5">Type</th>
                          <th className="pb-1.5">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {fn.params.map((p, pi) => (
                          <tr key={pi}>
                            <td className="py-1.5 text-cyan-300">{p.name}</td>
                            <td className="py-1.5 text-amber-300 font-semibold">{p.type}</td>
                            <td className="py-1.5 text-slate-400 font-sans">{p.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                  {fn.jsdoc}
                </pre>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Classes */}
      {docTab === 'classes' && (
        <div className="space-y-4">
          {classDocs.length === 0 ? (
            <p className="text-xs text-slate-400">No classes detected in this source code.</p>
          ) : (
            classDocs.map((cls, i) => (
              <div key={i} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-sm font-bold text-white">class {cls.name}</span>
                    {cls.superClass && (
                      <span className="text-xs text-indigo-400">extends {cls.superClass}</span>
                    )}
                  </div>
                  <button
                    onClick={() => copyText(cls.jsdoc, `cls-${i}`)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                  >
                    {copiedId === `cls-${i}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Class Doc</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300">{cls.purpose}</p>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
                  {cls.jsdoc}
                </pre>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: REST APIs */}
      {docTab === 'apis' && (
        <div className="space-y-4">
          {apiDocs.length === 0 ? (
            <p className="text-xs text-slate-400">No Express or HTTP endpoints detected in this snippet.</p>
          ) : (
            apiDocs.map((api, i) => (
              <div key={i} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {api.method}
                    </span>
                    <span className="text-sm font-bold text-white">{api.path}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${
                    api.requiresAuth 
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {api.requiresAuth ? 'Requires Auth' : 'Public'}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{api.description}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Master Markdown */}
      {docTab === 'markdown' && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Generated Markdown Specification</h4>
            <button
              onClick={() => copyText(markdownSummary, 'full-md')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
            >
              {copiedId === 'full-md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'full-md' ? 'Copied Markdown' : 'Copy All'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
            {markdownSummary}
          </pre>
        </div>
      )}
    </div>
  );
}
