import api from './api';

// Tipos
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  status: string;
  data: {
    user: User;
    token?: string;
  };
  message: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Serviço de autenticação
const authService = {
  // Login
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    
    // Salvar token e usuário no localStorage
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  },

  // Registro
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  // Logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obter usuário atual do localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
};

export default authService;