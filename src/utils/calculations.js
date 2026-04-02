/**
 * Calculate total income, expenses, and balance
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} - { totalIncome, totalExpenses, balance }
 */
export const calculateTotals = (transactions) => {
  const totals = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.totalIncome += transaction.amount;
      } else {
        acc.totalExpenses += transaction.amount;
      }
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0 }
  );

  const balance = totals.totalIncome - totals.totalExpenses;

  return {
    ...totals,
    balance,
    totalBalance: balance
  };
};

/**
 * Calculate spending by category
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} - Array of { category, amount, percentage }
 */
export const calculateCategorySpending = (transactions) => {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  const categoryMap = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryMap)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  return categoryData;
};

/**
 * Calculate monthly aggregated data for charts
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} - Array of monthly data with income, expenses, and balance
 */
export const calculateMonthlyData = (transactions) => {
  const monthlyMap = transactions.reduce((acc, t) => {
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, income: 0, expenses: 0 };
    }
    
    if (t.type === 'income') {
      acc[monthKey].income += t.amount;
    } else {
      acc[monthKey].expenses += t.amount;
    }
    
    return acc;
  }, {});

  // Convert to array and calculate running balance
  const monthlyData = Object.values(monthlyMap)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((month) => ({
      ...month,
      balance: month.income - month.expenses,
      displayMonth: formatMonth(month.month)
    }));

  // Calculate cumulative balance
  let runningBalance = 0;
  monthlyData.forEach((month) => {
    runningBalance += month.balance;
    month.cumulativeBalance = runningBalance;
  });

  return monthlyData;
};

/**
 * Format month string (YYYY-MM) to readable format
 * @param {string} monthStr - Month string in YYYY-MM format
 * @returns {string} - Formatted month (e.g., "Jan 2024")
 */
const formatMonth = (monthStr) => {
  const [year, month] = monthStr.split('-');
  const date = new Date(year, parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

/**
 * Calculate financial insights
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} - Various insights about spending patterns
 */
export const calculateInsights = (transactions) => {
  const totals = calculateTotals(transactions);
  const categorySpending = calculateCategorySpending(transactions);
  const monthlyData = calculateMonthlyData(transactions);

  // Current and previous month comparison
  const currentDate = new Date();
  const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
  const prevMonthKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

  const currentMonthData = monthlyData.find((m) => m.month === currentMonthKey) || { income: 0, expenses: 0 };
  const prevMonthData = monthlyData.find((m) => m.month === prevMonthKey) || { income: 0, expenses: 0 };

  // Calculate percentage change in expenses
  const expenseChange = prevMonthData.expenses > 0
    ? (((currentMonthData.expenses - prevMonthData.expenses) / prevMonthData.expenses) * 100).toFixed(1)
    : 0;

  const incomeChange = prevMonthData.income > 0
    ? (((currentMonthData.income - prevMonthData.income) / prevMonthData.income) * 100).toFixed(1)
    : 0;

  // Calculate weekly spending (last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklySpending = transactions
    .filter(t => t.type === 'expense' && new Date(t.date) >= oneWeekAgo)
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate current month savings
  const savings = currentMonthData.income - currentMonthData.expenses;

  return {
    highestSpendingCategory: categorySpending[0] || { category: 'N/A', amount: 0 },
    monthlyComparison: {
      currentMonth: {
        income: currentMonthData.income,
        expenses: currentMonthData.expenses,
        savings: currentMonthData.income - currentMonthData.expenses
      },
      previousMonth: {
        income: prevMonthData.income,
        expenses: prevMonthData.expenses,
        savings: prevMonthData.income - prevMonthData.expenses
      },
      expenseChange: parseFloat(expenseChange),
      incomeChange: parseFloat(incomeChange)
    },
    totalSavings: totals.totalBalance,
    savings: savings,
    weeklySpending: weeklySpending,
    savingsRate: totals.totalIncome > 0
      ? ((totals.totalBalance / totals.totalIncome) * 100).toFixed(1)
      : 0,
    averageMonthlyExpense: monthlyData.length > 0
      ? Math.round(monthlyData.reduce((sum, m) => sum + m.expenses, 0) / monthlyData.length)
      : 0,
    categoryBreakdown: categorySpending.slice(0, 5)
  };
};

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format date for display
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Get color for chart based on category
 * @param {number} index - Category index
 * @returns {string} - Color hex code
 */
export const getCategoryColor = (index) => {
  const colors = [
    '#0ea5e9', // primary blue
    '#22c55e', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
    '#6366f1', // indigo
    '#84cc16', // lime
    '#06b6d4', // cyan
    '#a855f7'  // violet
  ];
  return colors[index % colors.length];
};

/**
 * Debounce function for search input
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};
