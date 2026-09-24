import React from 'react';
import { Link } from 'react-router-dom';
import { TrendBadge } from '../dashboard/TrendBadge';
import { formatNav, formatReturn, getReturnColorClass } from '../../utils/formatters';

export function ComparisonTable({ selectedFunds = [], onRemoveFund }) {
  if (!selectedFunds || selectedFunds.length === 0) {
    return null;
  }

  const rows = [
    { key: 'category', label: 'Category', format: (f) => f.category || 'N/A' },
    { key: 'fundHouse', label: 'Fund House', format: (f) => f.fundHouse || 'N/A' },
    { key: 'currentNav', label: 'Current NAV', format: (f) => <span className="font-mono font-medium tabular-nums">{formatNav(f.currentNav)}</span> },
    { key: 'trend', label: 'Trend', format: (f) => <TrendBadge trend={f.trend} /> },
    {
      key: '1m',
      label: '1M Return',
      format: (f) => (
        <span className={`font-mono font-medium tabular-nums ${getReturnColorClass(f.returns?.['1m'])}`}>
          {formatReturn(f.returns?.['1m'])}
        </span>
      ),
    },
    {
      key: '3m',
      label: '3M Return',
      format: (f) => (
        <span className={`font-mono font-medium tabular-nums ${getReturnColorClass(f.returns?.['3m'])}`}>
          {formatReturn(f.returns?.['3m'])}
        </span>
      ),
    },
    {
      key: '6m',
      label: '6M Return',
      format: (f) => (
        <span className={`font-mono font-medium tabular-nums ${getReturnColorClass(f.returns?.['6m'])}`}>
          {formatReturn(f.returns?.['6m'])}
        </span>
      ),
    },
    {
      key: '1y',
      label: '1Y Return',
      format: (f) => (
        <span className={`font-mono font-medium tabular-nums ${getReturnColorClass(f.returns?.['1y'])}`}>
          {formatReturn(f.returns?.['1y'])}
        </span>
      ),
    },
    {
      key: 'ma30',
      label: '30-Day Average NAV',
      format: (f) => <span className="font-mono font-medium tabular-nums">{formatNav(f.movingAverage30d)}</span>,
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded overflow-hidden shadow-none">
      <div className="p-3 bg-slate-50 border-b border-slate-200">
        <h2 className="text-sm font-semibold text-slate-900">Comparison Table</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50 text-xs">
              <th scope="col" className="py-2.5 px-3.5 w-44 font-semibold text-slate-500 bg-slate-50">
                Metric
              </th>
              {selectedFunds.map((fund) => (
                <th key={fund.schemeCode} scope="col" className="py-2.5 px-3.5 min-w-[180px] align-top border-l border-slate-200">
                  <div className="flex items-start justify-between gap-1.5">
                    <Link
                      to={`/fund/${fund.schemeCode}`}
                      className="font-semibold text-slate-900 hover:underline leading-snug"
                    >
                      {fund.schemeName}
                    </Link>
                    <button
                      onClick={() => onRemoveFund(fund.schemeCode)}
                      className="text-slate-400 hover:text-rose-600 text-xs transition-colors px-1"
                      title="Remove fund from comparison"
                    >
                      ✕
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {rows.map((row) => (
              <tr key={row.key} className="hover:bg-slate-50 transition-colors">
                <td className="py-2 px-3.5 font-medium text-slate-600 bg-slate-50/50 whitespace-nowrap">
                  {row.label}
                </td>
                {selectedFunds.map((fund) => (
                  <td key={fund.schemeCode} className="py-2 px-3.5 text-slate-800 border-l border-slate-200">
                    {row.format(fund)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
