# Finance Dashboard UI

A modern, responsive Finance Dashboard built with React, Vite, Redux Toolkit, and Tailwind CSS. Track your income, expenses, and financial insights with an intuitive multi-page user interface.

## ✨ Features

### 📊 Dashboard Overview
- **Summary Cards**: View Total Balance, Total Income, and Total Expenses at a glance
- **Credit Card Visual**: Beautiful card design showing current balance
- **Interactive Charts**: 
  - Area Chart showing balance trends over time
  - Pie Chart displaying spending breakdown by category

### 💰 Transactions Management
- Dedicated transactions page with full CRUD operations
- **Advanced Filtering**: Filter by category, type, and date range
- **Debounced Search**: Search transactions with optimized performance
- **Sorting**: Sort by date, amount, or category
- **Pagination**: Handle large datasets efficiently

### 👥 Role-Based Access
- **Admin Role**: Full access to add, edit, and delete transactions
- **Viewer Role**: Read-only access to view data
- Role switcher in the header
- UI changes based on role (buttons hidden/shown, different messages)

### 📈 Financial Insights
- Dedicated insights page with detailed analytics
- Highest spending category identification
- Monthly income vs expenses comparison (bar chart)
- Savings rate calculation
- Category-wise expense breakdown with progress bars
- Financial health summary

### 🎯 Additional Features
- 🌙 **Dark Mode**: Proper dark theme (black/gray, not purple)
- 📱 **Fully Responsive**: Mobile-first design that works on all devices
- 🗂️ **Multi-Page Routing**: Dashboard, Transactions, and Insights as separate pages
- 💾 **Data Persistence**: Transactions and preferences saved to localStorage
- ⚡ **Performance Optimized**: Memoized calculations, efficient re-renders
- ♿ **Accessible**: Semantic HTML, keyboard navigation, ARIA labels

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool & Dev Server |
| Redux Toolkit | State Management |
| React Redux | Redux bindings for React |
| React Router DOM | Client-side routing |
| Tailwind CSS | Styling |
| Recharts | Charts & Visualizations |
| Framer Motion | Animations |
| React Icons | Icon Library |

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Top navigation with role switcher
│   ├── Sidebar.jsx         # Side navigation with routing
│   ├── ChartSection.jsx    # Area and Pie charts
│   ├── TransactionTable.jsx # Transactions list with CRUD
│   ├── TransactionForm.jsx # Add/Edit transaction modal
│   └── FiltersBar.jsx      # Category/Type/Date filters
├── pages/
│   ├── Dashboard.jsx       # Main dashboard page
│   ├── Transactions.jsx    # Transactions management page
│   └── Insights.jsx        # Financial insights page
├── store/
│   ├── index.js            # Redux store configuration
│   ├── useFinanceStore.js  # Transactions slice
│   └── uiSlice.js          # UI state (role, dark mode)
├── utils/
│   └── calculations.js     # Financial calculation utilities
├── hooks/
│   └── useHooks.js         # Custom React hooks
├── App.jsx                 # Main app with routing
├── main.jsx                # Entry point with providers
└── index.css               # Global styles & Tailwind
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Finance Dashboard UI"
   ```

2. **Create the pages directory and files**
   ```bash
   node setup-dirs.cjs
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview  # Preview the production build
```

## 🎨 Design Decisions

### State Management with Redux Toolkit
- Used Redux Toolkit for scalable state management
- Two slices: `transactions` (CRUD, filters, pagination) and `ui` (role, dark mode)
- Persistence to localStorage for data retention

### Multi-Page Architecture
- React Router for client-side navigation
- Three main pages: Dashboard, Transactions, Insights
- Interactive sidebar with navigation links

### Role-Based UI
- Admin: Full CRUD access, all features visible
- Viewer: Read-only, action buttons hidden, informational messages shown
- Role persisted to localStorage

### Dark Mode
- Proper dark theme using gray/black colors (not purple)
- Toggle in sidebar
- Persisted preference

### Component Architecture
- Each component is focused on a single responsibility
- Reusable card styles via CSS classes
- Memoized computed values for performance

### Styling Approach
- Tailwind CSS for rapid development and consistency
- Custom color palette defined in `tailwind.config.js`
- Dark mode support via CSS class strategy
- Responsive design with mobile-first approach

## 📊 Derived Calculations

The `calculations.js` utility provides:

```javascript
// Calculate totals
calculateTotals(transactions)
// Returns: { totalIncome, totalExpenses, balance }

// Category spending breakdown
calculateCategorySpending(transactions)
// Returns: [{ category, amount, percentage }, ...]

// Monthly aggregated data for charts
calculateMonthlyData(transactions)
// Returns: [{ month, income, expenses, balance }, ...]

// Financial insights
calculateInsights(transactions)
// Returns: { highestSpendingCategory, monthlyComparison, savingsRate, ... }
```

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using React + Vite + Redux Toolkit + Tailwind CSS
