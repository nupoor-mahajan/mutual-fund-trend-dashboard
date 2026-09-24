import React from 'react';

export function FundFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  trendFilter,
  onTrendChange,
  sortKey,
  onSortKeyChange,
  sortOrder,
  onSortOrderToggle,
}) {
  const categories = ['All', 'Equity', 'Debt', 'Hybrid'];
  const trends = ['All', 'Upward', 'Downward'];
  const sortOptions = [
    { value: 'schemeName', label: 'Fund name' },
    { value: 'currentNav', label: 'Current NAV' },
    { value: 'returns.1m', label: '1M return' },
    { value: 'returns.6m', label: '6M return' },
    { value: 'returns.1y', label: '1Y return' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded p-2.5 shadow-none text-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search funds..."
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900"
          />
        </div>

        {/* Filters and Sorting Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-medium">Category:</span>
            <div className="inline-flex border border-slate-200 rounded overflow-hidden">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={`px-2 py-1 text-xs font-medium transition-colors ${
                    categoryFilter === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Trend Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-medium">Trend:</span>
            <div className="inline-flex border border-slate-200 rounded overflow-hidden">
              {trends.map((tr) => (
                <button
                  key={tr}
                  onClick={() => onTrendChange(tr)}
                  className={`px-2 py-1 text-xs font-medium transition-colors ${
                    trendFilter === tr
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tr}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-1.5">
            <label htmlFor="sort-by-select" className="text-slate-500 font-medium">Sort by:</label>
            <select
              id="sort-by-select"
              value={sortKey}
              onChange={(e) => onSortKeyChange(e.target.value)}
              className="py-1 px-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-slate-900"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              onClick={onSortOrderToggle}
              type="button"
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-700 font-medium transition-colors"
              title={`Sort direction: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
