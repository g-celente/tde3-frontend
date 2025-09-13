import { useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';
import { useAuth } from '../../hooks';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children?: ReactNode;
  requireAuth?: boolean;
}

const Layout = ({ children, requireAuth = false }: LayoutProps) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Verificar autenticação
  useEffect(() => {
    if (!loading && requireAuth && !isAuthenticated) {
      // Redirecionar para login se não estiver autenticado
      navigate('/login', { state: { from: location } });
    }
  }, [loading, requireAuth, isAuthenticated, navigate, location]);

  // Verificar se é uma página de autenticação
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="text-lg font-medium text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Carregando...
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Layout para páginas de autenticação
  if (isAuthPage) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Navbar />
        <motion.main 
          className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children || <Outlet />}
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
    );
  }

  // Layout para páginas protegidas
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="flex w-full h-screen overflow-hidden">
        {isAuthenticated && <Sidebar />}
        <div className="flex-1 w-full overflow-auto">
          <Navbar />
          <motion.main 
            className="w-full py-6 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {children || <Outlet />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default Layout;