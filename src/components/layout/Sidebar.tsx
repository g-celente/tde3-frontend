import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home,
  FileText,
  CheckSquare,
  AlertTriangle,
  BarChart3,
  Shield,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks';

// Links da sidebar
const sidebarLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
  { to: '/documents', label: 'Documentos', icon: <FileText size={20} /> },
  { to: '/checklists', label: 'Checklists', icon: <CheckSquare size={20} /> },
  { to: '/nonconformities', label: 'Não Conformidades', icon: <AlertTriangle size={20} /> },
  { to: '/reports', label: 'Relatórios', icon: <BarChart3 size={20} /> },
];

const secondaryLinks = [
  { to: '/profile', label: 'Perfil', icon: <User size={20} /> },
  { to: '/settings', label: 'Configurações', icon: <Settings size={20} /> },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) return null;

  return (
    <motion.div 
      className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } min-h-screen flex flex-col`}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200/50 dark:border-gray-700/50">
        <AnimatePresence>
          {!isCollapsed ? (
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AuditFlow
              </span>
            </motion.div>
          ) : (
            <motion.div
              className="mx-auto bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Shield className="h-5 w-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`${isCollapsed ? 'mx-auto' : 'ml-auto'} p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </motion.button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {sidebarLinks.map((link, index) => {
            const isActive = location.pathname.startsWith(link.to);
            return (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <NavLink
                  to={link.to}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <motion.div 
                    className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {link.icon}
                  </motion.div>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        className="ml-3"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {link.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && !isCollapsed && (
                    <motion.div
                      className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    />
                  )}
                </NavLink>
              </motion.div>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="px-3 py-4 border-t border-gray-200/50 dark:border-gray-700/50">
        {/* User Info */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-4 p-3 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Secondary Navigation */}
        <div className="space-y-1">
          {secondaryLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {link.icon}
                </motion.div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      className="ml-3"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            );
          })}

          {/* Logout Button */}
          <motion.button
            onClick={logout}
            className="group flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <LogOut size={20} />
            </motion.div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  className="ml-3"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Sair
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;