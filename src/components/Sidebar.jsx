import { NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiGrid,
  FiList,
  FiTrendingUp,
  FiMoon,
  FiSun,
  FiX
} from 'react-icons/fi';
import { selectDarkMode, toggleDarkMode } from '../store/uiSlice';

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector(selectDarkMode);
  const location = useLocation();

  const menuItems = [
    { icon: FiGrid, label: 'Dashboard', path: '/' },
    { icon: FiList, label: 'Transactions', path: '/transactions' },
    { icon: FiTrendingUp, label: 'Insights', path: '/insights' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Logo */}
      <div className="flex items-center justify-center h-[90px] border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          {/* Hexagon Logo */}
          <div className="w-[54px] h-[54px] bg-primary rounded-lg flex items-center justify-center relative">
            <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0L24 7V21L12 28L0 21V7L12 0Z" fill="white" fillOpacity="0.3"/>
              <path d="M12 4L20 9V19L12 24L4 19V9L12 4Z" fill="white"/>
            </svg>
          </div>
          {/* Orange dot */}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent-orange rounded-full"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={`nav-item w-full ${isActive(item.path) ? 'nav-item-active' : ''}`}
                aria-label={item.label}
              >
                <item.icon 
                  className={`w-6 h-6 ${
                    isActive(item.path) 
                      ? 'text-primary dark:text-primary-light' 
                      : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary-light'
                  }`} 
                />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom - Theme Toggle */}
      <div className="pb-8 space-y-2">
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="nav-item w-full"
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <FiSun className="w-6 h-6 text-yellow-500" />
          ) : (
            <FiMoon className="w-6 h-6 text-gray-400 hover:text-primary" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-[102px] z-50">
        <SidebarContent />
        {/* Right border line */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800"></div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[240px] z-50"
            >
              <div className="flex flex-col h-full bg-white dark:bg-gray-900">
                {/* Mobile header */}
                <div className="flex items-center justify-between h-[90px] px-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">F</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">Finance</span>
                  </div>
                  <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile navigation */}
                <nav className="flex-1 py-6 px-4">
                  <ul className="space-y-1">
                    {menuItems.map((item) => (
                      <li key={item.path}>
                        <NavLink
                          to={item.path}
                          onClick={onClose}
                          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors ${
                            isActive(item.path) 
                              ? 'bg-primary/10 text-primary font-medium' 
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Mobile footer actions */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => dispatch(toggleDarkMode())}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {darkMode ? (
                      <>
                        <FiSun className="w-5 h-5 text-yellow-500" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <FiMoon className="w-5 h-5" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
