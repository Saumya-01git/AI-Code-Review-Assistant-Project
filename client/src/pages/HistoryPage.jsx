import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Eye, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Copy, 
  Check 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HistoryPage() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [minScore, setMinScore] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [notification, setNotification] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('q', searchQuery.trim());
      if (selectedLanguage !== 'all') params.append('language', selectedLanguage);
      if (selectedType !== 'all') params.append('reviewType', selectedType);
      if (minScore) params.append('minScore', minScore);

      const res = await fetch(`/api/reviews?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [searchQuery, selectedLanguage, selectedType, minScore]);

  const handleDeleteReview = async (id) => {
    if (!window.confirm(`Are you sure you want to delete review #${id}?`)) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.filter(r => r.id !== id));
        if (selectedReview?.review?.id === id) {
          setSelectedReview(null);
        }
        showNotification('success', 'Review deleted successfully.');
      }
    } catch (err) {
      showNotification('error', 'Failed to delete review.');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to permanently clear all review history?')) return;
    try {
      const res = await fetch('/api/reviews', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setReviews([]);
        setSelectedReview(null);
        showNotification('success', 'Cleared all review logs.');
      }
    } catch (err) {
      showNotification('error', 'Failed to clear reviews.');
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSelectedReview(data);
      }
    } catch (err) {
      showNotification('error', 'Failed to load review details.');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 75) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    if (score >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  const getScoreGrade = (score) => {
    if (score >= 95) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 75) return 'B';
    if (score >= 60) return 'C';
    return 'F';
  };

  const copyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const avgScore = reviews.length > 0 
    ? Math.round(reviews.reduce((acc, r) => acc + (r.overall_score || 0), 0) / reviews.length) 
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <span>Review History & Audit Logs</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse, search, filter, and inspect previous automated code review reports.
          </p>
        </div>

        {reviews.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/10 hover:text-rose-300 text-slate-400 border border-slate-700 hover:border-rose-500/30 text-xs font-medium transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
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

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400">Total Logged Reviews</span>
          <div className="text-2xl font-bold text-white mt-1">{reviews.length}</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400">Average Historical Score</span>
          <div className="text-2xl font-bold text-white mt-1">
            {avgScore}/100 {avgScore > 0 && <span className="text-xs font-normal text-slate-400 font-mono">(Grade {getScoreGrade(avgScore)})</span>}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400">Database Engine</span>
          <div className="text-2xl font-bold text-cyan-400 mt-1">SQLite Native</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search reviews by keyword, summary, or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
          >
            <option value="all">All Languages</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          {/* Type filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
          >
            <option value="all">All Review Types</option>
            <option value="full_suite">Full Suite</option>
            <option value="static_analysis">Static Only</option>
            <option value="ai_review">AI Review</option>
          </select>

          {/* Min score filter */}
          <select
            value={minScore}
            onChange={(e) => setMinScore(e.target.value)}
            className="bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
          >
            <option value="">Any Score</option>
            <option value="90">90+ (Grade A)</option>
            <option value="75">75+ (Grade B+)</option>
            <option value="60">60+ (Grade C)</option>
          </select>
        </div>
      </div>

      {/* Reviews Table / List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-xs text-slate-400">Loading review history...</div>
        ) : reviews.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center">
            <History className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-white">No Reviews Found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No matching code reviews recorded yet. Run a static or AI review in the Studio to generate your first audit record!
            </p>
          </div>
        ) : (
          reviews.map((r) => {
            const dateStr = new Date(r.created_at).toLocaleString();
            return (
              <div
                key={r.id}
                className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  {/* Score circle */}
                  <div className={`w-12 h-12 rounded-2xl border flex flex-col items-center justify-center shrink-0 ${getScoreColor(r.overall_score)}`}>
                    <span className="text-base font-extrabold">{r.overall_score}</span>
                    <span className="text-[9px] font-bold">{getScoreGrade(r.overall_score)}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white">Review #{r.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-cyan-300">
                        {r.language || 'code'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {r.review_type ? r.review_type.replace('_', ' ') : 'review'}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{dateStr}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 max-w-2xl line-clamp-2">
                      {r.summary || 'Automated code review assessment.'}
                    </p>

                    <div className="text-[11px] text-slate-400">
                      Findings Logged: <strong className="text-white">{r.findings_count || 0}</strong>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleViewDetail(r.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View Report</span>
                  </button>

                  <button
                    onClick={() => handleDeleteReview(r.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detailed Report Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-3xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden animate-fade-in my-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold ${getScoreColor(selectedReview.review.overall_score)}`}>
                  {selectedReview.review.overall_score}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Detailed Audit Report: Review #{selectedReview.review.id}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Language: {selectedReview.review.language} • {new Date(selectedReview.review.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedReview(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Executive Summary */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">Executive Summary</h4>
                <p className="text-xs text-slate-200 leading-relaxed">{selectedReview.review.summary}</p>
              </div>

              {/* Findings List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recorded Findings ({selectedReview.findings.length})
                </h4>
                {selectedReview.findings.length === 0 ? (
                  <p className="text-xs text-slate-500">No findings or issues recorded for this submission.</p>
                ) : (
                  selectedReview.findings.map((f, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            f.severity === 'error' || f.severity === 'high'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              : f.severity === 'warning' || f.severity === 'medium'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                          }`}>
                            {f.severity}
                          </span>
                          {f.line_number && (
                            <span className="font-mono text-slate-400">Line {f.line_number}</span>
                          )}
                        </div>
                      </div>
                      <h5 className="font-semibold text-white">{f.issue}</h5>
                      <p className="text-slate-300">{f.explanation}</p>
                      {f.suggested_fix && (
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-emerald-300 text-[11px]">
                          <span className="text-slate-500 block text-[9px] uppercase">Recommended Fix:</span>
                          {f.suggested_fix}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Raw Submitted Code */}
              {selectedReview.review.raw_code && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Submitted Code</h4>
                    <button
                      onClick={() => copyCode(selectedReview.review.raw_code)}
                      className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 max-h-64 overflow-y-auto leading-relaxed">
                    {selectedReview.review.raw_code}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex justify-end">
              <button
                onClick={() => setSelectedReview(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
