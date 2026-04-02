import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FiBarChart2, FiDollarSign, FiPieChart, FiTrendingUp } from 'react-icons/fi';
import { selectAllTransactions } from '../store/useFinanceStore';
import { calculateCategorySpending, calculateInsights, formatCurrency } from '../utils/calculations';

const InsightMetric = ({ title, value, subtitle, icon }) => (
  <div className="card p-5">
    <div className="mb-3 flex items-center justify-between">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <span className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</span>
    </div>
    <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
  </div>
);

const Insights = () => {
  const transactions = useSelector(selectAllTransactions);

  const insights = useMemo(() => calculateInsights(transactions), [transactions]);
  const categorySpending = useMemo(() => calculateCategorySpending(transactions), [transactions]);

  const hasData = transactions.length > 0;

  const topCategory = insights.highestSpendingCategory?.category || 'N/A';
  const topCategoryAmount = insights.highestSpendingCategory?.amount || 0;
  const expenseChange = Number(insights.monthlyComparison.expenseChange || 0);
  const expenseDirection = expenseChange > 0 ? 'increased' : expenseChange < 0 ? 'decreased' : 'stayed the same';

  const observationList = [
    `Highest spending category is ${topCategory} at ${formatCurrency(topCategoryAmount)}.`,
    `Expenses ${expenseDirection} by ${Math.abs(expenseChange)}% compared with last month.`,
    `Current monthly savings are ${formatCurrency(insights.savings)} with a ${insights.savingsRate}% savings rate.`
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="card p-5 sm:p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">Data-driven summary</p>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Insights</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Understand where money is going and how this month compares to the previous one.
        </p>
      </section>

      {hasData ? (
        <>
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InsightMetric
              title="Top Spending Category"
              value={topCategory}
              subtitle={formatCurrency(topCategoryAmount)}
              icon={<FiPieChart className="h-4 w-4" />}
            />
            <InsightMetric
              title="Monthly Savings"
              value={formatCurrency(insights.savings)}
              subtitle={`${insights.savingsRate}% savings rate`}
              icon={<FiDollarSign className="h-4 w-4" />}
            />
            <InsightMetric
              title="Expense Change"
              value={`${expenseChange > 0 ? '+' : ''}${expenseChange}%`}
              subtitle="Compared to last month"
              icon={<FiTrendingUp className="h-4 w-4" />}
            />
            <InsightMetric
              title="Average Monthly Expense"
              value={formatCurrency(insights.averageMonthlyExpense)}
              subtitle="Across all recorded months"
              icon={<FiBarChart2 className="h-4 w-4" />}
            />
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="card p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Key Observations</h3>
              <div className="mt-4 space-y-3">
                {observationList.map((observation) => (
                  <p
                    key={observation}
                    className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:bg-gray-800/60 dark:text-gray-200"
                  >
                    {observation}
                  </p>
                ))}
              </div>
            </div>

            <div className="card p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Comparison</h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
                  <p className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-300">This Month</p>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Income</span>
                      <span className="font-semibold text-success">
                        {formatCurrency(insights.monthlyComparison.currentMonth.income)}
                      </span>
                    </p>
                    <p className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Expenses</span>
                      <span className="font-semibold text-danger">
                        {formatCurrency(insights.monthlyComparison.currentMonth.expenses)}
                      </span>
                    </p>
                    <p className="flex justify-between border-t border-gray-200 pt-2 font-semibold text-gray-900 dark:border-gray-700 dark:text-white">
                      <span>Savings</span>
                      <span>{formatCurrency(insights.monthlyComparison.currentMonth.savings)}</span>
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
                  <p className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-300">Last Month</p>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Income</span>
                      <span className="font-semibold text-success">
                        {formatCurrency(insights.monthlyComparison.previousMonth.income)}
                      </span>
                    </p>
                    <p className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Expenses</span>
                      <span className="font-semibold text-danger">
                        {formatCurrency(insights.monthlyComparison.previousMonth.expenses)}
                      </span>
                    </p>
                    <p className="flex justify-between border-t border-gray-200 pt-2 font-semibold text-gray-900 dark:border-gray-700 dark:text-white">
                      <span>Savings</span>
                      <span>{formatCurrency(insights.monthlyComparison.previousMonth.savings)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="card p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Expense Breakdown by Category</h3>
            <div className="mt-4 space-y-4">
              {categorySpending.slice(0, 6).map((item) => (
                <div key={item.category}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">{item.category}</span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {formatCurrency(item.amount)} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${Math.max(4, Number(item.percentage))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="card p-10 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No insight data yet</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Add a few transactions to unlock spending trends and monthly comparisons.
          </p>
        </section>
      )}
    </div>
  );
};

export default Insights;
