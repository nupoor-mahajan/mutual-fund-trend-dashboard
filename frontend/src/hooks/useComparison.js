import { useState, useEffect } from 'react';

const STORAGE_KEY = 'selected_comparison_funds';
const MAX_COMPARISON = 4;

export function useComparison() {
  const [selectedCodes, setSelectedCodes] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.slice(0, MAX_COMPARISON);
        }
      }
    } catch (e) {
      console.error('Failed to parse selected comparison funds from localStorage', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedCodes));
    } catch (e) {
      console.error('Failed to save selected comparison funds to localStorage', e);
    }
  }, [selectedCodes]);

  const toggleSelection = (code) => {
    const numCode = Number(code);
    setSelectedCodes((prev) => {
      if (prev.includes(numCode)) {
        return prev.filter((item) => item !== numCode);
      } else {
        if (prev.length >= MAX_COMPARISON) {
          return prev; // Reached limit
        }
        return [...prev, numCode];
      }
    });
  };

  const isSelected = (code) => {
    return selectedCodes.includes(Number(code));
  };

  const clearSelection = () => {
    setSelectedCodes([]);
  };

  const isMaxReached = selectedCodes.length >= MAX_COMPARISON;

  return {
    selectedCodes,
    toggleSelection,
    clearSelection,
    isSelected,
    isMaxReached,
    maxAllowed: MAX_COMPARISON,
  };
}
