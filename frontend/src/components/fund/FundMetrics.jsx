import React from 'react';
import { TrendBadge } from '../dashboard/TrendBadge';
import { formatNav, formatReturn, getReturnColorClass, formatDate } from '../../utils/formatters';

export function FundMetrics({ fund }) {
  if (!fund) return null;

  return (
    <div className="space-y-3">
      {/* Top Scheme Title & Header */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {fund.schemeName}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">{fund.fundHouse}</span>
              <span>•</span>
              <span className="px-1.5 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-700 rounded">
                {fund.category}
              </span>
              {fund.subCategory && (
                <>
                  <span>•</span>
                  <span>{fund.subCategory}</span>
                </>
              )}
            </div>
          </div>

          <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
            <div className="text-xs text-slate-500 font-medium">Current NAV</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {formatNav(fund.currentNav)}
            </div>
            <div className="text-[11px] text-slate-400">
              As of {formatDate(fund.latestNavDate)}
            </div>
          </div>
        </div>
      </div>

      {/* Compact Metrics Grid Strip */}
      <div className="bg-white border border-slate-200 rounded p-3 grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs shadow-none">
        <div>
          <div className="text-slate-500 text-[11px] font-medium">Trend</div>
          <div className="mt-1">
            <TrendBadge trend={fund.trend} />
          </div>
        </div>
        <div>
          <div className="text-slate-500 text-[11px] font-medium">30d Avg NAV</div>
          <div className="mt-1 font-mono font-medium text-slate-900 tabular-nums">
            {formatNav(fund.movingAverage30d)}
          </div>
        </div>
        <div>
          <div className="text-slate-500 text-[11px] font-medium">1M Return</div>
          <div className={`mt-1 font-mono font-medium tabular-nums ${getReturnColorClass(fund.returns?.['1m'])}`}>
            {formatReturn(fund.returns?.['1m'])}
          </div>
        </div>
        <div>
          <div className="text-slate-500 text-[11px] font-medium">3M Return</div>
          <div className={`mt-1 font-mono font-medium tabular-nums ${getReturnColorClass(fund.returns?.['3m'])}`}>
            {formatReturn(fund.returns?.['3m'])}
          </div>
        </div>
        <div>
          <div className="text-slate-500 text-[11px] font-medium">6M Return</div>
          <div className={`mt-1 font-mono font-medium tabular-nums ${getReturnColorClass(fund.returns?.['6m'])}`}>
            {formatReturn(fund.returns?.['6m'])}
          </div>
        </div>
        <div>
          <div className="text-slate-500 text-[11px] font-medium">1Y Return</div>
          <div className={`mt-1 font-mono font-medium tabular-nums ${getReturnColorClass(fund.returns?.['1y'])}`}>
            {formatReturn(fund.returns?.['1y'])}
          </div>
        </div>
      </div>
    </div>
  );
}
