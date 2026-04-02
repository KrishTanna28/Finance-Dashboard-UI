import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiPieChart,
  FiDollarSign,
  FiArrowUp,
  FiArrowDown,
  FiTarget
} from 'react-icons/fi';
import useFinanceStore from '../store/useFinanceStore';
import { formatCurrency, getCategoryColor, calculateInsights } from '../utils/calculations';

const COLORS = ['#51459E', '#FF7F5C', '#24CCA7', '#6236FF', '#FE7239', '#F9896B'];

const InsightsSection = () => {
  const { transactions } = useFinanceStore();
  const insights = useMemo(() => calculateInsights(transactions), [transactions]);

  const insightCards = [
    {
      title: 'Top Spending',
      value: insights.highestSpendingCategory.category || 'N/A',
      subValue: formatCurrency(insights.highestSpendingCategory.amount || 0),
      icon: <FiPieChart className="w-5 h-5" />,
      color: 'primary'
    },
    {
      title: 'Monthly Savings',
      value: formatCurrency(insights.savings),
      subValue: `${insights.savingsRate}% saved`,
      icon: <FiDollarSign className="w-5 h-5" />,
      color: 'success',
      trend: insights.savings >= 0 ? 'positive' : 'negative'
    },
    {
      title: 'Expense Change',
      value: `${insights.monthlyComparison.expenseChange > 0 ? '+' : ''}${insights.monthlyComparison.expenseChange}%`,
      subValue: 'vs last month',
      icon: insights.monthlyComparison.expenseChange > 0 
        ? <FiTrendingUp className="w-5 h-5" />
        : <FiTrendingDown className="w-5 h-5" />,
      color: insights.monthlyComparison.expenseChange > 0 ? 'danger' : 'success',
      trend: insights.monthlyComparison.expenseChange > 0 ? 'negative' : 'positive'
    },
    {
      title: 'Avg Expense',
      value: formatCurrency(insights.averageMonthlyExpense),
      subValue: 'per month',
      icon: <FiTarget className="w-5 h-5" />,
      color: 'accent'
    }
  ];

  const colorClasses = {
    primary: {
      bg: 'bg-primary/10',
      icon: 'bg-primary text-white'
    },
    success: {
      bg: 'bg-success/10',
      icon: 'bg-success text-white'
    },
    danger: {
      bg: 'bg-danger/10',
      icon: 'bg-danger text-white'
    },
    accent: {
      bg: 'bg-accent/10',
      icon: 'bg-accent text-white'
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Financial Insights
          </h3>
          <p className="text-sm text-grey">
            Quick overview of your spending patterns
          </p>
        </div>
      </div>

      {/* Insight Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {insightCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${colorClasses[card.color].icon}`}>
                {card.icon}
              </div>
              {card.trend && (
                <span className={`flex items-center text-xs font-medium ${
                  card.trend === 'positive' 
                    ? 'text-success' 
                    : 'text-danger'
                }`}>
                  {card.trend === 'positive' 
                    ? <FiArrowUp className="w-3 h-3 mr-0.5" />
                    : <FiArrowDown className="w-3 h-3 mr-0.5" />
                  }
                  {card.trend === 'positive' ? 'Good' : 'High'}
                </span>
              )}
            </div>
            <h4 className="text-xs font-medium text-grey mb-1">
              {card.title}
            </h4>
            <p className="text-lg font-bold text-dark dark:text-white mb-0.5 truncate">
              {card.value}
            </p>
            <p className="text-xs text-grey">
              {card.subValue}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Category Breakdown */}
      {insights.categoryBreakdown.length > 0 && (
        <div className="card p-6">
          <h4 className="text-base font-semibold text-dark dark:text-white mb-4">
            Top Expense Categories
          </h4>
          <div className="space-y-4">
            {insights.categoryBreakdown.slice(0, 5).map((category, index) => (
              <div key={category.category}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    <span className="text-sm font-medium text-dark dark:text-white">
                      {category.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-grey bg-grey-bg px-2 py-0.5 rounded-full">
                      {category.percentage}%
                    </span>
                    <span className="text-sm font-semibold text-dark dark:text-white">
                      {formatCurrency(category.amount)}
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-grey-bg rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${category.percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Monthly Comparison */}
          <div className="mt-6 pt-6 border-t border-grey-border">
            <h4 className="text-base font-semibold text-dark dark:text-white mb-4">
              Monthly Comparison
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-grey-bg">
                <p className="text-xs font-medium text-grey mb-3">
                  This Month
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-grey">Income</span>
                    <span className="text-sm font-medium text-success">
                      {formatCurrency(insights.monthlyComparison.currentMonth.income)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-grey">Expenses</span>
                    <span className="text-sm font-medium text-danger">
                      {formatCurrency(insights.monthlyComparison.currentMonth.expenses)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-grey-border">
                    <span className="text-sm font-medium text-dark dark:text-white">Savings</span>
                    <span className={`text-sm font-bold ${
                      insights.monthlyComparison.currentMonth.savings >= 0
                        ? 'text-success'
                        : 'text-danger'
                    }`}>
                      {formatCurrency(insights.monthlyComparison.currentMonth.savings)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-grey-bg">
                <p className="text-xs font-medium text-grey mb-3">
                  Last Month
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-grey">Income</span>
                    <span className="text-sm font-medium text-success">
                      {formatCurrency(insights.monthlyComparison.previousMonth.income)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-grey">Expenses</span>
                    <span className="text-sm font-medium text-danger">
                      {formatCurrency(insights.monthlyComparison.previousMonth.expenses)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-grey-border">
                    <span className="text-sm font-medium text-dark dark:text-white">Savings</span>
                    <span className={`text-sm font-bold ${
                      insights.monthlyComparison.previousMonth.savings >= 0
                        ? 'text-success'
                        : 'text-danger'
                    }`}>
                      {formatCurrency(insights.monthlyComparison.previousMonth.savings)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsSection;
