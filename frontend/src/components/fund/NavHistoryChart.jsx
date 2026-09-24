import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatNav, formatDate } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-2 rounded text-xs shadow border border-slate-800 space-y-0.5">
        <p className="text-slate-400 text-[10px]">{formatDate(label)}</p>
        <p className="font-semibold font-mono tabular-nums text-xs">
          NAV: <span className="text-white">{formatNav(payload[0].value)}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function NavHistoryChart({ history = [], schemeName = 'Fund' }) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded p-8 text-center text-slate-500 text-xs">
        No historical NAV data available.
      </div>
    );
  }

  const navValues = history.map((item) => item.nav).filter((v) => v !== null && v !== undefined);
  const minNav = Math.min(...navValues);
  const maxNav = Math.max(...navValues);
  const padding = (maxNav - minNav) * 0.05 || 1;

  return (
    <div className="bg-white border border-slate-200 rounded p-4 space-y-4 shadow-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h2 className="text-sm font-semibold text-slate-900">
          NAV History
        </h2>
        <span className="text-xs text-slate-400 font-mono">
          {history.length} trading days
        </span>
      </div>

      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={history}
            margin={{ top: 5, right: 10, left: 0, bottom: 15 }}
          >
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
              domain={[Math.floor(minNav - padding), Math.ceil(maxNav + padding)]}
              tickFormatter={(val) => `₹${val}`}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="nav"
              stroke="#0f172a"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4, stroke: '#0f172a', strokeWidth: 1.5, fill: '#ffffff' }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Methodology Panel */}
      <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs text-slate-600 leading-relaxed">
        <div className="font-medium text-slate-900 mb-0.5">Trend methodology</div>
        <div>
          A fund is marked <span className="font-semibold text-slate-900">Upward</span> when its latest NAV is greater than or equal to its average NAV over the previous 30 calendar days. Otherwise it is marked <span className="font-semibold text-slate-900">Downward</span>.
        </div>
      </div>
    </div>
  );
}
