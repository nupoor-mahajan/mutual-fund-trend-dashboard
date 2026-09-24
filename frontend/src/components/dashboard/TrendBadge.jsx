import React from 'react';

export function TrendBadge({ trend }) {
  const isUpward = trend === 'Upward';
  const isDownward = trend === 'Downward';

  if (!isUpward && !isDownward) {
    return (
      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded border border-slate-200">
        N/A
      </span>
    );
  }

  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium rounded border ${
        isUpward
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-rose-50 text-rose-700 border-rose-200'
      }`}
    >
      {trend}
    </span>
  );
}
