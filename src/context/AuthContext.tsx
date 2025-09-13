import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services';

// Tipos
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Criação do contexto com valor padrão
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

// Props do provedor
interface AuthProviderProps {
  children: ReactNode;
}

// Provedor do contexto
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login({ email, password });
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao realizar login');
    } finally {
      setLoading(false);
    }
  };

  // Função de registro
  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.register({ name, email, password });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao realizar registro');
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Valor do contexto
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};