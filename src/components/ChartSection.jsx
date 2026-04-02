import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { selectAllTransactions } from '../store/useFinanceStore';
import { selectDarkMode } from '../store/uiSlice';
import { formatCurrency, calculateMonthlyData, calculateCategorySpending } from '../utils/calculations';
import { useWindowSize } from '../hooks/useHooks';

const COLORS = ['#51459E', '#FF7F5C', '#24CCA7', '#6236FF', '#FE7239', '#F9896B', '#4F46BA', '#50BC8F'];

const ChartSection = () => {
  const transactions = useSelector(selectAllTransactions);
  const darkMode = useSelector(selectDarkMode);
  const { isMobile } = useWindowSize();
  
  const monthlyData = useMemo(() => calculateMonthlyData(transactions), [transactions]);
  const categorySpending = useMemo(() => calculateCategorySpending(transactions), [transactions]);

  const pieData = useMemo(() => 
    categorySpending.slice(0, 6).map((item, index) => ({
      ...item,
      color: COLORS[index % COLORS.length]
    })), [categorySpending]);

  // Custom tooltip for area chart
  const AreaChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie chart
  const PieChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{data.category}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatCurrency(data.amount)} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend for pie chart
  const CustomLegend = ({ payload }) => (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <span 
            className="w-3 h-3 rounded-full shrink-0" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Area Chart - Balance Trend */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Balance Trend
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Income vs Expenses over time
            </p>
          </div>
        </div>
        
        {monthlyData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#24CCA7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#24CCA7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF7F5C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF7F5C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={darkMode ? '#374151' : '#E5E7EB'} 
                  vertical={false}
                />
                <XAxis 
                  dataKey="displayMonth" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                  width={40}
                />
                <Tooltip content={<AreaChartTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#24CCA7" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                  name="Income"
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#FF7F5C" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-gray-500 dark:text-gray-400">No data available</p>
          </div>
        )}

        {/* Chart Legend */}
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-success"></span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-accent"></span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Expenses</span>
          </div>
        </div>
      </div>

      {/* Pie Chart - Category Distribution */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Spending by Category
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Where your money goes
            </p>
          </div>
        </div>

        {pieData.length > 0 ? (
          <>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 45 : 55}
                    outerRadius={isMobile ? 75 : 90}
                    paddingAngle={3}
                    dataKey="amount"
                    nameKey="category"
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieChartTooltip />} />
                  <Legend content={<CustomLegend />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Categories */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                {pieData.slice(0, 3).map((item, index) => (
                  <div 
                    key={item.category}
                    className="flex items-center gap-3"
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: item.color }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.category}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(item.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-gray-500 dark:text-gray-400">No expenses recorded</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartSection;
