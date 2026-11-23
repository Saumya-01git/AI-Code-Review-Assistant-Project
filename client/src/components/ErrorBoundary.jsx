import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React ErrorBoundary caught error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            The application encountered an unexpected runtime error. Your code and workspace state remain intact.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReload}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold shadow hover:scale-105 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Application</span>
            </button>
            <a
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Dashboard Home</span>
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
