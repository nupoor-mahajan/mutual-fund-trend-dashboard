/**
 * Formats NAV value into Indian Rupee string format: ₹125.42
 */
export const formatNav = (value) => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return 'N/A';
  }
  return `₹${Number(value).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Formats percentage return values with sign and percent: +4.20% or -2.35%
 */
export const formatReturn = (value) => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return 'N/A';
  }
  const num = Number(value);
  const formatted = Math.abs(num).toFixed(2);
  if (num > 0) {
    return `+${formatted}%`;
  } else if (num < 0) {
    return `-${formatted}%`;
  }
  return `0.00%`;
};

/**
 * Helper to determine CSS text color class for return value
 */
export const getReturnColorClass = (value) => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return 'text-slate-500';
  }
  const num = Number(value);
  if (num > 0) return 'text-emerald-700 font-medium';
  if (num < 0) return 'text-rose-700 font-medium';
  return 'text-slate-600';
};

/**
 * Formats ISO date string (e.g., '2026-09-18') into readable format (e.g., '18 Sep 2026')
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
};
