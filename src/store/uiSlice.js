import { createSlice } from '@reduxjs/toolkit';

// Load from localStorage
const loadRole = () => {
  try {
    return localStorage.getItem('finance-role') || 'admin';
  } catch {
    return 'admin';
  }
};

const loadDarkMode = () => {
  try {
    return localStorage.getItem('finance-darkMode') === 'true';
  } catch {
    return false;
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    role: loadRole(), // 'admin' or 'viewer'
    darkMode: loadDarkMode(),
    sidebarOpen: false,
    isLoading: false
  },
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
      localStorage.setItem('finance-role', action.payload);
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('finance-darkMode', state.darkMode.toString());
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem('finance-darkMode', action.payload.toString());
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  }
});

export const {
  setRole,
  toggleDarkMode,
  setDarkMode,
  setSidebarOpen,
  setLoading
} = uiSlice.actions;

// Selectors
export const selectRole = state => state.ui.role;
export const selectDarkMode = state => state.ui.darkMode;
export const selectSidebarOpen = state => state.ui.sidebarOpen;
export const selectIsLoading = state => state.ui.isLoading;
export const selectIsAdmin = state => state.ui.role === 'admin';

export default uiSlice.reducer;
