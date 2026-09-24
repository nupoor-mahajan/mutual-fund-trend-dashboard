import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendBadge } from './TrendBadge';
import { formatNav, formatReturn, getReturnColorClass } from '../../utils/formatters';

export function FundTable({
  funds,
  isSelected,
  onToggleSelection,
  isMaxReached,
}) {
  const navigate = useNavigate();

  if (!funds || funds.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded p-8 text-center text-slate-500 text-xs">
        No funds match the current filters.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded overflow-hidden shadow-none">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 select-none">
              <th scope="col" className="py-2.5 px-3 w-8 text-center">
                <span className="sr-only">Select</span>
              </th>
              <th scope="col" className="py-2.5 px-3 min-w-[240px]">
                Fund
              </th>
              <th scope="col" className="py-2.5 px-3 min-w-[90px]">
                Category
              </th>
              <th scope="col" className="py-2.5 px-3 text-right min-w-[90px]">
                NAV
              </th>
              <th scope="col" className="py-2.5 px-3 text-center min-w-[90px]">
                Trend
              </th>
              <th scope="col" className="py-2.5 px-3 text-right min-w-[70px]">
                1M
              </th>
              <th scope="col" className="py-2.5 px-3 text-right min-w-[70px]">
                3M
              </th>
              <th scope="col" className="py-2.5 px-3 text-right min-w-[70px]">
                6M
              </th>
              <th scope="col" className="py-2.5 px-3 text-right min-w-[70px]">
                1Y
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
            {funds.map((fund) => {
              const selected = isSelected(fund.schemeCode);
              const disabled = !selected && isMaxReached;

              return (
                <tr
                  key={fund.schemeCode}
                  onClick={() => navigate(`/fund/${fund.schemeCode}`)}
                  className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                    selected ? 'bg-slate-50/80' : ''
                  }`}
                >
                  {/* Checkbox Column */}
                  <td
                    className="py-2 px-3 text-center align-middle"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      disabled={disabled}
                      onChange={() => onToggleSelection(fund.schemeCode)}
                      title={
                        disabled
                          ? 'You can compare up to 4 funds.'
                          : 'Select fund for comparison'
                      }
                      className="rounded border-slate-300 text-slate-900 focus:ring-0 h-3.5 w-3.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                  </td>

                  {/* Fund Name & Muted Fund House */}
                  <td className="py-2 px-3">
                    <span className="font-medium text-slate-900 hover:text-slate-700 hover:underline">
                      {fund.schemeName}
                    </span>
                    {fund.fundHouse && (
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                        {fund.fundHouse}
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-2 px-3">
                    <span className="inline-block px-1.5 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 rounded">
                      {fund.category || 'N/A'}
                    </span>
                  </td>

                  {/* NAV */}
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-medium text-slate-900">
                    {formatNav(fund.currentNav)}
                  </td>

                  {/* Trend Badge */}
                  <td className="py-2 px-3 text-center">
                    <TrendBadge trend={fund.trend} />
                  </td>

                  {/* Returns */}
                  <td
                    className={`py-2 px-3 text-right font-mono tabular-nums ${getReturnColorClass(
                      fund.returns?.['1m']
                    )}`}
                  >
                    {formatReturn(fund.returns?.['1m'])}
                  </td>
                  <td
                    className={`py-2 px-3 text-right font-mono tabular-nums ${getReturnColorClass(
                      fund.returns?.['3m']
                    )}`}
                  >
                    {formatReturn(fund.returns?.['3m'])}
                  </td>
                  <td
                    className={`py-2 px-3 text-right font-mono tabular-nums ${getReturnColorClass(
                      fund.returns?.['6m']
                    )}`}
                  >
                    {formatReturn(fund.returns?.['6m'])}
                  </td>
                  <td
                    className={`py-2 px-3 text-right font-mono tabular-nums ${getReturnColorClass(
                      fund.returns?.['1y']
                    )}`}
                  >
                    {formatReturn(fund.returns?.['1y'])}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Structured Records View */}
      <div className="block md:hidden divide-y divide-slate-200">
        {funds.map((fund) => {
          const selected = isSelected(fund.schemeCode);
          const disabled = !selected && isMaxReached;

          return (
            <div
              key={fund.schemeCode}
              onClick={() => navigate(`/fund/${fund.schemeCode}`)}
              className={`p-3 space-y-2 cursor-pointer transition-colors ${
                selected ? 'bg-slate-50' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-slate-900 leading-snug">
                    {fund.schemeName}
                  </div>
                  <div className="text-[11px] text-slate-500">{fund.fundHouse}</div>
                </div>
                <div onClick={(e) => e.stopPropagation()} className="pt-0.5">
                  <input
                    type="checkbox"
                    checked={selected}
                    disabled={disabled}
                    onChange={() => onToggleSelection(fund.schemeCode)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-0 h-4 w-4 cursor-pointer disabled:opacity-30"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded">
                    {fund.category}
                  </span>
                  <TrendBadge trend={fund.trend} />
                </div>
                <div className="font-mono tabular-nums font-semibold text-slate-900">
                  {formatNav(fund.currentNav)}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1 text-[11px] font-mono tabular-nums pt-1 text-center bg-slate-50 p-1.5 rounded">
                <div>
                  <div className="text-[9px] font-sans text-slate-400">1M</div>
                  <div className={getReturnColorClass(fund.returns?.['1m'])}>
                    {formatReturn(fund.returns?.['1m'])}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] font-sans text-slate-400">3M</div>
                  <div className={getReturnColorClass(fund.returns?.['3m'])}>
                    {formatReturn(fund.returns?.['3m'])}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] font-sans text-slate-400">6M</div>
                  <div className={getReturnColorClass(fund.returns?.['6m'])}>
                    {formatReturn(fund.returns?.['6m'])}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] font-sans text-slate-400">1Y</div>
                  <div className={getReturnColorClass(fund.returns?.['1y'])}>
                    {formatReturn(fund.returns?.['1y'])}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
