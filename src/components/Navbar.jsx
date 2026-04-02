import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, 
  FiMoon, 
  FiSun, 
  FiUser, 
  FiChevronDown,
  FiBell,
  FiSearch
} from 'react-icons/fi';
import useFinanceStore from '../store/useFinanceStore';
import { useClickOutside } from '../hooks/useHooks';

const Navbar = ({ onMenuClick }) => {
  const { role, setRole, darkMode, toggleDarkMode } = useFinanceStore();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setRoleDropdownOpen(false));

  const roles = [
    { value: 'admin', label: 'Admin', description: 'Full access' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-dark-100 border-b border-gray-200 dark:border-dark-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-200 focus-ring"
              aria-label="Toggle sidebar"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="hidden sm:block text-xl font-bold text-gray-900 dark:text-white">
                FinanceHub
              </span>
            </div>
          </div>

          {/* Search - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-dark-200 
                         border border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-dark-100
                         text-gray-900 dark:text-gray-100 placeholder-gray-500
                         transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications */}
            <button
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-200 
                       focus-ring relative"
              aria-label="Notifications"
            >
              <FiBell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full"></span>
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-200 focus-ring"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <AnimatePresence mode="wait">
                {darkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiSun className="w-5 h-5 text-yellow-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiMoon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Role Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-200 
                         hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors focus-ring"
                aria-haspopup="listbox"
                aria-expanded={roleDropdownOpen}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 
                              flex items-center justify-center">
                  <FiUser className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {role}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {role === 'admin' ? 'Full access' : 'View only'}
                  </p>
                </div>
                <FiChevronDown 
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    roleDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              <AnimatePresence>
                {roleDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-200 rounded-lg shadow-lg 
                             border border-gray-200 dark:border-dark-300 py-1 z-50"
                    role="listbox"
                  >
                    {roles.map((r) => (
                      <button
                        key={r.value}
                        onClick={() => {
                          setRole(r.value);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark-300 
                                  transition-colors flex items-center justify-between ${
                          role === r.value ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                        }`}
                        role="option"
                        aria-selected={role === r.value}
                      >
                        <div>
                          <p className={`text-sm font-medium ${
                            role === r.value 
                              ? 'text-primary-600 dark:text-primary-400' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {r.label}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {r.description}
                          </p>
                        </div>
                        {role === r.value && (
                          <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
