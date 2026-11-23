import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Eye, 
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
    if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (score >= 75) return 'text-[#DD5E98] bg-[#DD5E98]/10 border-[#DD5E98]/30';
    if (score >= 60) return 'text-[#8f7535] bg-[#C1AE7C]/15 border-[#C1AE7C]/30';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  const getScoreGrade = (score) => {
    if (score >= 95) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 75) return 'B';
    if (score >= 60) return 'C';
    return 'F';
  };

  const avgScore = reviews.length > 0 
    ? Math.round(reviews.reduce((acc, r) => acc + (r.overall_score || 0), 0) / reviews.length) 
    : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-[#DD5E98]" />
            <span>Review History & Audit Logs</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse, search, filter, and inspect previous automated code review reports.
          </p>
        </div>

        {reviews.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold transition shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3 rounded-lg border text-xs font-semibold flex items-center gap-2 shadow-sm ${
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
        <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Logged Reviews</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{reviews.length}</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Historical Score</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {avgScore}/100 {avgScore > 0 && <span className="text-xs font-semibold text-[#DD5E98] font-mono">(Grade {getScoreGrade(avgScore)})</span>}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Database Engine</span>
          <div className="text-2xl font-extrabold text-[#DD5E98] mt-1">SQLite Native</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-xl border border-slate-200/90 bg-white flex flex-wrap items-center justify-between gap-3 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search reviews by keyword, summary, or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-[#DD5E98] rounded-lg pl-9 pr-7 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
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
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 outline-none"
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
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 outline-none"
          >
            <option value="all">All Review Types</option>
            <option value="static">Static Analysis</option>
            <option value="ai">AI Deep Review</option>
            <option value="full">Combined Full Review</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-xs text-slate-500">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">
            No reviews match your query or filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">File / Snippet</th>
                  <th className="py-2.5 px-3">Language</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Findings</th>
                  <th className="py-2.5 px-3">Created</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 px-3 font-mono text-slate-500">#{r.id}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{r.file_name || 'Code Snippet'}</td>
                    <td className="py-2.5 px-3 uppercase font-mono text-[#CC4BC2] font-semibold">{r.language}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getScoreColor(r.overall_score || 0)}`}>
                        {r.overall_score || 0}/100
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{r.findings_count || 0}</td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-400 font-mono">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleViewDetail(r.id)}
                          className="p-1.5 rounded-md bg-white border border-slate-200 hover:border-[#DD5E98] text-slate-600 hover:text-slate-900 transition shadow-sm"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#DD5E98]" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(r.id)}
                          className="p-1.5 rounded-md bg-white border border-rose-200 hover:border-rose-400 text-rose-600 transition shadow-sm"
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
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-5 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                Review #{selectedReview.review.id}: {selectedReview.review.file_name}
              </h3>
              <button
                onClick={() => setSelectedReview(null)}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getScoreColor(selectedReview.review.overall_score)}`}>
                  Score: {selectedReview.review.overall_score}/100
                </span>
                <span className="text-xs font-mono text-slate-600">
                  Language: {selectedReview.review.language}
                </span>
              </div>

              {selectedReview.review.summary && (
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {selectedReview.review.summary}
                </p>
              )}

              {selectedReview.findings && selectedReview.findings.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900">Identified Issues ({selectedReview.findings.length})</h4>
                  {selectedReview.findings.map((f, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                      <div className="font-semibold text-slate-900">[{f.severity?.toUpperCase()}] Line {f.line_number}: {f.issue}</div>
                      <div className="text-[11px] text-slate-500">{f.explanation}</div>
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
