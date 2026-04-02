import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowDownRight, FiArrowUpRight, FiDollarSign, FiPlus, FiShield, FiEye } from 'react-icons/fi';
import { openModal, selectAllTransactions } from '../store/useFinanceStore';
import { selectIsAdmin, selectRole } from '../store/uiSlice';
import { calculateTotals, formatCurrency, formatDate } from '../utils/calculations';
import ChartSection from '../components/ChartSection';

const Dashboard = () => {
  const dispatch = useDispatch();
  const role = useSelector(selectRole);
  const isAdmin = useSelector(selectIsAdmin);
  const transactions = useSelector(selectAllTransactions);

  const totals = useMemo(() => calculateTotals(transactions), [transactions]);

  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5),
    [transactions]
  );

  const hasTransactions = transactions.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="card p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Financial Summary</p>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Overview Dashboard</h2>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                isAdmin
                  ? 'bg-success/10 text-success'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {isAdmin ? <FiShield className="h-3.5 w-3.5" /> : <FiEye className="h-3.5 w-3.5" />}
              {role === 'admin' ? 'Admin Mode' : 'Viewer Mode'}
            </span>
            {isAdmin && (
              <button onClick={() => dispatch(openModal())} className="btn-primary inline-flex items-center gap-2">
                <FiPlus className="h-4 w-4" />
                Add Transaction
              </button>
            )}
          </div>
        </div>

        {!isAdmin && (
          <p className="mt-4 rounded-xl bg-gray-100 px-4 py-2 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            Viewer mode is read-only. Switch to Admin in the header to add or edit transactions.
          </p>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Balance</p>
            <span className="rounded-lg bg-primary/10 p-2 text-primary">
              <FiDollarSign className="h-4 w-4" />
            </span>
          </div>
          <p className={`mt-3 text-2xl font-bold ${totals.balance >= 0 ? 'text-success' : 'text-danger'}`}>
            {formatCurrency(totals.balance)}
          </p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">Income</p>
            <span className="rounded-lg bg-success/10 p-2 text-success">
              <FiArrowUpRight className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-success">{formatCurrency(totals.totalIncome)}</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">Expenses</p>
            <span className="rounded-lg bg-danger/10 p-2 text-danger">
              <FiArrowDownRight className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-danger">{formatCurrency(totals.totalExpenses)}</p>
        </div>
      </section>

      <ChartSection />

      <section className="card p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {hasTransactions ? `${recentTransactions.length} latest entries` : 'No data yet'}
          </p>
        </div>

        {hasTransactions ? (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/60"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {transaction.category} | {formatDate(transaction.date)}
                  </p>
                </div>
                <p
                  className={`font-semibold ${
                    transaction.type === 'income' ? 'text-success' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300">No transactions available. Add one to populate charts and insights.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
