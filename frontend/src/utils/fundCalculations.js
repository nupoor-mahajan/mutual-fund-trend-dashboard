/**
 * Calculates category breakdown statistics from the funds dataset.
 */
export const calculateSummaryStats = (funds = []) => {
  const stats = {
    total: funds.length,
    equity: 0,
    debt: 0,
    hybrid: 0,
  };

  funds.forEach((fund) => {
    const cat = (fund.category || '').toLowerCase();
    if (cat === 'equity') {
      stats.equity += 1;
    } else if (cat === 'debt') {
      stats.debt += 1;
    } else if (cat === 'hybrid') {
      stats.hybrid += 1;
    }
  });

  return stats;
};

/**
 * Calculates latest NAV date across dataset
 */
export const getLatestNavDate = (funds = []) => {
  if (!funds || funds.length === 0) return 'N/A';
  let latest = funds[0].latestNavDate;
  funds.forEach((fund) => {
    if (fund.latestNavDate && fund.latestNavDate > latest) {
      latest = fund.latestNavDate;
    }
  });
  return latest;
};

/**
 * Prepares normalized historical NAV data for multiple comparison funds.
 * Formula: normalizedValue = (currentNAV / startingNAV) * 100
 */
export const buildNormalizedComparisonData = (selectedFunds = []) => {
  if (!selectedFunds || selectedFunds.length === 0) return [];

  // Map each fund to its history lookup and starting NAV
  const fundMap = {};
  const dateSet = new Set();

  selectedFunds.forEach((fund) => {
    const history = fund.history || [];
    if (history.length > 0) {
      const startingNav = history[0].nav;
      const navByDate = {};
      history.forEach((h) => {
        dateSet.add(h.date);
        navByDate[h.date] = h.nav;
      });
      fundMap[fund.schemeCode] = {
        schemeCode: fund.schemeCode,
        schemeName: fund.schemeName,
        startingNav,
        navByDate,
      };
    }
  });

  const sortedDates = Array.from(dateSet).sort();

  // Build merged timeline array
  const normalizedTimeline = sortedDates.map((date) => {
    const point = { date };
    selectedFunds.forEach((fund) => {
      const fundData = fundMap[fund.schemeCode];
      if (fundData && fundData.navByDate[date] !== undefined) {
        const currentNav = fundData.navByDate[date];
        const normalizedVal = (currentNav / fundData.startingNav) * 100;
        point[fund.schemeCode] = Number(normalizedVal.toFixed(2));
      } else {
        point[fund.schemeCode] = null;
      }
    });
    return point;
  });

  return normalizedTimeline;
};
