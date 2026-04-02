import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/calculations';

const SummaryCard = ({ title, amount, icon, trend, color, delay = 0 }) => {
  const colorClasses = {
    primary: {
      bg: 'bg-primary-50 dark:bg-primary-900/20',
      icon: 'text-primary-600 dark:text-primary-400',
      iconBg: 'bg-primary-100 dark:bg-primary-900/30'
    },
    success: {
      bg: 'bg-success-50 dark:bg-success-600/10',
      icon: 'text-success-600 dark:text-success-400',
      iconBg: 'bg-success-100 dark:bg-success-600/20'
    },
    danger: {
      bg: 'bg-danger-50 dark:bg-danger-600/10',
      icon: 'text-danger-600 dark:text-danger-400',
      iconBg: 'bg-danger-100 dark:bg-danger-600/20'
    }
  };

  const colorConfig = colorClasses[color] || colorClasses.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`${colorConfig.bg} rounded-2xl p-6 card-hover`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(amount)}
          </h3>
        </div>
        <div className={`${colorConfig.iconBg} p-3 rounded-xl ${colorConfig.icon}`}>
          {icon}
        </div>
      </div>
      
      {/* Trend indicator */}
      <div className="mt-4 flex items-center gap-2">
        <span 
          className={`inline-flex items-center text-sm font-medium ${
            trend === 'positive' 
              ? 'text-success-600 dark:text-success-400' 
              : 'text-danger-600 dark:text-danger-400'
          }`}
        >
          {trend === 'positive' ? '↑' : '↓'} 
          <span className="ml-1">
            {trend === 'positive' ? '+12.5%' : '-8.3%'}
          </span>
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          vs last month
        </span>
      </div>
    </motion.div>
  );
};

// Skeleton loader for summary card
export const SummaryCardSkeleton = () => (
  <div className="bg-white dark:bg-dark-200 rounded-2xl p-6 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="space-y-3">
        <div className="h-4 w-24 skeleton"></div>
        <div className="h-8 w-32 skeleton"></div>
      </div>
      <div className="w-12 h-12 skeleton rounded-xl"></div>
    </div>
    <div className="mt-4 flex items-center gap-2">
      <div className="h-4 w-16 skeleton"></div>
      <div className="h-4 w-20 skeleton"></div>
    </div>
  </div>
);

export default SummaryCard;
