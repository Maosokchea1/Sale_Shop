// src/components/Common/ErrorBoundary.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CartPage Error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-slate-50 to-white font-sans">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-50 rounded-2xl mb-6">
              <ExclamationTriangleIcon className="w-10 h-10 text-rose-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">
              Something went wrong
            </h1>
            <p className="text-slate-600 mb-8 leading-relaxed">
              We encountered an error while loading your cart. Please try again.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all duration-200 shadow-lg shadow-slate-900/10"
              >
                <ArrowPathIcon className="w-5 h-5" />
                Try Again
              </button>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-xl font-semibold border border-slate-200 hover:bg-slate-50 transition-all duration-200"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;