import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { buildNormalizedComparisonData } from '../../utils/fundCalculations';
import { formatDate } from '../../utils/formatters';

const CHART_COLORS = ['#0f172a', '#047857', '#2563eb', '#b45309'];

const CustomTooltip = ({ active, payload, label, selectedFunds = [] }) => {
  if (active && payload && payload.length) {
    const fundMap = {};
    selectedFunds.forEach((f) => {
      fundMap[f.schemeCode] = f.schemeName;
    });

    return (
      <div className="bg-slate-900 text-white p-2.5 rounded text-xs shadow border border-slate-800 space-y-1 min-w-[190px]">
        <p className="text-slate-400 text-[10px] border-b border-slate-800 pb-1">
          {formatDate(label)}
        </p>
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-3">
            <span className="truncate max-w-[150px]" style={{ color: entry.color }}>
              {fundMap[entry.dataKey] || entry.dataKey}:
            </span>
            <span className="font-semibold font-mono tabular-nums">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function NormalizedComparisonChart({ selectedFunds = [] }) {
  if (!selectedFunds || selectedFunds.length === 0) return null;

  const data = buildNormalizedComparisonData(selectedFunds);

  return (
    <div className="bg-white border border-slate-200 rounded p-4 space-y-3 shadow-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Normalized Performance <span className="text-slate-400 font-normal text-xs">(Start = 100)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Each series is rebased to 100 at the beginning of the displayed period to make relative movement comparable.
          </p>
        </div>
      </div>

      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 15 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => {
                if (!date) return '';
                const parts = date.split('-');
                if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
                return date;
              }}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              dy={8}
            />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(val) => `${val}`}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip selectedFunds={selectedFunds} />} />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
              formatter={(value) => {
                const fund = selectedFunds.find((f) => String(f.schemeCode) === String(value));
                return (
                  <span className="text-xs text-slate-700 font-medium ml-1">
                    {fund ? fund.schemeName : value}
                  </span>
                );
              }}
            />
            {selectedFunds.map((fund, idx) => (
              <Line
                key={fund.schemeCode}
                type="monotone"
                dataKey={fund.schemeCode}
                name={String(fund.schemeCode)}
                stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                strokeWidth={1.5}
                dot={false}
                connectNulls
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
