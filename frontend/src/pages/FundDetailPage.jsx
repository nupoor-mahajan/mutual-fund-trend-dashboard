import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import fundsData from '../data/funds.json';
import { FundMetrics } from '../components/fund/FundMetrics';
import { NavHistoryChart } from '../components/fund/NavHistoryChart';

export function FundDetailPage({
  isSelected,
  onToggleSelection,
  isMaxReached,
}) {
  const { schemeCode } = useParams();
  const navigate = useNavigate();

  const fund = fundsData.find(
    (f) => String(f.schemeCode) === String(schemeCode)
  );

  if (!fund) {
    return (
      <div className="bg-white border border-slate-200 rounded p-8 text-center max-w-md mx-auto my-12 space-y-3">
        <h2 className="text-sm font-bold text-slate-900">Fund not found</h2>
        <p className="text-xs text-slate-500">
          The requested scheme code ({schemeCode}) is not available in the dataset.
        </p>
        <Link
          to="/"
          className="inline-block px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
        >
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  const selected = isSelected(fund.schemeCode);
  const disabled = !selected && isMaxReached;

  return (
    <div className="space-y-4 pb-16">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2.5">
        <button
          onClick={() => navigate('/')}
          className="text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors"
        >
          ← Back to dashboard
        </button>

        {/* Compare Toggle Button */}
        <button
          onClick={() => onToggleSelection(fund.schemeCode)}
          disabled={disabled}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors border ${
            selected
              ? 'bg-slate-900 text-white border-slate-900'
              : disabled
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {selected ? '✓ In comparison' : '+ Add to compare'}
        </button>
      </div>

      {/* Fund Metrics Summary */}
      <FundMetrics fund={fund} />

      {/* History Line Chart & Methodology */}
      <NavHistoryChart history={fund.history} schemeName={fund.schemeName} />
    </div>
  );
}
