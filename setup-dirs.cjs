
const fs = require('fs');
const path = require('path');

// Create pages directory
const pagesDir = path.join(__dirname, 'src', 'pages');
if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
  console.log('Created:', pagesDir);
}

// Dashboard Page
const dashboardContent = `import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiCreditCard, FiArrowUp, FiArrowDown, FiTrendingUp, FiDollarSign } from 'react-icons/fi';
import { selectAllTransactions } from '../store/useFinanceStore';
import { selectRole, selectIsAdmin } from '../store/uiSlice';
import { calculateTotals, calculateInsights, formatCurrency } from '../utils/calculations';
import ChartSection from '../components/ChartSection';

const SummaryCard = ({ title, value, icon: Icon, trend, color, subtitle }) => {
  const colorStyles = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    purple: 'bg-primary/10 text-primary'
  };

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div className={\`w-12 h-12 rounded-xl flex items-center justify-center \${colorStyles[color]}\`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend !== undefined && (
          <div className={\`flex items-center gap-1 text-sm font-medium \${trend >= 0 ? 'text-success' : 'text-danger'}\`}>
            {trend >= 0 ? <FiArrowUp className="w-4 h-4" /> : <FiArrowDown className="w-4 h-4" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

const CreditCardVisual = ({ balance }) => (
  <div className="relative h-48 rounded-2xl bg-gradient-to-br from-accent to-accent-light overflow-hidden shadow-lg">
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-6 right-6 w-20 h-20 rounded-full bg-white/30" />
      <div className="absolute top-14 right-16 w-12 h-12 rounded-full bg-white/20" />
    </div>
    <div className="relative p-6 h-full flex flex-col justify-between text-white">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm opacity-80">Current Balance</p>
          <p className="text-2xl font-bold mt-1">{balance}</p>
        </div>
        <FiCreditCard className="w-8 h-8 opacity-80" />
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs opacity-70">Card Number</p>
          <p className="tracking-wider">•••• •••• •••• 4589</p>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-70">Exp</p>
          <p>09/26</p>
        </div>
      </div>
    </div>
  </div>
);

const BalanceOverview = ({ totals }) => (
  <div className="relative h-48 rounded-2xl bg-primary overflow-hidden shadow-lg">
    <div className="absolute inset-0 opacity-20">
      <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-white/20 translate-x-10 translate-y-10" />
    </div>
    <div className="relative p-6 h-full flex flex-col justify-between text-white">
      <div>
        <p className="text-sm opacity-80">Total Balance</p>
        <p className="text-3xl font-bold mt-1">{formatCurrency(totals.balance)}</p>
      </div>
      <div className="flex gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <FiArrowUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs opacity-70">Income</p>
            <p className="text-sm font-semibold">{formatCurrency(totals.totalIncome)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <FiArrowDown className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs opacity-70">Expenses</p>
            <p className="text-sm font-semibold">{formatCurrency(totals.totalExpenses)}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const transactions = useSelector(selectAllTransactions);
  const role = useSelector(selectRole);
  const isAdmin = useSelector(selectIsAdmin);

  const totals = useMemo(() => calculateTotals(transactions), [transactions]);
  const insights = useMemo(() => calculateInsights(transactions), [transactions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {isAdmin ? 'Welcome back! Here\\'s your financial overview.' : 'View-only mode. Contact admin for changes.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={\`px-3 py-1 rounded-full text-xs font-medium \${
            isAdmin 
              ? 'bg-success/10 text-success' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }\`}>
            {role.charAt(0).toUpperCase() + role.slice(1)} Mode
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <CreditCardVisual balance={formatCurrency(24562)} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <BalanceOverview totals={totals} />
          </motion.div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <SummaryCard
              title="Total Income"
              value={formatCurrency(totals.totalIncome)}
              icon={FiArrowUp}
              trend={insights.monthlyComparison?.incomeChange || 0}
              color="success"
              subtitle="This month"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <SummaryCard
              title="Total Expenses"
              value={formatCurrency(totals.totalExpenses)}
              icon={FiArrowDown}
              trend={insights.monthlyComparison?.expenseChange || 0}
              color="accent"
              subtitle="This month"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <SummaryCard
              title="Savings"
              value={formatCurrency(insights.savings || 0)}
              icon={FiDollarSign}
              trend={insights.savingsRate || 0}
              color="primary"
              subtitle={\`\${insights.savingsRate || 0}% saved\`}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <SummaryCard
              title="Top Spending"
              value={insights.highestSpendingCategory?.category || 'N/A'}
              icon={FiTrendingUp}
              color="purple"
              subtitle={insights.highestSpendingCategory?.amount ? formatCurrency(insights.highestSpendingCategory.amount) : 'No expenses'}
            />
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <ChartSection />
      </motion.div>

      {!isAdmin && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6">
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <FiCreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Viewing as {role}</p>
              <p className="text-sm">You can view all financial data but cannot make changes. Switch to Admin mode to edit.</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
`;

fs.writeFileSync(path.join(pagesDir, 'Dashboard.jsx'), dashboardContent);
console.log('Created: Dashboard.jsx');

// Transactions Page
const transactionsContent = `import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiPlus, FiDownload, FiEye, FiLock } from 'react-icons/fi';
import { selectIsAdmin } from '../store/uiSlice';
import { openModal } from '../store/useFinanceStore';
import TransactionTable from '../components/TransactionTable';
import FiltersBar from '../components/FiltersBar';

const Transactions = () => {
  const dispatch = useDispatch();
  const isAdmin = useSelector(selectIsAdmin);

  const handleExport = () => {
    alert('Export feature would download transactions as CSV');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {isAdmin ? 'Manage your income and expenses' : 'View your transaction history'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <>
              <button
                onClick={handleExport}
                className="btn-secondary flex items-center gap-2"
              >
                <FiDownload className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={() => dispatch(openModal())}
                className="btn-primary flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Transaction</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 dark:text-gray-400">
              <FiEye className="w-4 h-4" />
              <span className="text-sm">View Only</span>
            </div>
          )}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <FiltersBar />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <TransactionTable />
      </motion.div>

      {!isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <FiLock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Read-Only Access</p>
              <p className="text-sm">Switch to Admin mode to add, edit, or delete transactions.</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Transactions;
`;

fs.writeFileSync(path.join(pagesDir, 'Transactions.jsx'), transactionsContent);
console.log('Created: Transactions.jsx');

// Insights Page
const insightsContent = `import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiDollarSign, 
  FiPieChart,
  FiBarChart2,
  FiActivity,
  FiTarget,
  FiAward
} from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { selectAllTransactions } from '../store/useFinanceStore';
import { selectIsAdmin } from '../store/uiSlice';
import { calculateTotals, calculateInsights, calculateCategorySpending, calculateMonthlyData, formatCurrency } from '../utils/calculations';

const COLORS = ['#51459E', '#FF7F5C', '#24CCA7', '#6236FF', '#FE7239', '#E63956', '#4F46BA', '#50BC8F'];

const InsightCard = ({ title, value, subtitle, icon: Icon, trend, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    accent: 'bg-accent/10 text-accent',
    danger: 'bg-danger/10 text-danger'
  };

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div className={\`w-12 h-12 rounded-xl flex items-center justify-center \${colorClasses[color]}\`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend !== undefined && (
          <div className={\`flex items-center gap-1 text-sm font-medium \${trend >= 0 ? 'text-success' : 'text-danger'}\`}>
            {trend >= 0 ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
            <span>{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

const Insights = () => {
  const transactions = useSelector(selectAllTransactions);
  const isAdmin = useSelector(selectIsAdmin);

  const totals = useMemo(() => calculateTotals(transactions), [transactions]);
  const insights = useMemo(() => calculateInsights(transactions), [transactions]);
  const categorySpending = useMemo(() => calculateCategorySpending(transactions), [transactions]);
  const monthlyData = useMemo(() => calculateMonthlyData(transactions), [transactions]);

  const pieData = categorySpending.slice(0, 6).map(cat => ({
    name: cat.category,
    value: cat.amount
  }));

  const avgMonthlyIncome = monthlyData.length > 0 
    ? monthlyData.reduce((sum, m) => sum + m.income, 0) / monthlyData.length 
    : 0;

  const avgMonthlyExpense = monthlyData.length > 0 
    ? monthlyData.reduce((sum, m) => sum + m.expenses, 0) / monthlyData.length 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Insights</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Analyze your spending patterns and financial health
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <InsightCard
            title="Net Savings"
            value={formatCurrency(insights.savings || 0)}
            subtitle={\`\${(insights.savingsRate || 0).toFixed(1)}% of income\`}
            icon={FiDollarSign}
            trend={insights.savingsRate}
            color="success"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <InsightCard
            title="Avg Monthly Income"
            value={formatCurrency(avgMonthlyIncome)}
            subtitle="Based on all months"
            icon={FiTrendingUp}
            color="primary"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <InsightCard
            title="Avg Monthly Expense"
            value={formatCurrency(avgMonthlyExpense)}
            subtitle="Based on all months"
            icon={FiTrendingDown}
            color="accent"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <InsightCard
            title="Top Spending"
            value={insights.highestSpendingCategory?.category || 'N/A'}
            subtitle={insights.highestSpendingCategory?.amount ? formatCurrency(insights.highestSpendingCategory.amount) : 'No data'}
            icon={FiTarget}
            color="danger"
          />
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Comparison */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FiBarChart2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Monthly Comparison</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Income vs Expenses by month</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData.slice(-6)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#24CCA7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#FF7F5C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <FiPieChart className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Spending by Category</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Where your money goes</p>
            </div>
          </div>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex-1 truncate">{entry.name}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(entry.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Category Breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <FiActivity className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Category Breakdown</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Detailed spending analysis</p>
          </div>
        </div>
        <div className="space-y-4">
          {categorySpending.slice(0, 8).map((cat, index) => {
            const maxAmount = categorySpending[0]?.amount || 1;
            const percentage = (cat.amount / maxAmount) * 100;
            return (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.category}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(cat.amount)}</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: \`\${percentage}%\` }}
                    transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Financial Health Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FiAward className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Financial Health Summary</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-sm text-gray-500 dark:text-gray-400">Savings Rate</p>
            <p className={\`text-xl font-bold \${(insights.savingsRate || 0) >= 20 ? 'text-success' : (insights.savingsRate || 0) >= 10 ? 'text-accent' : 'text-danger'}\`}>
              {(insights.savingsRate || 0).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {(insights.savingsRate || 0) >= 20 ? 'Excellent!' : (insights.savingsRate || 0) >= 10 ? 'Good' : 'Needs improvement'}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Transactions</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{transactions.length}</p>
            <p className="text-xs text-gray-400 mt-1">All time</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-sm text-gray-500 dark:text-gray-400">Categories Used</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{categorySpending.length}</p>
            <p className="text-xs text-gray-400 mt-1">Spending categories</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Insights;
`;

fs.writeFileSync(path.join(pagesDir, 'Insights.jsx'), insightsContent);
console.log('Created: Insights.jsx');

console.log('\\nAll pages created successfully!');
console.log('Run npm install and npm run dev to start the app.');

