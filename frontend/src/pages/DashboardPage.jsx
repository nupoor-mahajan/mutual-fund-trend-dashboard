import React, { useState, useMemo } from 'react';
import fundsData from '../data/funds.json';
import { SummaryStats } from '../components/dashboard/SummaryStats';
import { FundFilters } from '../components/dashboard/FundFilters';
import { FundTable } from '../components/dashboard/FundTable';
import { ComparisonBar } from '../components/dashboard/ComparisonBar';
import { calculateSummaryStats, getLatestNavDate } from '../utils/fundCalculations';
import { formatDate } from '../utils/formatters';

export function DashboardPage({
  selectedCodes,
  onToggleSelection,
  onClearSelection,
  isSelected,
  isMaxReached,
  maxAllowed,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [trendFilter, setTrendFilter] = useState('All');
  const [sortKey, setSortKey] = useState('schemeName');
  const [sortOrder, setSortOrder] = useState('asc');

  // Compute dataset metrics
  const stats = useMemo(() => calculateSummaryStats(fundsData), []);
  const latestDate = useMemo(() => getLatestNavDate(fundsData), []);

  // Filter and Sort Funds
  const filteredFunds = useMemo(() => {
    let result = [...fundsData];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (f) =>
          (f.schemeName && f.schemeName.toLowerCase().includes(q)) ||
          (f.fundHouse && f.fundHouse.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (categoryFilter !== 'All') {
      result = result.filter(
        (f) => (f.category || '').toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Trend filter
    if (trendFilter !== 'All') {
      result = result.filter((f) => f.trend === trendFilter);
    }

    // Sorting
    result.sort((a, b) => {
      let valA, valB;

      if (sortKey.startsWith('returns.')) {
        const period = sortKey.split('.')[1];
        valA = a.returns ? a.returns[period] : null;
        valB = b.returns ? b.returns[period] : null;
      } else {
        valA = a[sortKey];
        valB = b[sortKey];
      }

      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === 'string') {
        const cmp = valA.localeCompare(valB);
        return sortOrder === 'asc' ? cmp : -cmp;
      }

      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return result;
  }, [searchQuery, categoryFilter, trendFilter, sortKey, sortOrder]);

  return (
    <div className="space-y-4 pb-16">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Mutual Fund Trends
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare recent NAV movement across 30 selected schemes.
          </p>
        </div>
        <div className="text-xs text-slate-500">
          Last NAV update: <span className="font-semibold text-slate-700">{formatDate(latestDate)}</span>
        </div>
      </div>

      {/* Summary Row */}
      <SummaryStats stats={stats} />

      {/* Filter Toolbar */}
      <FundFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        trendFilter={trendFilter}
        onTrendChange={setTrendFilter}
        sortKey={sortKey}
        onSortKeyChange={setSortKey}
        sortOrder={sortOrder}
        onSortOrderToggle={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
      />

      {/* Main Table Container */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500 px-0.5">
          <span>
            Showing <strong className="text-slate-800">{filteredFunds.length}</strong> of{' '}
            <strong className="text-slate-800">{fundsData.length}</strong> funds
          </span>
          {isMaxReached && (
            <span className="text-slate-600 font-medium">
              You can compare up to 4 funds.
            </span>
          )}
        </div>

        <FundTable
          funds={filteredFunds}
          isSelected={isSelected}
          onToggleSelection={onToggleSelection}
          isMaxReached={isMaxReached}
        />
      </div>

      {/* Comparison Selection Bar */}
      <ComparisonBar
        selectedCount={selectedCodes.length}
        onClear={onClearSelection}
        maxAllowed={maxAllowed}
      />
    </div>
  );
}
