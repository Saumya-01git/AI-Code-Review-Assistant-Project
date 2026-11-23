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
  Check,
  Star,
  Sparkles
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
    if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (score >= 75) return 'text-[#DD5E98] bg-[#DD5E98]/10 border-[#DD5E98]/40';
    if (score >= 60) return 'text-[#C1AE7C] bg-[#C1AE7C]/15 border-[#C1AE7C]/40';
    return 'text-rose-700 bg-rose-50 border-rose-300';
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
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#3a142e] flex items-center gap-2">
            <History className="w-5 h-5 text-[#DD5E98]" />
            <span>Review History & Audit Logs</span>
          </h2>
          <p className="text-xs text-[#6C3A5C] font-semibold mt-1">
            Browse, search, filter, and inspect previous automated code review reports.
          </p>
        </div>

        {reviews.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border-2 border-rose-200 text-xs font-bold transition shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3.5 rounded-2xl border-2 text-xs font-bold flex items-center gap-2 shadow-sm ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-2 border-[#E16F7C]/30 bg-white/95 shadow-sm">
          <span className="text-xs font-bold text-[#6C3A5C]">Total Logged Reviews</span>
          <div className="text-3xl font-black text-[#3a142e] mt-1">{reviews.length}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-2 border-[#E16F7C]/30 bg-white/95 shadow-sm">
          <span className="text-xs font-bold text-[#6C3A5C]">Average Historical Score</span>
          <div className="text-3xl font-black text-[#3a142e] mt-1">
            {avgScore}/100 {avgScore > 0 && <span className="text-xs font-bold text-[#DD5E98] font-mono">(Grade {getScoreGrade(avgScore)})</span>}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-2 border-[#E16F7C]/30 bg-white/95 shadow-sm">
          <span className="text-xs font-bold text-[#6C3A5C]">Database Engine</span>
          <div className="text-3xl font-black text-[#DD5E98] mt-1">SQLite Native</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border-2 border-[#E16F7C]/30 bg-white/95 flex flex-wrap items-center justify-between gap-3 shadow-md">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#DD5E98] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search reviews by keyword, summary, or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#faf5f8] border-2 border-[#E16F7C]/30 focus:border-[#CC4BC2] rounded-xl pl-10 pr-8 py-2 text-xs font-bold text-[#3a142e] placeholder-[#6C3A5C]/50 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-[#6C3A5C] hover:text-[#3a142e]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Language filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-[#faf5f8] border-2 border-[#E16F7C]/30 rounded-xl px-3 py-2 text-xs font-bold text-[#3a142e] outline-none"
          >
            <option value="all">All Languages</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
          </select>

          {/* Type filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-[#faf5f8] border-2 border-[#E16F7C]/30 rounded-xl px-3 py-2 text-xs font-bold text-[#3a142e] outline-none"
          >
            <option value="all">All Review Types</option>
            <option value="static">Static Analysis</option>
            <option value="ai">AI Deep Review</option>
            <option value="full">Combined Full Review</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="glass-panel rounded-3xl border-2 border-[#E16F7C]/30 overflow-hidden bg-white/95 shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-[#6C3A5C]">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-xs font-bold text-[#6C3A5C]">
            No reviews match your query or filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-[#E16F7C]/25 bg-[#fff5f8] text-[#6C3A5C] font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">File / Snippet</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Findings</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E16F7C]/15">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-[#fff9fc] transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#6C3A5C]">#{r.id}</td>
                    <td className="py-3 px-4 font-extrabold text-[#3a142e]">{r.file_name || 'Code Snippet'}</td>
                    <td className="py-3 px-4 uppercase font-mono font-bold text-[#CC4BC2]">{r.language}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${getScoreColor(r.overall_score || 0)}`}>
                        {r.overall_score || 0}/100
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#6C3A5C]">{r.findings_count || 0}</td>
                    <td className="py-3 px-4 text-[11px] text-[#6C3A5C] font-mono">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleViewDetail(r.id)}
                          className="p-1.5 rounded-lg bg-white border border-[#E16F7C]/30 hover:border-[#CC4BC2] text-[#6C3A5C] hover:text-[#3a142e] transition shadow-sm"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#DD5E98]" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(r.id)}
                          className="p-1.5 rounded-lg bg-white border border-rose-200 hover:border-rose-400 text-rose-600 transition shadow-sm"
                          title="Delete Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 border-2 border-[#E16F7C]/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-[#E16F7C]/25">
              <h3 className="text-base font-black text-[#3a142e]">
                Review #{selectedReview.review.id}: {selectedReview.review.file_name}
              </h3>
              <button
                onClick={() => setSelectedReview(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-[#6C3A5C]"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getScoreColor(selectedReview.review.overall_score)}`}>
                  Score: {selectedReview.review.overall_score}/100
                </span>
                <span className="text-xs font-mono font-bold text-[#6C3A5C]">
                  Language: {selectedReview.review.language}
                </span>
              </div>

              {selectedReview.review.summary && (
                <p className="text-xs text-[#6C3A5C] bg-[#faf5f8] p-3 rounded-xl border border-[#E16F7C]/30 font-medium">
                  {selectedReview.review.summary}
                </p>
              )}

              {selectedReview.findings && selectedReview.findings.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#3a142e]">Identified Issues ({selectedReview.findings.length})</h4>
                  {selectedReview.findings.map((f, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#fff7fa] border border-[#E16F7C]/30 text-xs text-[#6C3A5C] space-y-1">
                      <div className="font-bold text-[#3a142e]">[{f.severity?.toUpperCase()}] Line {f.line_number}: {f.issue}</div>
                      <div className="text-[11px]">{f.explanation}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
