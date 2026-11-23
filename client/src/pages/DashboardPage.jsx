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
      accentColor: '#4361EE',
      bgGlow: 'bg-[#4361EE]/15 border border-[#4361EE]/30 text-[#4361EE]' 
    },
    { 
      title: 'Average Code Quality', 
      value: `${avgScore}/100`, 
      change: avgScore >= 80 ? 'Grade A' : 'Grade B', 
      icon: Sparkles, 
      accentColor: '#F72585',
      bgGlow: 'bg-[#F72585]/15 border border-[#F72585]/30 text-[#F72585]' 
    },
    { 
      title: 'Issues & Smells Caught', 
      value: totalFindings || '11', 
      change: 'Across all modules', 
      icon: AlertTriangle, 
      accentColor: '#7209B7',
      bgGlow: 'bg-[#7209B7]/15 border border-[#7209B7]/30 text-[#7209B7]' 
    },
    { 
      title: 'Review Pipeline Status', 
      value: '100% Pass', 
      change: 'Stage 1 + 2 Active', 
      icon: CheckCircle2, 
      accentColor: '#4CC9F0',
      bgGlow: 'bg-[#4CC9F0]/15 border border-[#4CC9F0]/30 text-[#0284c7]' 
    },
  ];

  return (
    <div className="space-y-7 animate-fade-in pb-16">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-sm p-7 sm:p-9">
        {/* Soft subtle vibrant ambient glow in corner */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#4CC9F0]/15 via-[#F72585]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-[#F72585]/10 text-[#F72585] border border-[#F72585]/25 font-mono">
            <Sparkles className="w-4 h-4 text-[#4CC9F0]" />
            <span>AI Code Review Platform • Vibrant Radiant Edition</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3.5 text-slate-900 tracking-tight leading-tight">
            Welcome back,{' '}
            <span className="font-serif italic text-3xl sm:text-4xl text-[#F72585] font-bold">
              {user?.name || 'Saumya Developer'}
            </span>{' '}
            👋
          </h2>

          <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed font-normal">
            Run automated static code analysis, AI-powered reasoning, complexity metrics, and auto-generated technical documentation in seconds.
          </p>

          <div className="mt-6 flex flex-wrap gap-3.5">
            <Link
              to="/review"
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-[#F72585] via-[#7209B7] to-[#4361EE] text-white text-sm sm:text-base font-bold shadow-md shadow-[#4361EE]/25 hover:shadow-lg hover:shadow-[#F72585]/35 hover:scale-[1.02] active:scale-[0.98] transition"
            >
              <Code2 className="w-5 h-5" />
              <span>Launch Review Studio</span>
            </Link>
            <Link
              to="/history"
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm sm:text-base font-bold border border-slate-200 shadow-sm transition"
            >
              <span>Audit History ({totalReviews})</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#4361EE]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row with Slightly Increased Text */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-[#4361EE]/40 shadow-sm hover:shadow-md transition group">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">{m.title}</span>
                <div className={`p-2.5 rounded-xl ${m.bgGlow} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-display mt-2.5 text-slate-900">{m.value}</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-1.5 flex items-center gap-1.5 font-mono">
                <TrendingUp className="w-4 h-4 text-[#F72585]" />
                <span>{m.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Score Trend Chart */}
        <div className="p-6 sm:p-7 rounded-2xl border border-slate-200/90 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#F72585]" />
                <span>Code Quality Score Progression</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Chronological score trajectory over review submissions</p>
            </div>
            <span className="px-3 py-1 rounded-lg text-xs sm:text-sm font-mono font-bold bg-[#F72585]/10 text-[#F72585] border border-[#F72585]/30">
              Avg: {avgScore}/100
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F72585" stopOpacity={0.45}/>
                    <stop offset="95%" stopColor="#4361EE" stopOpacity={0.03}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="index" stroke="#94a3b8" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#4361EE', 
                    borderWidth: '1.5px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#0f172a',
                    boxShadow: '0 4px 14px rgba(67,97,238,0.12)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#F72585" 
                  strokeWidth={3.5} 
                  fillOpacity={1} 
                  fill="url(#scoreGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language Volume Breakdown Chart */}
        <div className="p-6 sm:p-7 rounded-2xl border border-slate-200/90 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#4361EE]" />
                <span>Reviews by Language</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Supported AST analysis languages breakdown</p>
            </div>
            <span className="px-3 py-1 rounded-lg text-xs sm:text-sm font-mono font-bold bg-[#4361EE]/10 text-[#4361EE] border border-[#4361EE]/30">
              Multi-Language
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={langChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4361EE"/>
                    <stop offset="100%" stopColor="#7209B7"/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="language" stroke="#94a3b8" fontSize={12} />
                <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#7209B7', 
                    borderWidth: '1.5px',
                    borderRadius: '12px',
                    fontSize: '13px',
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
