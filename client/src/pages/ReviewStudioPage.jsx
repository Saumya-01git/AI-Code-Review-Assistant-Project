import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Code2, 
  UploadCloud, 
  FileCode, 
  Trash2, 
  Save, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  GitBranch,
  ShieldCheck,
  Loader2,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StaticAnalysisResults from '../components/review/StaticAnalysisResults';
import ComplexityDashboard from '../components/review/ComplexityDashboard';
import AIReviewResults from '../components/review/AIReviewResults';
import DocGeneratorView from '../components/review/DocGeneratorView';

const CODE_PRESETS = {
  javascript_buggy: {
    name: 'Buggy JavaScript Example',
    language: 'javascript',
    code: `// Sample: Authentication handler with common flaws
function authenticateUser(req, res) {
  var user_name = req.body.username;
  var user_pass = req.body.password;
  var unused_token = "debug_secret";

  if (user_name == "admin" && user_pass == "123456") {
    // SECURITY RISK: Hardcoded secret and loose equality
    return res.status(200).json({ status: "success", role: "admin" });
  } else {
    // Bug: Possible unhandled exception or missing return
    res.status(401);
  }
}

function calculateOrderTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items[i].discounts.length; j++) {
      if (items[i].discounts[j].type == "PERCENT") {
        total += items[i].price * (1 - items[i].discounts[j].rate);
      }
    }
  }
  return total;
}`
  },
  python_complex: {
    name: 'Complex Python Data Processor',
    language: 'python',
    code: `# Data extraction with high cyclomatic complexity
def process_transactions(records, filter_active=True, tax_rate=0.08):
    cleaned = []
    for r in records:
        if r.get('status') == 'PAID' or (not filter_active and r.get('status') == 'PENDING'):
            val = r.get('amount', 0)
            if val > 1000:
                if r.get('customer_tier') == 'PLATINUM':
                    discount = 0.20
                elif r.get('customer_tier') == 'GOLD':
                    discount = 0.15
                else:
                    discount = 0.05
                val = val * (1 - discount)
            final_tax = val * tax_rate
            cleaned.append({'id': r.get('id'), 'net': val + final_tax})
    return cleaned
`
  },
  typescript_clean: {
    name: 'TypeScript Clean Interface',
    language: 'typescript',
    code: `export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  roles: string[];
}

export function formatUserHeader(user: UserProfile): string {
  const primaryRole = user.roles[0] ?? 'Guest';
  return \`\${user.displayName} (\${primaryRole}) <\${user.email}>\`;
}
`
  }
};

export default function ReviewStudioPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('snippet'); // 'snippet' | 'upload' | 'github'
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(CODE_PRESETS.javascript_buggy.code);
  const [snippetTitle, setSnippetTitle] = useState('My Code Snippet');
  
  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);

  // Review Results States
  const [staticResults, setStaticResults] = useState(null);
  const [aiResults, setAiResults] = useState(null);
  const [complexityResults, setComplexityResults] = useState(null);
  const [docsResults, setDocsResults] = useState(null);
  const [analyzingStatic, setAnalyzingStatic] = useState(false);
  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [analyzingFull, setAnalyzingFull] = useState(false);
  const [generatingDocs, setGeneratingDocs] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState('static');

  const editorInstanceRef = useRef(null);
  const resultsRef = useRef(null);

  const handleEditorDidMount = (editor) => {
    editorInstanceRef.current = editor;
  };

  const handleLineClick = (lineNum) => {
    if (editorInstanceRef.current && lineNum) {
      editorInstanceRef.current.revealLineInCenter(lineNum);
      editorInstanceRef.current.setPosition({ lineNumber: lineNum, column: 1 });
      editorInstanceRef.current.focus();
    }
  };

  const handleRunStaticAnalysis = async () => {
    if (!code || !code.trim()) {
      showNotification('error', 'Please provide or paste source code to analyze.');
      return;
    }

    setAnalyzingStatic(true);
    setNotification(null);

    try {
      const res = await fetch('/api/reviews/static', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          code,
          language,
          fileName: snippetTitle || 'snippet.js',
          saveToHistory: true
        })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Static analysis failed');

      setStaticResults(data);
      setActiveResultTab('static');
      showNotification('success', `Stage 1 Static Analysis complete: ${data.summary.totalIssues} issue(s) detected.`);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setAnalyzingStatic(false);
    }
  };

  const handleRunFullSuite = async () => {
    if (!code || !code.trim()) {
      showNotification('error', 'Please provide or paste source code to analyze.');
      return;
    }

    setAnalyzingFull(true);
    setNotification(null);

    try {
      const res = await fetch('/api/reviews/full', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          code,
          language,
          fileName: snippetTitle || 'code.js',
          saveToHistory: true
        })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Full review suite failed');

      setStaticResults(data.staticAnalysis);
      setAiResults(data.aiAnalysis);
      setComplexityResults(data.complexityAnalysis);
      setActiveResultTab('ai');
      showNotification('success', `Full Review executed! Quality Score: ${data.overallScore}/100`);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setAnalyzingFull(false);
    }
  };

  const handleGenerateDocs = async () => {
    if (!code || !code.trim()) {
      showNotification('error', 'Please provide source code to generate documentation.');
      return;
    }

    setGeneratingDocs(true);
    setNotification(null);

    try {
      const res = await fetch('/api/reviews/docs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          code,
          language,
          fileName: snippetTitle || 'code.js'
        })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Documentation generation failed');

      setDocsResults(data);
      setActiveResultTab('docs');
      showNotification('success', `Generated documentation for ${data.summary.totalFunctions} functions & ${data.summary.totalClasses} classes.`);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setGeneratingDocs(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handlePresetChange = (key) => {
    if (!key || !CODE_PRESETS[key]) return;
    const preset = CODE_PRESETS[key];
    setLanguage(preset.language);
    setCode(preset.code);
    setSnippetTitle(preset.name);
    showNotification('success', `Loaded ${preset.name}`);
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'File upload failed');

      setUploadedFiles(data.files);
      setSelectedFileIdx(0);
      if (data.files.length > 0) {
        setCode(data.files[0].content);
        setLanguage(data.files[0].language);
        setSnippetTitle(data.files[0].originalName);
      }
      showNotification('success', `Successfully uploaded ${data.files.length} file(s)`);
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSelectUploadedFile = (idx) => {
    setSelectedFileIdx(idx);
    const file = uploadedFiles[idx];
    if (file) {
      setCode(file.content);
      setLanguage(file.language);
      setSnippetTitle(file.originalName);
    }
  };

  const handleSaveSnippet = async () => {
    try {
      const res = await fetch('/api/snippets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: snippetTitle,
          code,
          language
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      showNotification('success', 'Snippet saved successfully to workspace!');
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  const lines = code ? code.split('\n').length : 0;
  const chars = code ? code.length : 0;

  return (
    <div className="space-y-7 animate-fade-in pb-16">
      {/* Studio Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3 tracking-tight">
            <Code2 className="w-8 h-8 text-[#F72585]" />
            <span>Review Studio & Code Workspace</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-1.5 font-normal">
            Submit code snippets or upload source files to inspect syntax, quality, complexity, and security.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSaveSnippet}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-sm sm:text-base font-bold transition shadow-sm hover:border-[#4361EE]/40"
          >
            <Save className="w-4 h-4 text-[#4361EE]" />
            <span>Save Snippet</span>
          </button>

          <button
            onClick={handleRunStaticAnalysis}
            disabled={analyzingStatic || analyzingFull}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-sm sm:text-base font-bold transition disabled:opacity-50 shadow-sm hover:border-[#F72585]/40"
          >
            {analyzingStatic ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#F72585]" />
                <span>Linting...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-[#F72585]" />
                <span>Stage 1: Static</span>
              </>
            )}
          </button>

          <button
            onClick={handleGenerateDocs}
            disabled={generatingDocs || analyzingStatic || analyzingFull}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-sm sm:text-base font-bold transition disabled:opacity-50 shadow-sm hover:border-[#7209B7]/40"
          >
            {generatingDocs ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#7209B7]" />
                <span>Documenting...</span>
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4 text-[#7209B7]" />
                <span>Auto Docs</span>
              </>
            )}
          </button>

          <button
            onClick={handleRunFullSuite}
            disabled={analyzingStatic || analyzingFull}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F72585] via-[#7209B7] to-[#4361EE] text-white text-sm sm:text-base font-bold shadow-md shadow-[#4361EE]/25 hover:shadow-lg hover:shadow-[#F72585]/35 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
          >
            {analyzingFull ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deep Reviewing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#4CC9F0]" />
                <span>Full Review & Complexity</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl border text-sm sm:text-base font-bold flex items-center gap-2.5 transition-all shadow-sm ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Submission Method Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('snippet')}
          className={`pb-3.5 text-sm sm:text-base font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'snippet'
              ? 'border-[#F72585] text-[#3A0CA3] font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#F72585]" />
          <span>Paste Code Snippet</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`pb-3.5 text-sm sm:text-base font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'upload'
              ? 'border-[#4361EE] text-[#3A0CA3] font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UploadCloud className="w-4 h-4 sm:w-5 sm:h-5 text-[#4361EE]" />
          <span>Upload Source Files</span>
          {uploadedFiles.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#4361EE]/15 text-[#4361EE] text-xs font-mono font-bold">
              {uploadedFiles.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('github')}
          className={`pb-3.5 text-sm sm:text-base font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'github'
              ? 'border-[#7209B7] text-[#3A0CA3] font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GitBranch className="w-4 h-4 sm:w-5 sm:h-5 text-[#7209B7]" />
          <span>GitHub Repo (Scope Note)</span>
        </button>
      </div>

      {/* Upload tab UI */}
      {activeTab === 'upload' && (
        <div className="p-8 rounded-2xl border-2 border-dashed border-slate-300 bg-white text-center">
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.html,.css,.json"
          />
          <UploadCloud className="w-12 h-12 text-[#4361EE] mx-auto mb-3" />
          <p className="text-base font-bold text-slate-800">Drag & drop files or browse</p>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-4">Supports .js, .jsx, .ts, .tsx, .py, .java, .cpp, .html, .css</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F72585] to-[#4361EE] text-white text-sm sm:text-base font-bold shadow-sm hover:opacity-95"
          >
            {uploading ? 'Uploading...' : 'Select Files'}
          </button>

          {uploadedFiles.length > 0 && (
            <div className="mt-6 text-left border-t border-slate-100 pt-4">
              <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider block mb-2.5">Uploaded Files:</span>
              <div className="flex flex-wrap gap-2">
                {uploadedFiles.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectUploadedFile(idx)}
                    className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 border transition ${
                      selectedFileIdx === idx
                        ? 'bg-[#4361EE]/15 border-[#4361EE] text-[#3A0CA3] font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <FileCode className="w-4 h-4 text-[#4361EE]" />
                    <span>{file.originalName}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* GitHub Tab Scope Note UI */}
      {activeTab === 'github' && (
        <div className="p-7 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-3 mb-3">
            <GitBranch className="w-6 h-6 text-[#7209B7]" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">GitHub Repository Architecture</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 font-normal">
            Our Day 5 architecture allows analyzing remote public GitHub repositories. In current workspace mode, submit any repository URL or browse source code directly in the code editor below.
          </p>
          <div className="flex gap-2.5">
            <input
              type="text"
              placeholder="e.g. https://github.com/Saumya-01git/AI-Code-Review-Assistant-Project"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-800 outline-none focus:border-[#7209B7]"
            />
            <button
              onClick={() => showNotification('success', 'GitHub repository URL queued for AST analysis.')}
              className="px-5 py-2.5 rounded-xl bg-[#3A0CA3] text-white text-xs sm:text-sm font-bold shadow-sm hover:opacity-90"
            >
              Inspect Repo
            </button>
          </div>
        </div>
      )}

      {/* Top Toolbar with Slightly Increased Text */}
      <div className="p-4 sm:p-5 rounded-xl flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200/90 shadow-sm">
        <div className="flex flex-wrap items-center gap-5">
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-slate-600">Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-50 border border-slate-200 focus:border-[#4361EE] rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 font-bold outline-none"
            >
              <option value="javascript">JavaScript (Node / Web)</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="json">JSON</option>
            </select>
          </div>

          {/* Sample Presets Loader */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-slate-600">Load Preset:</span>
            <select
              onChange={(e) => handlePresetChange(e.target.value)}
              defaultValue=""
              className="bg-slate-50 border border-slate-200 focus:border-[#4361EE] rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 font-bold outline-none"
            >
              <option value="" disabled>Choose a template...</option>
              <option value="javascript_buggy">Buggy JavaScript (Auth Flaws)</option>
              <option value="python_complex">Complex Python (Nested Logic)</option>
              <option value="typescript_clean">Clean TypeScript Interface</option>
            </select>
          </div>
        </div>

        {/* Stats summary */}
        <div className="flex items-center gap-4 text-xs sm:text-sm font-mono font-semibold text-slate-500">
          <span>{lines} lines</span>
          <span>{chars} chars</span>
          <button
            onClick={() => setCode('')}
            title="Clear Editor"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Monaco Code Editor Workspace */}
      <div className="rounded-xl overflow-hidden border border-slate-200/90 shadow-sm bg-white">
        <div className="h-11 bg-slate-50 border-b border-slate-200 px-5 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-700 font-mono font-bold">
            <FileCheck className="w-4 h-4 text-[#F72585]" />
            <span>{snippetTitle}</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold uppercase bg-slate-200/70 text-slate-700">
            {language}
          </span>
        </div>

        <div className="h-[480px] w-full">
          <Editor
            height="100%"
            language={language}
            theme="vs"
            value={code}
            onMount={handleEditorDidMount}
            onChange={(val) => setCode(val || '')}
            options={{
              fontSize: 15,
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              roundedSelection: true,
              automaticLayout: true,
              padding: { top: 14, bottom: 14 },
              tabSize: 2
            }}
          />
        </div>
      </div>

      {/* Review Results Suite */}
      {(staticResults || aiResults || complexityResults || docsResults) && (
        <div ref={resultsRef} className="space-y-6">
          {/* Results Tab Selector */}
          <div className="flex border-b border-slate-200 gap-5 mt-8">
            {staticResults && (
              <button
                onClick={() => setActiveResultTab('static')}
                className={`pb-3.5 text-sm sm:text-base font-bold flex items-center gap-2 border-b-2 transition ${
                  activeResultTab === 'static'
                    ? 'border-[#F72585] text-[#3A0CA3] font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#F72585]" />
                <span>Stage 1: Static Analysis</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F72585]/15 text-[#F72585] text-xs font-mono font-bold">
                  {staticResults.findings.length}
                </span>
              </button>
            )}

            {aiResults && (
              <button
                onClick={() => setActiveResultTab('ai')}
                className={`pb-3.5 text-sm sm:text-base font-bold flex items-center gap-2 border-b-2 transition ${
                  activeResultTab === 'ai'
                    ? 'border-[#4361EE] text-[#3A0CA3] font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#4361EE]" />
                <span>Stage 2: AI Review</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#4361EE]/15 text-[#4361EE] text-xs font-mono font-bold">
                  {aiResults.aiScore}/100
                </span>
              </button>
            )}

            {complexityResults && (
              <button
                onClick={() => setActiveResultTab('complexity')}
                className={`pb-3.5 text-sm sm:text-base font-bold flex items-center gap-2 border-b-2 transition ${
                  activeResultTab === 'complexity'
                    ? 'border-[#7209B7] text-[#7209B7] font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#7209B7]" />
                <span>Complexity & Smells</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#7209B7]/15 text-[#7209B7] text-xs font-mono font-bold">
                  M={complexityResults.cyclomaticComplexity.score}
                </span>
              </button>
            )}

            {docsResults && (
              <button
                onClick={() => setActiveResultTab('docs')}
                className={`pb-3.5 text-sm sm:text-base font-bold flex items-center gap-2 border-b-2 transition ${
                  activeResultTab === 'docs'
                    ? 'border-[#4CC9F0] text-[#0284c7] font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#4CC9F0]" />
                <span>Auto Documentation</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#4CC9F0]/15 text-[#0284c7] text-xs font-mono font-bold">
                  {docsResults.summary.totalFunctions} Docs
                </span>
              </button>
            )}
          </div>

          {/* Active Tab View */}
          {activeResultTab === 'static' && staticResults && (
            <StaticAnalysisResults 
              results={staticResults} 
              onLineClick={handleLineClick} 
            />
          )}

          {activeResultTab === 'ai' && aiResults && (
            <AIReviewResults 
              aiResults={aiResults} 
              onLineClick={handleLineClick} 
            />
          )}

          {activeResultTab === 'complexity' && complexityResults && (
            <ComplexityDashboard 
              complexity={complexityResults} 
              onLineClick={handleLineClick} 
            />
          )}

          {activeResultTab === 'docs' && docsResults && (
            <DocGeneratorView 
              docs={docsResults} 
              onLineClick={handleLineClick} 
            />
          )}
        </div>
      )}
    </div>
  );
}
