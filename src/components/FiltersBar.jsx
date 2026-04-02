import { useSelector, useDispatch } from 'react-redux';
import { FiX, FiFilter } from 'react-icons/fi';
import { selectFilters, selectCategories, setFilters } from '../store/useFinanceStore';
import { selectIsAdmin } from '../store/uiSlice';

const FiltersBar = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const categories = useSelector(selectCategories);
  const isAdmin = useSelector(selectIsAdmin);

  const hasActiveFilters = 
    filters.category !== 'all' || 
    filters.type !== 'all' || 
    filters.dateRange.start || 
    filters.dateRange.end;

  const clearFilters = () => {
    dispatch(setFilters({
      category: 'all',
      type: 'all',
      dateRange: { start: '', end: '' }
    }));
  };

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <FiFilter className="w-5 h-5 text-primary" />
        <h3 className="font-medium text-gray-900 dark:text-white">Filters</h3>
        {hasActiveFilters && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            Active
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label 
            htmlFor="filter-category"
            className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5"
          >
            Category
          </label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(e) => dispatch(setFilters({ category: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-sm 
                     text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label 
            htmlFor="filter-type"
            className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5"
          >
            Type
          </label>
          <select
            id="filter-type"
            value={filters.type}
            onChange={(e) => dispatch(setFilters({ type: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-sm 
                     text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Date Range - Start */}
        <div>
          <label 
            htmlFor="filter-date-start"
            className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5"
          >
            From Date
          </label>
          <input
            type="date"
            id="filter-date-start"
            value={filters.dateRange.start}
            onChange={(e) => dispatch(setFilters({ 
              dateRange: { ...filters.dateRange, start: e.target.value } 
            }))}
            className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-sm 
                     text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Date Range - End */}
        <div>
          <label 
            htmlFor="filter-date-end"
            className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5"
          >
            To Date
          </label>
          <input
            type="date"
            id="filter-date-end"
            value={filters.dateRange.end}
            onChange={(e) => dispatch(setFilters({ 
              dateRange: { ...filters.dateRange, end: e.target.value } 
            }))}
            className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-sm 
                     text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400">Active filters:</span>
          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full 
                           bg-primary/10 text-primary text-xs font-medium">
              {filters.category}
              <button
                onClick={() => dispatch(setFilters({ category: 'all' }))}
                className="hover:text-primary-dark"
                aria-label="Remove category filter"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.type !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full 
                           bg-accent/10 text-accent text-xs font-medium">
              {filters.type}
              <button
                onClick={() => dispatch(setFilters({ type: 'all' }))}
                className="hover:text-accent-dark"
                aria-label="Remove type filter"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          )}
          {(filters.dateRange.start || filters.dateRange.end) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full 
                           bg-success/10 text-success text-xs font-medium">
              {filters.dateRange.start || '...'} - {filters.dateRange.end || '...'}
              <button
                onClick={() => dispatch(setFilters({ dateRange: { start: '', end: '' } }))}
                className="hover:text-success-dark"
                aria-label="Remove date filter"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="ml-auto text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default FiltersBar;
