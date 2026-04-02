import { createSlice } from '@reduxjs/toolkit';

// Sample initial transactions
const initialTransactions = [
  {
    id: '1',
    date: '2024-03-01',
    amount: 5000,
    category: 'Salary',
    type: 'income',
    description: 'Monthly salary'
  },
  {
    id: '2',
    date: '2024-03-02',
    amount: 150,
    category: 'Groceries',
    type: 'expense',
    description: 'Weekly groceries'
  },
  {
    id: '3',
    date: '2024-03-05',
    amount: 200,
    category: 'Utilities',
    type: 'expense',
    description: 'Electricity bill'
  },
  {
    id: '4',
    date: '2024-03-08',
    amount: 1200,
    category: 'Rent',
    type: 'expense',
    description: 'Monthly rent'
  },
  {
    id: '5',
    date: '2024-03-10',
    amount: 500,
    category: 'Freelance',
    type: 'income',
    description: 'Freelance project'
  },
  {
    id: '6',
    date: '2024-03-12',
    amount: 80,
    category: 'Entertainment',
    type: 'expense',
    description: 'Movie tickets'
  },
  {
    id: '7',
    date: '2024-03-15',
    amount: 300,
    category: 'Shopping',
    type: 'expense',
    description: 'Clothing'
  },
  {
    id: '8',
    date: '2024-03-18',
    amount: 120,
    category: 'Transportation',
    type: 'expense',
    description: 'Gas and maintenance'
  },
  {
    id: '9',
    date: '2024-03-20',
    amount: 250,
    category: 'Investment',
    type: 'income',
    description: 'Dividend income'
  },
  {
    id: '10',
    date: '2024-03-22',
    amount: 180,
    category: 'Healthcare',
    type: 'expense',
    description: 'Doctor visit'
  },
  {
    id: '11',
    date: '2024-02-01',
    amount: 5000,
    category: 'Salary',
    type: 'income',
    description: 'Monthly salary'
  },
  {
    id: '12',
    date: '2024-02-05',
    amount: 1200,
    category: 'Rent',
    type: 'expense',
    description: 'Monthly rent'
  },
  {
    id: '13',
    date: '2024-02-10',
    amount: 200,
    category: 'Groceries',
    type: 'expense',
    description: 'Weekly groceries'
  },
  {
    id: '14',
    date: '2024-02-15',
    amount: 100,
    category: 'Entertainment',
    type: 'expense',
    description: 'Streaming subscriptions'
  },
  {
    id: '15',
    date: '2024-01-01',
    amount: 5000,
    category: 'Salary',
    type: 'income',
    description: 'Monthly salary'
  },
  {
    id: '16',
    date: '2024-01-10',
    amount: 1200,
    category: 'Rent',
    type: 'expense',
    description: 'Monthly rent'
  },
  {
    id: '17',
    date: '2024-01-15',
    amount: 350,
    category: 'Shopping',
    type: 'expense',
    description: 'Electronics'
  },
  {
    id: '18',
    date: '2024-01-20',
    amount: 150,
    category: 'Groceries',
    type: 'expense',
    description: 'Weekly groceries'
  }
];

const categories = [
  'Salary',
  'Freelance',
  'Investment',
  'Rent',
  'Groceries',
  'Utilities',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Education',
  'Other'
];

// Load from localStorage
const loadState = () => {
  try {
    const saved = localStorage.getItem('finance-transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  } catch {
    return initialTransactions;
  }
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    items: loadState(),
    categories,
    filters: {
      search: '',
      category: 'all',
      type: 'all',
      dateRange: { start: '', end: '' }
    },
    sorting: {
      field: 'date',
      direction: 'desc'
    },
    pagination: {
      currentPage: 1,
      itemsPerPage: 10
    },
    isModalOpen: false,
    editingTransaction: null
  },
  reducers: {
    addTransaction: (state, action) => {
      const newTransaction = {
        ...action.payload,
        id: Date.now().toString()
      };
      state.items.unshift(newTransaction);
      localStorage.setItem('finance-transactions', JSON.stringify(state.items));
    },
    updateTransaction: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.items.findIndex(t => t.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updates };
        localStorage.setItem('finance-transactions', JSON.stringify(state.items));
      }
    },
    deleteTransaction: (state, action) => {
      state.items = state.items.filter(t => t.id !== action.payload);
      localStorage.setItem('finance-transactions', JSON.stringify(state.items));
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1;
    },
    setSorting: (state, action) => {
      const field = action.payload;
      state.sorting = {
        field,
        direction: state.sorting.field === field && state.sorting.direction === 'asc' ? 'desc' : 'asc'
      };
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.pagination.itemsPerPage = action.payload;
      state.pagination.currentPage = 1;
    },
    openModal: (state, action) => {
      state.isModalOpen = true;
      state.editingTransaction = action.payload || null;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.editingTransaction = null;
    }
  }
});

export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setFilters,
  setSorting,
  setPage,
  setItemsPerPage,
  openModal,
  closeModal
} = transactionsSlice.actions;

// Selectors
export const selectAllTransactions = state => state.transactions.items;
export const selectCategories = state => state.transactions.categories;
export const selectFilters = state => state.transactions.filters;
export const selectSorting = state => state.transactions.sorting;
export const selectPagination = state => state.transactions.pagination;
export const selectIsModalOpen = state => state.transactions.isModalOpen;
export const selectEditingTransaction = state => state.transactions.editingTransaction;

export const selectFilteredTransactions = state => {
  const { items, filters, sorting } = state.transactions;
  let filtered = [...items];

  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(t =>
      t.description.toLowerCase().includes(searchLower) ||
      t.category.toLowerCase().includes(searchLower)
    );
  }

  // Apply category filter
  if (filters.category !== 'all') {
    filtered = filtered.filter(t => t.category === filters.category);
  }

  // Apply type filter
  if (filters.type !== 'all') {
    filtered = filtered.filter(t => t.type === filters.type);
  }

  // Apply date range filter
  if (filters.dateRange.start) {
    filtered = filtered.filter(t => t.date >= filters.dateRange.start);
  }
  if (filters.dateRange.end) {
    filtered = filtered.filter(t => t.date <= filters.dateRange.end);
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let comparison = 0;
    if (sorting.field === 'date') {
      comparison = new Date(a.date) - new Date(b.date);
    } else if (sorting.field === 'amount') {
      comparison = a.amount - b.amount;
    } else if (sorting.field === 'category') {
      comparison = a.category.localeCompare(b.category);
    }
    return sorting.direction === 'asc' ? comparison : -comparison;
  });

  return filtered;
};

export const selectPaginatedTransactions = state => {
  const filtered = selectFilteredTransactions(state);
  const { currentPage, itemsPerPage } = state.transactions.pagination;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return {
    transactions: filtered.slice(start, end),
    totalItems: filtered.length,
    totalPages: Math.ceil(filtered.length / itemsPerPage)
  };
};

export default transactionsSlice.reducer;
