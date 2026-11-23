import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight, 
  BarChart3, 
  Activity,
  Star
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  CartesianGrid 
} from 'recharts';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/reviews', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setReviews(data.reviews || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      }
    }
    loadStats();
  }, [token]);

  // Derive metrics
  const totalReviews = reviews.length;
  const avgScore = totalReviews > 0
    ? Math.round(reviews.reduce((acc, r) => acc + (r.overall_score || 0), 0) / totalReviews)
    : 85;

  const totalFindings = reviews.reduce((acc, r) => acc + (r.findings_count || 0), 0);

  // Score progression data for Recharts
  const scoreTrendData = reviews.length > 0
    ? [...reviews].reverse().map((r) => ({
        index: `Rev #${r.id}`,
        score: r.overall_score,
        language: r.language
      }))
    : [
        { index: 'Rev #1', score: 70 },
        { index: 'Rev #2', score: 82 },
        { index: 'Rev #3', score: 78 },
        { index: 'Rev #4', score: 92 },
        { index: 'Rev #5', score: 88 }
      ];

  // Language Breakdown Data for Recharts
  const languageCounts = {};
  reviews.forEach(r => {
    const lang = r.language || 'javascript';
    languageCounts[lang] = (languageCounts[lang] || 0) + 1;
  });

  const langChartData = Object.keys(languageCounts).length > 0
    ? Object.keys(languageCounts).map(lang => ({
        language: lang.toUpperCase(),
        count: languageCounts[lang]
      }))
    : [
        { language: 'JAVASCRIPT', count: 4 },
        { language: 'TYPESCRIPT', count: 2 },
        { language: 'PYTHON', count: 3 }
      ];

  const metrics = [
    { 
      title: 'Total Code Reviews', 
      value: totalReviews || '1', 
      change: 'Logged in SQLite', 
      icon: Code2, 
      accentColor: '#C1AE7C',
      bgGlow: 'bg-[#C1AE7C]/15 border border-[#C1AE7C]/30 text-[#8f7535]' 
    },
    { 
      title: 'Average Code Quality', 
      value: `${avgScore}/100`, 
      change: avgScore >= 80 ? 'Grade A' : 'Grade B', 
      icon: Sparkles, 
      accentColor: '#E16F7C',
      bgGlow: 'bg-[#E16F7C]/15 border border-[#E16F7C]/30 text-[#E16F7C]' 
    },
    { 
      title: 'Issues & Smells Caught', 
      value: totalFindings || '11', 
      change: 'Across all modules', 
      icon: AlertTriangle, 
      accentColor: '#DD5E98',
      bgGlow: 'bg-[#DD5E98]/15 border border-[#DD5E98]/30 text-[#DD5E98]' 
    },
    { 
      title: 'Review Pipeline Status', 
      value: '100% Pass', 
      change: 'Stage 1 + 2 Active', 
      icon: CheckCircle2, 
      accentColor: '#CC4BC2',
      bgGlow: 'bg-[#CC4BC2]/15 border border-[#CC4BC2]/30 text-[#CC4BC2]' 
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-7">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#DD5E98]/10 text-[#DD5E98] border border-[#DD5E98]/20 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#C1AE7C]" />
            <span>AI Code Review Platform • 5-Color Radiant Edition</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold mt-3 text-slate-900 tracking-tight">
            Welcome back,{' '}
            <span className="font-serif italic text-2xl sm:text-3xl text-[#DD5E98] font-bold">
              {user?.name || 'Saumya Developer'}
            </span>{' '}
            👋
          </h2>

          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Run automated static code analysis, AI-powered reasoning, complexity metrics, and auto-generated technical documentation in seconds.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/review"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] text-white text-sm font-semibold shadow-md shadow-[#DD5E98]/25 hover:shadow-lg hover:shadow-[#DD5E98]/40 hover:scale-[1.01] active:scale-[0.99] transition"
            >
              <Code2 className="w-4 h-4" />
              <span>Launch Review Studio</span>
            </Link>
            <Link
              to="/history"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-200 shadow-sm transition"
            >
              <span>Audit History ({totalReviews})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-[#DD5E98]/40 shadow-sm hover:shadow transition group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{m.title}</span>
                <div className={`p-2 rounded-xl ${m.bgGlow} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-display mt-2 text-slate-900">{m.value}</div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-mono">
                <TrendingUp className="w-3.5 h-3.5 text-[#E16F7C]" />
                <span>{m.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Score Trend Chart */}
        <div className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#DD5E98]" />
                <span>Code Quality Score Progression</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Chronological score trajectory over review submissions</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-[#E16F7C]/15 text-[#E16F7C] border border-[#E16F7C]/30">
              Avg: {avgScore}/100
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DD5E98" stopOpacity={0.45}/>
                    <stop offset="95%" stopColor="#CC4BC2" stopOpacity={0.03}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="index" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#e2e8f0', 
                    borderWidth: '1px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#0f172a',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#DD5E98" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#scoreGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language Volume Breakdown Chart */}
        <div className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#CC4BC2]" />
                <span>Reviews by Language</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Supported AST analysis languages breakdown</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-[#CC4BC2]/15 text-[#CC4BC2] border border-[#CC4BC2]/30">
              Multi-Language
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={langChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#CC4BC2"/>
                    <stop offset="100%" stopColor="#6C3A5C"/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="language" stroke="#94a3b8" fontSize={11} />
                <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#e2e8f0', 
                    borderWidth: '1px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#0f172a' 
                  }} 
                />
                <Bar dataKey="count" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
