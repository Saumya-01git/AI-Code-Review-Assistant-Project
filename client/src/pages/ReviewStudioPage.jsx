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
  Info,
  Play,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StaticAnalysisResults from '../components/review/StaticAnalysisResults';
import ComplexityDashboard from '../components/review/ComplexityDashboard';
import AIReviewResults from '../components/review/AIReviewResults';

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
  const [activeTab, setActiveTab] = useState('snippet'); // 'snippet' | 'upload'
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
  const [analyzingStatic, setAnalyzingStatic] = useState(false);
  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [analyzingFull, setAnalyzingFull] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState('static'); // 'static' | 'ai' | 'complexity'

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

      setStaticResults(data.static);
      setAiResults(data.ai);
      setComplexityResults(data.complexity);
      setActiveResultTab('complexity');
      showNotification('success', `Full Review Complete! Overall Quality Score: ${data.overallScore}/100`);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setAnalyzingFull(false);
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
    <div className="space-y-6 animate-fade-in">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <span>Review Studio & Code Workspace</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Submit code snippets or upload source files to inspect syntax, quality, complexity, and security.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveSnippet}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition"
          >
            <Save className="w-3.5 h-3.5 text-slate-400" />
            <span>Save Snippet</span>
          </button>

          <button
            onClick={handleRunStaticAnalysis}
            disabled={analyzingStatic || analyzingFull}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition disabled:opacity-50"
          >
            {analyzingStatic ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Linting...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Stage 1: Static</span>
              </>
            )}
          </button>

          <button
            onClick={handleRunFullSuite}
            disabled={analyzingStatic || analyzingFull}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
          >
            {analyzingFull ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deep Review & Complexity...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Full Review & Complexity</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Submission Method Tabs */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('snippet')}
          className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'snippet'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Paste Code Snippet</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'upload'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Source Files</span>
          {uploadedFiles.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px]">
              {uploadedFiles.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('github')}
          className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'github'
              ? 'border-indigo-400 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>GitHub Repo (Scope Note)</span>
        </button>
      </div>

      {/* GitHub Repo Scope Note View */}
      {activeTab === 'github' && (
        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">GitHub Repository API Integration</h3>
              <p className="text-xs text-indigo-300 font-medium">Curriculum Scope Specification: Not Working on</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Per the internship project documentation (Day 5 & Core Requirements), direct GitHub remote repository crawling is explicitly marked as <span className="text-amber-400 font-semibold">"Not Working on"</span> to focus development on in-memory snippet analysis and direct source file uploads via Multer.
          </p>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-medium">
              <Info className="w-4 h-4" />
              <span>Recommended Workflow</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Please switch to the <strong>Paste Code Snippet</strong> tab to inspect code directly in Monaco Editor, or use <strong>Upload Source Files</strong> to upload your project files.
            </p>
          </div>
        </div>
      )}

      {/* Top Toolbar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none"
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
            <span className="text-xs text-slate-400">Load Preset:</span>
            <select
              onChange={(e) => handlePresetChange(e.target.value)}
              defaultValue=""
              className="bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none"
            >
              <option value="" disabled>Choose a template...</option>
              <option value="javascript_buggy">Buggy JavaScript (Auth Flaws)</option>
              <option value="python_complex">Complex Python (Nested Logic)</option>
              <option value="typescript_clean">Clean TypeScript Interface</option>
            </select>
          </div>
        </div>

        {/* Stats summary */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span>{lines} lines</span>
          <span>{chars} characters</span>
          <button
            onClick={() => setCode('')}
            title="Clear Editor"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Upload Zone (If in upload mode) */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-900/40 hover:bg-slate-900/70 rounded-2xl p-8 text-center cursor-pointer transition group"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.h,.html,.css,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">
              {uploading ? 'Processing uploaded files...' : 'Click or drag files here to upload'}
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Supports JavaScript, TypeScript, Python, Java, C++, HTML, and CSS (up to 5MB each).
            </p>
          </div>

          {/* Uploaded Files Chips */}
          {uploadedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((f, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectUploadedFile(i)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                    selectedFileIdx === i
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{f.originalName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({f.lineCount} lines)</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Monaco Code Editor Workspace */}
      <div className="rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-950">
        <div className="h-10 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-mono">
            <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>{snippetTitle}</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-400">
            {language}
          </span>
        </div>

        <div className="h-[460px] w-full">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onMount={handleEditorDidMount}
            onChange={(val) => setCode(val || '')}
            options={{
              fontSize: 13,
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              roundedSelection: true,
              automaticLayout: true,
              padding: { top: 12, bottom: 12 },
              tabSize: 2
            }}
          />
        </div>
      </div>

      {/* Review Results Suite */}
      {(staticResults || aiResults || complexityResults) && (
        <div ref={resultsRef} className="space-y-4">
          {/* Results Tab Selector */}
          <div className="flex border-b border-slate-800 gap-4 mt-8">
            {staticResults && (
              <button
                onClick={() => setActiveResultTab('static')}
                className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
                  activeResultTab === 'static'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Stage 1: Static Analysis</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                  {staticResults.findings.length}
                </span>
              </button>
            )}

            {aiResults && (
              <button
                onClick={() => setActiveResultTab('ai')}
                className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
                  activeResultTab === 'ai'
                    ? 'border-indigo-400 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Stage 2: AI Review</span>
                <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px]">
                  {aiResults.aiScore}/100
                </span>
              </button>
            )}

            {complexityResults && (
              <button
                onClick={() => setActiveResultTab('complexity')}
                className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
                  activeResultTab === 'complexity'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>Complexity & Code Smells</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px]">
                  M={complexityResults.cyclomaticComplexity.score}
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
        </div>
      )}
    </div>
  );
}
