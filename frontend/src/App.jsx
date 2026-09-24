import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppHeader } from './components/layout/AppHeader';
import { DashboardPage } from './pages/DashboardPage';
import { FundDetailPage } from './pages/FundDetailPage';
import { ComparePage } from './pages/ComparePage';
import { useComparison } from './hooks/useComparison';

export default function App() {
  const {
    selectedCodes,
    toggleSelection,
    clearSelection,
    isSelected,
    isMaxReached,
    maxAllowed,
  } = useComparison();

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
        <AppHeader selectedCount={selectedCodes.length} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  selectedCodes={selectedCodes}
                  onToggleSelection={toggleSelection}
                  onClearSelection={clearSelection}
                  isSelected={isSelected}
                  isMaxReached={isMaxReached}
                  maxAllowed={maxAllowed}
                />
              }
            />
            <Route
              path="/fund/:schemeCode"
              element={
                <FundDetailPage
                  isSelected={isSelected}
                  onToggleSelection={toggleSelection}
                  isMaxReached={isMaxReached}
                />
              }
            />
            <Route
              path="/compare"
              element={
                <ComparePage
                  selectedCodes={selectedCodes}
                  onToggleSelection={toggleSelection}
                  onClearSelection={clearSelection}
                />
              }
            />
          </Routes>
        </main>

        <footer className="border-t border-slate-200 bg-white py-3 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-[11px] text-slate-500">
            Data shown is for analytical demonstration purposes only and is not investment advice.
          </div>
        </footer>
      </div>
    </Router>
  );
}
