import React from 'react';

export function SummaryStats({ stats }) {
  return (
    <div className="bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1 shadow-none">
      <div className="flex items-center space-x-1.5">
        <span className="font-semibold text-slate-900">{stats.total}</span>
        <span className="text-slate-500">Total Funds</span>
      </div>
      <span className="text-slate-300 hidden sm:inline">•</span>
      <div className="flex items-center space-x-1.5">
        <span className="font-semibold text-slate-900">{stats.equity}</span>
        <span className="text-slate-500">Equity</span>
      </div>
      <span className="text-slate-300 hidden sm:inline">•</span>
      <div className="flex items-center space-x-1.5">
        <span className="font-semibold text-slate-900">{stats.debt}</span>
        <span className="text-slate-500">Debt</span>
      </div>
      <span className="text-slate-300 hidden sm:inline">•</span>
      <div className="flex items-center space-x-1.5">
        <span className="font-semibold text-slate-900">{stats.hybrid}</span>
        <span className="text-slate-500">Hybrid</span>
      </div>
    </div>
  );
}
