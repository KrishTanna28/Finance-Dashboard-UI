import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './useFinanceStore';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    ui: uiReducer
  }
});

export default store;
