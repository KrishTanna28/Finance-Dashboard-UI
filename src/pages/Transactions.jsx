import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowDown, FiArrowUp, FiPlus } from 'react-icons/fi';
import FiltersBar from '../components/FiltersBar';
import TransactionTable from '../components/TransactionTable';
import {
  openModal,
  selectFilteredTransactions,
  selectPagination,
  selectSorting,
  setItemsPerPage,
  setSorting
} from '../store/useFinanceStore';
import { selectIsAdmin } from '../store/uiSlice';

const sortOptions = [
  { value: 'date', label: 'Date' },
  { value: 'amount', label: 'Amount' },
  { value: 'category', label: 'Category' }
];

const Transactions = () => {
  const dispatch = useDispatch();
  const isAdmin = useSelector(selectIsAdmin);
  const sorting = useSelector(selectSorting);
  const pagination = useSelector(selectPagination);
  const filteredTransactions = useSelector(selectFilteredTransactions);

  const totalResults = filteredTransactions.length;

  const currentSortLabel = useMemo(
    () => sortOptions.find((option) => option.value === sorting.field)?.label || 'Date',
    [sorting.field]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="card p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Explore and manage records</p>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Transactions</h2>
          </div>
          {isAdmin && (
            <button onClick={() => dispatch(openModal())} className="btn-primary inline-flex items-center gap-2">
              <FiPlus className="h-4 w-4" />
              Add Transaction
            </button>
          )}
        </div>

        {!isAdmin && (
          <p className="mt-4 rounded-xl bg-gray-100 px-4 py-2 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            Viewer mode enabled. You can filter and search, but only Admin can add, edit, or delete transactions.
          </p>
        )}
      </section>

      <FiltersBar />

      <section className="card p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{totalResults}</span> matching transactions
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Sort by</span>
              <select
                value={sorting.field}
                onChange={(event) => dispatch(setSorting(event.target.value))}
                className="rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-gray-800 dark:text-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => dispatch(setSorting(sorting.field))}
              className="inline-flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle sort direction"
            >
              {sorting.direction === 'asc' ? <FiArrowUp className="h-4 w-4" /> : <FiArrowDown className="h-4 w-4" />}
              {sorting.direction === 'asc' ? 'Ascending' : 'Descending'}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Rows</span>
              <select
                value={pagination.itemsPerPage}
                onChange={(event) => dispatch(setItemsPerPage(Number(event.target.value)))}
                className="rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-gray-800 dark:text-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Current sort: {currentSortLabel} ({sorting.direction})
        </p>
      </section>

      <TransactionTable />
    </div>
  );
};

export default Transactions;
