import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiEdit2, 
  FiTrash2, 
  FiSearch,
  FiX,
  FiPlus,
  FiMinus,
  FiInbox
} from 'react-icons/fi';
import { 
  selectFilters,
  selectSorting,
  selectPagination,
  selectPaginatedTransactions,
  setFilters,
  setSorting,
  setPage,
  openModal,
  deleteTransaction
} from '../store/useFinanceStore';
import { selectIsAdmin } from '../store/uiSlice';
import { formatCurrency, formatDate } from '../utils/calculations';
import { useDebounce } from '../hooks/useHooks';

const TransactionTable = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const sorting = useSelector(selectSorting);
  const pagination = useSelector(selectPagination);
  const { transactions, totalItems, totalPages } = useSelector(selectPaginatedTransactions);
  const isAdmin = useSelector(selectIsAdmin);

  const [searchInput, setSearchInput] = useState(filters.search);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    dispatch(setFilters({ search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteTransaction(id));
    setDeleteConfirm(null);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => dispatch(setPage(i))}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            pagination.currentPage === i
              ? 'bg-primary text-white'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="card overflow-hidden">
      {/* Header with Search */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Transaction History
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {totalItems} transactions found
            </p>
          </div>
          
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 
                       border-none text-sm text-gray-900 dark:text-white placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Search transactions"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <FiX className="w-3 h-3 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        <AnimatePresence mode="popLayout">
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.02 }}
                className="flex items-center gap-4 p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {/* Transaction Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  transaction.type === 'income' 
                    ? 'bg-success/10' 
                    : 'bg-accent/10'
                }`}>
                  {transaction.type === 'income' 
                    ? <FiPlus className="w-5 h-5 text-success" />
                    : <FiMinus className="w-5 h-5 text-accent" />
                  }
                </div>

                {/* Transaction Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-900 dark:text-white truncate">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {transaction.category} • {formatDate(transaction.date)}
                  </p>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <p className={`text-lg font-semibold ${
                    transaction.type === 'income' 
                      ? 'text-success' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className={`text-xs px-2 py-0.5 rounded-full inline-block ${
                    transaction.type === 'income'
                      ? 'bg-success/10 text-success'
                      : 'bg-danger/10 text-danger'
                  }`}>
                    {transaction.type}
                  </p>
                </div>

                {/* Admin Actions */}
                {isAdmin && (
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => dispatch(openModal(transaction))}
                      className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                      aria-label={`Edit ${transaction.description}`}
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(transaction.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-danger hover:bg-danger/10 transition-colors"
                      aria-label={`Delete ${transaction.description}`}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <FiInbox className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                No transactions found
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filters.search || filters.category !== 'all' || filters.type !== 'all'
                  ? 'Try adjusting your filters'
                  : isAdmin ? 'Add a transaction to get started' : 'No transactions to display'}
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, totalItems)} of{' '}
            {totalItems} entries
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(setPage(pagination.currentPage - 1))}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400
                       hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {renderPagination()}
            <button
              onClick={() => dispatch(setPage(pagination.currentPage + 1))}
              disabled={pagination.currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400
                       hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-xl"
            >
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Delete Transaction
              </h4>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Are you sure you want to delete this transaction? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 btn-danger"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionTable;
