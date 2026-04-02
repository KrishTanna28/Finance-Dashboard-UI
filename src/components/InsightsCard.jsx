import { motion } from 'framer-motion';

const InsightsCard = ({ 
  title, 
  value, 
  subValue, 
  icon, 
  color = 'primary',
  trend,
  delay = 0 
}) => {
  const colorClasses = {
    primary: 'bg-primary-50 dark:bg-primary-900/20',
    success: 'bg-success-50 dark:bg-success-600/10',
    danger: 'bg-danger-50 dark:bg-danger-600/10',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
    orange: 'bg-orange-50 dark:bg-orange-900/20',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20'
  };

  const iconColorClasses = {
    primary: 'bg-primary-500 text-white',
    success: 'bg-success-500 text-white',
    danger: 'bg-danger-500 text-white',
    purple: 'bg-purple-500 text-white',
    orange: 'bg-orange-500 text-white',
    emerald: 'bg-emerald-500 text-white'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`${colorClasses[color]} rounded-xl p-5 card-hover`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`${iconColorClasses[color]} p-2.5 rounded-lg`}>
          {icon}
        </div>
        {trend && (
          <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
            trend === 'positive' 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
              : trend === 'negative'
              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}>
            {trend === 'positive' ? '↑' : trend === 'negative' ? '↓' : '→'} 
            {trend === 'positive' ? 'Up' : trend === 'negative' ? 'Down' : 'Stable'}
          </span>
        )}
      </div>
      
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {title}
      </h4>
      
      <p className="text-xl font-bold text-gray-900 dark:text-white mb-0.5">
        {value}
      </p>
      
      {subValue && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {subValue}
        </p>
      )}
    </motion.div>
  );
};

// Skeleton loader for InsightsCard
export const InsightsCardSkeleton = () => (
  <div className="bg-white dark:bg-dark-200 rounded-xl p-5 animate-pulse">
    <div className="flex items-start justify-between mb-3">
      <div className="w-10 h-10 skeleton rounded-lg"></div>
      <div className="w-12 h-5 skeleton rounded-full"></div>
    </div>
    <div className="h-4 w-24 skeleton mb-2"></div>
    <div className="h-6 w-20 skeleton mb-1"></div>
    <div className="h-3 w-16 skeleton"></div>
  </div>
);

export default InsightsCard;
