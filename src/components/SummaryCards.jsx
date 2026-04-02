import { motion } from 'framer-motion';
import { FiCreditCard, FiArrowUp, FiArrowDown, FiCalendar, FiMinus, FiPlus } from 'react-icons/fi';
import useFinanceStore from '../store/useFinanceStore';
import { calculateTotals, calculateInsights, formatCurrency } from '../utils/calculations';

// Credit Card Component
const CreditCard = () => (
  <div className="relative w-full h-[200px] rounded-[18px] bg-gradient-to-br from-accent to-accent-light overflow-hidden shadow-card">
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-6 right-6 w-16 h-16 rounded-full bg-white/30" />
      <div className="absolute top-12 right-16 w-10 h-10 rounded-full bg-white/20" />
    </div>
    <div className="relative p-6 flex flex-col h-full justify-between text-white">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm opacity-80">Current Balance</p>
          <p className="text-2xl font-semibold mt-1">$24,562.00</p>
        </div>
        <FiCreditCard className="w-8 h-8" />
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm opacity-80">Card Number</p>
          <p className="text-lg tracking-wider">**** **** **** 4589</p>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-80">Exp</p>
          <p className="text-lg">09/26</p>
        </div>
      </div>
    </div>
  </div>
);

// Balance Card Component
const BalanceCard = ({ totals }) => (
  <div className="relative w-full h-[200px] rounded-[18px] bg-primary overflow-hidden shadow-card">
    <div className="absolute inset-0 opacity-20">
      <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-white/20 translate-x-8 translate-y-8" />
    </div>
    <div className="relative p-6 flex flex-col h-full justify-between text-white">
      <div>
        <p className="text-sm opacity-80">Total Balance</p>
        <p className="text-3xl font-semibold mt-1">{formatCurrency(totals.balance)}</p>
      </div>
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
            <FiArrowUp className="w-4 h-4 text-success" />
          </div>
          <div>
            <p className="text-xs opacity-80">Income</p>
            <p className="text-sm font-medium">{formatCurrency(totals.totalIncome)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
            <FiArrowDown className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="text-xs opacity-80">Expense</p>
            <p className="text-sm font-medium">{formatCurrency(totals.totalExpenses)}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Summary Mini Card Component
const SummaryMiniCard = ({ title, value, subtitle, icon: Icon, trend, color }) => {
  const colorClasses = {
    purple: 'bg-primary/10 text-primary',
    orange: 'bg-accent/10 text-accent',
    green: 'bg-success/10 text-success'
  };

  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-grey">{title}</p>
        <p className="text-xl font-semibold text-dark dark:text-white mt-1">{value}</p>
        {subtitle && (
          <p className="text-xs text-grey mt-1">{subtitle}</p>
        )}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-sm ${
          trend > 0 ? 'text-success' : 'text-danger'
        }`}>
          {trend > 0 ? <FiArrowUp className="w-4 h-4" /> : <FiArrowDown className="w-4 h-4" />}
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
  );
};

// Loading Skeleton
const CardSkeleton = ({ height = 'h-[200px]' }) => (
  <div className={`animate-pulse bg-grey-bg rounded-[18px] ${height}`}>
    <div className="p-6 space-y-4">
      <div className="h-4 bg-grey-border rounded w-1/3"></div>
      <div className="h-8 bg-grey-border rounded w-2/3"></div>
      <div className="h-4 bg-grey-border rounded w-1/2"></div>
    </div>
  </div>
);

const MiniCardSkeleton = () => (
  <div className="animate-pulse card p-5">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-grey-bg rounded-xl"></div>
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-grey-bg rounded w-16"></div>
        <div className="h-6 bg-grey-bg rounded w-24"></div>
        <div className="h-3 bg-grey-bg rounded w-12"></div>
      </div>
    </div>
  </div>
);

const SummaryCards = () => {
  const { transactions, isLoading } = useFinanceStore();
  const totals = calculateTotals(transactions);
  const insights = calculateInsights(transactions);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MiniCardSkeleton />
            <MiniCardSkeleton />
            <MiniCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Credit Card + Balance Card */}
      <div className="lg:col-span-1 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CreditCard />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <BalanceCard totals={totals} />
        </motion.div>
      </div>

      {/* Right Column - Summary Mini Cards */}
      <div className="lg:col-span-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <SummaryMiniCard
              title="This Week"
              value={formatCurrency(insights.weeklySpending || 2840)}
              subtitle="Spending"
              icon={FiCalendar}
              trend={-12}
              color="purple"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SummaryMiniCard
              title="This Month"
              value={formatCurrency(totals.totalExpenses)}
              subtitle="Total Expenses"
              icon={FiMinus}
              trend={8}
              color="orange"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <SummaryMiniCard
              title="Savings"
              value={formatCurrency(insights.savings)}
              subtitle="This Month"
              icon={FiPlus}
              trend={15}
              color="green"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
