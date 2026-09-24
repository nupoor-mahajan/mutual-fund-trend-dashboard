import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function AppHeader({ selectedCount = 0 }) {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-12">
          {/* Logo / Title */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-slate-900 font-semibold text-sm hover:text-slate-700 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-slate-900" />
            <span className="font-semibold text-sm tracking-tight text-slate-900">
              Mutual Fund Trends
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/compare"
              className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                location.pathname === '/compare'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Compare</span>
              {selectedCount > 0 && (
                <span className="bg-slate-900 text-white text-[10px] font-semibold px-1.5 py-0.2 rounded-full">
                  {selectedCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
