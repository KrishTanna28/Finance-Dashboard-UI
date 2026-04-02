import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBell, 
  FiMessageSquare,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiMenu,
  FiShield,
  FiEye
} from 'react-icons/fi';
import { selectRole, selectIsAdmin, setRole } from '../store/uiSlice';
import { useClickOutside } from '../hooks/useHooks';

const Header = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const role = useSelector(selectRole);
  const isAdmin = useSelector(selectIsAdmin);
  const location = useLocation();
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [activeQuickPanel, setActiveQuickPanel] = useState(null);
  const [actionMessage, setActionMessage] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'Budget alert', body: 'Groceries crossed 80% of this month budget.', time: '5m ago', read: false },
    { id: 'n2', title: 'Weekly report', body: 'Your weekly summary is ready to review.', time: '1h ago', read: false },
    { id: 'n3', title: 'Income posted', body: 'Salary transaction was recorded successfully.', time: 'Today', read: true }
  ]);
  const [messages] = useState([
    { id: 'm1', from: 'Alex (Advisor)', text: 'Your investment split looks healthy.', time: '2m ago' },
    { id: 'm2', from: 'Priya (Support)', text: 'Would you like help exporting this month data?', time: '20m ago' },
    { id: 'm3', from: 'System Bot', text: 'Tip: track subscriptions in Entertainment.', time: 'Yesterday' }
  ]);
  const dropdownRef = useRef(null);
  const quickPanelRef = useRef(null);

  useClickOutside(dropdownRef, () => setAccountDropdownOpen(false));
  useClickOutside(quickPanelRef, () => setActiveQuickPanel(null));

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  useEffect(() => {
    if (!actionMessage) {
      return undefined;
    }

    const timer = setTimeout(() => setActionMessage(''), 2400);
    return () => clearTimeout(timer);
  }, [actionMessage]);

  const roles = [
    { value: 'admin', label: 'Admin Account', description: 'Full access to all features', icon: FiShield },
    { value: 'viewer', label: 'Viewer Account', description: 'Read-only access', icon: FiEye }
  ];

  const currentRole = roles.find(r => r.value === role);

  const triggerMockAction = (message) => {
    setActionMessage(message);
    setActiveQuickPanel(null);
  };

  const openPanel = (panelName) => {
    setAccountDropdownOpen(false);
    setActiveQuickPanel((current) => (current === panelName ? null : panelName));
  };

  const markAllNotificationsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
    setActionMessage('All notifications marked as read.');
  };

  const markSingleNotificationRead = (id) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  // Get page title based on route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/transactions': return 'Transactions';
      case '/insights': return 'Insights';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-[90px] px-6 lg:px-8">
        {/* Left - Menu button (mobile) + User welcome */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            <FiMenu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4">
            {/* User Avatar */}
            <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-accent to-accent-light overflow-hidden">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=finance" 
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Welcome Text */}
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isAdmin ? 'Welcome back, Admin!' : 'Viewing as Guest'}
              </p>
            </div>
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          {/* Role Badge */}
          <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
            isAdmin 
              ? 'bg-success/10 text-success' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}>
            {isAdmin ? <FiShield className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
            <span>{isAdmin ? 'Admin' : 'Viewer'}</span>
          </div>

          {/* Account Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-haspopup="listbox"
              aria-expanded={accountDropdownOpen}
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {currentRole?.label || 'Choose Account'}
              </span>
              <div className="flex flex-col gap-0.5">
                <FiChevronUp className="w-3 h-3 text-gray-500" />
                <FiChevronDown className="w-3 h-3 text-gray-500" />
              </div>
            </button>

            <AnimatePresence>
              {accountDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                  role="listbox"
                >
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Switch Role
                    </p>
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => {
                        dispatch(setRole(r.value));
                        setAccountDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                        role === r.value ? 'bg-primary/5 dark:bg-primary/10' : ''
                      }`}
                      role="option"
                      aria-selected={role === r.value}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        r.value === 'admin' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                      }`}>
                        <r.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          role === r.value 
                            ? 'text-primary' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {r.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{r.description}</p>
                      </div>
                      {role === r.value && (
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Message Button */}
          <div className="relative" ref={quickPanelRef}>
            <div className="flex items-center gap-3">
              <button
                onClick={() => openPanel('messages')}
                className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white hover:bg-accent-dark transition-colors"
                aria-label="Messages"
                aria-expanded={activeQuickPanel === 'messages'}
              >
                <FiMessageSquare className="w-5 h-5" />
              </button>

              {/* Notification Button */}
              <button
                onClick={() => openPanel('notifications')}
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
                aria-label="Notifications"
                aria-expanded={activeQuickPanel === 'notifications'}
              >
                <FiBell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-semibold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User Icon */}
              <button
                onClick={() => openPanel('profile')}
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="User settings"
                aria-expanded={activeQuickPanel === 'profile'}
              >
                <FiUser className="w-5 h-5" />
              </button>
            </div>

            <AnimatePresence>
              {activeQuickPanel && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-[320px] max-w-[88vw] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                >
                  {activeQuickPanel === 'messages' && (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Messages</p>
                        <button
                          onClick={() => triggerMockAction('Opening message composer (mock).')}
                          className="text-xs text-primary hover:underline"
                        >
                          New message
                        </button>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {messages.map((message) => (
                          <button
                            key={message.id}
                            onClick={() => triggerMockAction(`Opened chat with ${message.from}.`)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                          >
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{message.from}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{message.text}</p>
                            <p className="text-[11px] text-gray-400 mt-1">{message.time}</p>
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {activeQuickPanel === 'notifications' && (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</p>
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-xs text-primary hover:underline"
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              markSingleNotificationRead(item.id);
                              setActionMessage(`Viewed: ${item.title}`);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                              item.read ? '' : 'bg-primary/5 dark:bg-primary/10'
                            }`}
                          >
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.body}</p>
                            <p className="text-[11px] text-gray-400 mt-1">{item.time}</p>
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {activeQuickPanel === 'profile' && (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Profile</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {isAdmin ? 'Admin access enabled' : 'Viewer access enabled'}
                        </p>
                      </div>
                      <div className="p-4 space-y-2">
                        <button
                          onClick={() => triggerMockAction('Profile details opened (mock).')}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200"
                        >
                          View profile details
                        </button>
                        <button
                          onClick={() => triggerMockAction('Preferences panel opened (mock).')}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200"
                        >
                          Open preferences
                        </button>
                        <button
                          onClick={() => triggerMockAction('Signed out successfully (mock).')}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-danger/10 text-sm text-danger"
                        >
                          Sign out
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {actionMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="px-6 lg:px-8 pb-3"
          >
            <div className="rounded-xl bg-primary/10 text-primary text-sm px-4 py-2">
              {actionMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
