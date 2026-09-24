import React from 'react';
import { Link } from 'react-router-dom';
import fundsData from '../data/funds.json';
import { ComparisonTable } from '../components/compare/ComparisonTable';
import { NormalizedComparisonChart } from '../components/compare/NormalizedComparisonChart';

export function ComparePage({ selectedCodes, onToggleSelection, onClearSelection }) {
  const selectedFunds = fundsData.filter((f) =>
    selectedCodes.includes(Number(f.schemeCode))
  );

  if (selectedFunds.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded p-8 text-center max-w-md mx-auto my-12 space-y-3">
        <h2 className="text-sm font-bold text-slate-900">No funds selected</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Select at least two funds from the dashboard to compare.
        </p>
        <Link
          to="/"
          className="inline-block px-3.5 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
        >
          Select funds from dashboard
        </Link>
      </div>
    );
  }

  if (selectedFunds.length === 1) {
    return (
      <div className="space-y-4 pb-16">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <Link
            to="/"
            className="text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors"
          >
            ← Back to dashboard
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded p-6 text-center max-w-md mx-auto my-6 space-y-3">
          <h2 className="text-sm font-bold text-slate-900">1 fund selected</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Select at least two funds from the dashboard to compare.
          </p>
          <div className="flex items-center justify-center space-x-2 pt-1">
            <button
              onClick={onClearSelection}
              className="px-2.5 py-1 border border-slate-200 rounded text-xs text-slate-700 hover:bg-slate-50"
            >
              Clear
            </button>
            <Link
              to="/"
              className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
            >
              + Select more funds
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Fund Comparison
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Side-by-side metric comparison and normalized performance chart for {selectedFunds.length} schemes.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onClearSelection}
            className="px-2.5 py-1 border border-slate-200 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Clear all
          </button>
          <Link
            to="/"
            className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
          >
            + Add fund
          </Link>
        </div>
      </div>

      {/* Section 1: Comparison Table */}
      <ComparisonTable
        selectedFunds={selectedFunds}
        onRemoveFund={onToggleSelection}
      />

      {/* Section 2: Normalized NAV Performance */}
      <NormalizedComparisonChart selectedFunds={selectedFunds} />
    </div>
  );
}
