import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  FileCode, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  const metrics = [
    { title: 'Total Reviews', value: '14', change: '+3 this week', icon: Code2, color: 'text-cyan-400' },
    { title: 'Avg Code Quality', value: '88/100', change: 'Grade A', icon: Sparkles, color: 'text-indigo-400' },
    { title: 'Issues Detected', value: '38', change: '12 security alerts', icon: AlertTriangle, color: 'text-amber-400' },
    { title: 'Pass Rate', value: '92.4%', change: 'Optimal standards', icon: CheckCircle2, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 p-6 md:p-8">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Automated Code Review Suite
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mt-3 text-white">
            Welcome back, {user?.name || 'Developer'} 👋
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Run instant two-stage static code analysis and AI reasoning on your scripts, snippets, or files.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/review"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition"
            >
              <Code2 className="w-4 h-4" />
              <span>Start Code Review</span>
            </Link>
            <Link
              to="/history"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <span>Explore History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="glass-panel glass-panel-hover p-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{m.title}</span>
                <div className={`p-2 rounded-xl bg-slate-800/80 ${m.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-2 text-white">{m.value}</div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span>{m.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Paste Source Code</h3>
              <p className="text-xs text-slate-400">Inspect snippets with Monaco editor</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Directly paste JavaScript, TypeScript, Python, Java, or C++ code for syntax validation, cyclomatic complexity calculations, and AI refactoring.
          </p>
          <Link
            to="/review?mode=snippet"
            className="inline-flex items-center gap-2 text-xs font-medium text-cyan-400 hover:text-cyan-300"
          >
            <span>Open Code Editor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Upload Code Files</h3>
              <p className="text-xs text-slate-400">Multer drag-and-drop file review</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Upload `.js`, `.ts`, `.py`, `.java`, `.cpp`, `.jsx`, `.tsx` files directly from your workspace to perform deep static and AI security auditing.
          </p>
          <Link
            to="/review?mode=upload"
            className="inline-flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300"
          >
            <span>Upload Source Files</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
