import React from 'react';
import { useNavigate } from 'react-router-dom';

export function ComparisonBar({ selectedCount, onClear, maxAllowed = 4 }) {
  const navigate = useNavigate();

  if (!selectedCount || selectedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-sm px-3">
      <div className="bg-slate-900 text-white rounded px-3.5 py-2 shadow-md border border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div className="font-medium text-slate-200">
          <span className="font-bold text-white">{selectedCount}</span> {selectedCount === 1 ? 'fund' : 'funds'} selected
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onClear}
            className="px-2 py-1 text-slate-400 hover:text-white transition-colors text-xs font-medium"
          >
            Clear
          </button>
          <button
            onClick={() => navigate('/compare')}
            className="px-3 py-1 bg-white text-slate-900 hover:bg-slate-100 rounded font-semibold text-xs transition-colors"
          >
            Compare
          </button>
        </div>
      </div>
    </div>
  );
}
