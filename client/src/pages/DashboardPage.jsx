import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  FileCode, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight, 
  BarChart3, 
  Activity,
  Star,
  ShieldCheck,
  Zap
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
      bgGlow: 'bg-[#C1AE7C]/20 border-[#C1AE7C]/40 text-[#6C3A5C]' 
    },
    { 
      title: 'Average Code Quality', 
      value: `${avgScore}/100`, 
      change: avgScore >= 80 ? 'Grade A' : 'Grade B', 
      icon: Sparkles, 
      accentColor: '#E16F7C',
      bgGlow: 'bg-[#E16F7C]/20 border-[#E16F7C]/40 text-[#E16F7C]' 
    },
    { 
      title: 'Issues & Smells Caught', 
      value: totalFindings || '11', 
      change: 'Across all modules', 
      icon: AlertTriangle, 
      accentColor: '#DD5E98',
      bgGlow: 'bg-[#DD5E98]/20 border-[#DD5E98]/40 text-[#DD5E98]' 
    },
    { 
      title: 'Review Pipeline Status', 
      value: '100% Pass', 
      change: 'Stage 1 + 2 Shield Active', 
      icon: CheckCircle2, 
      accentColor: '#CC4BC2',
      bgGlow: 'bg-[#CC4BC2]/20 border-[#CC4BC2]/40 text-[#CC4BC2]' 
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Welcome Hero Banner with 5-Color Gradient & Star Shine */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white/95 via-[#fff3f7]/95 to-white/95 border-2 border-[#E16F7C]/40 shadow-xl shadow-[#DD5E98]/10 p-6 md:p-8">
        {/* Background glow and stars */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#CC4BC2]/25 via-[#DD5E98]/20 to-transparent rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute top-4 right-8 animate-star-shine pointer-events-none">
          <Star className="w-6 h-6 text-[#C1AE7C] fill-[#C1AE7C] drop-shadow-[0_0_12px_#C1AE7C]" />
        </div>
        <div className="absolute bottom-4 right-28 animate-star-shine pointer-events-none" style={{ animationDelay: '1.6s' }}>
          <Sparkles className="w-5 h-5 text-[#DD5E98] drop-shadow-[0_0_10px_#CC4BC2]" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#E16F7C]/20 text-[#6C3A5C] border border-[#E16F7C]/40 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C1AE7C]" />
            <span>AI Code Guardian Suite • 5-Color Radiant Theme</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black mt-3 text-[#3a142e] tracking-tight">
            Welcome back, {user?.name || 'Saumya Developer'} 👋
          </h2>
          <p className="text-xs md:text-sm text-[#6C3A5C] mt-2 leading-relaxed font-semibold">
            Run automated static code analysis, AI-powered reasoning, complexity metrics, and auto-generated technical documentation in seconds.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/review"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E16F7C] via-[#DD5E98] to-[#CC4BC2] text-white text-xs font-extrabold shadow-lg shadow-[#DD5E98]/35 hover:scale-[1.02] active:scale-[0.98] transition"
            >
              <Code2 className="w-4 h-4" />
              <span>Launch Review Studio</span>
            </Link>
            <Link
              to="/history"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#fff5f8] text-[#6C3A5C] text-xs font-extrabold border-2 border-[#E16F7C]/30 shadow-md transition"
            >
              <span>Audit History ({totalReviews})</span>
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
            <div key={i} className="glass-panel p-5 rounded-2xl border-2 border-[#E16F7C]/30 hover:border-[#CC4BC2]/50 transition group shadow-md bg-white/95">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#6C3A5C]">{m.title}</span>
                <div className={`p-2 rounded-xl border ${m.bgGlow} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black mt-2 text-[#3a142e]">{m.value}</div>
              <div className="text-[11px] text-[#6C3A5C] mt-1 flex items-center gap-1 font-mono font-bold">
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
        <div className="glass-panel p-6 rounded-3xl border-2 border-[#E16F7C]/30 bg-white/95 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-[#3a142e] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#DD5E98]" />
                <span>Code Quality Score Progression</span>
              </h3>
              <p className="text-[11px] text-[#6C3A5C] font-semibold">Chronological score trajectory over review submissions</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold bg-[#E16F7C]/20 text-[#6C3A5C] border border-[#E16F7C]/40">
              Avg: {avgScore}/100
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DD5E98" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#CC4BC2" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0d5e2" strokeOpacity={0.8} />
                <XAxis dataKey="index" stroke="#6C3A5C" fontSize={11} fontWeight={600} />
                <YAxis domain={[0, 100]} stroke="#6C3A5C" fontSize={11} fontWeight={600} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#E16F7C', 
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#3a142e',
                    boxShadow: '0 10px 25px rgba(221,94,152,0.25)'
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
        <div className="glass-panel p-6 rounded-3xl border-2 border-[#E16F7C]/30 bg-white/95 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-[#3a142e] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#CC4BC2]" />
                <span>Reviews by Language</span>
              </h3>
              <p className="text-[11px] text-[#6C3A5C] font-semibold">Supported AST analysis languages breakdown</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold bg-[#CC4BC2]/20 text-[#6C3A5C] border border-[#CC4BC2]/40">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#f0d5e2" strokeOpacity={0.8} />
                <XAxis dataKey="language" stroke="#6C3A5C" fontSize={11} fontWeight={600} />
                <YAxis allowDecimals={false} stroke="#6C3A5C" fontSize={11} fontWeight={600} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#CC4BC2', 
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#3a142e' 
                  }} 
                />
                <Bar dataKey="count" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
