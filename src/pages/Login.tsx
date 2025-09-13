import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import * as yup from 'yup';
import { Alert, Button, Card, Input } from '../components/ui';
import { useAuth } from '../hooks';

// Esquema de validação
const schema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().required('Senha é obrigatória'),
}).required();

type FormData = yup.InferType<typeof schema>;

const Login = () => {
  const { login, error } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Estado para mensagem de redirecionamento
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null);

  // Configuração do formulário
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // Verificar se o usuário foi redirecionado de uma página protegida
  const from = location.state?.from?.pathname || '/dashboard';

  // Efeito para mostrar mensagem quando redirecionado
  useState(() => {
    if (location.state?.from) {
      setRedirectMessage('Por favor, faça login para continuar.');
    }
  });

  // Função para lidar com o envio do formulário
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      // Erro já tratado no contexto de autenticação
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 w-full overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-75"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-150"></div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div 
          className="sm:mx-auto sm:w-full sm:max-w-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="flex justify-center mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-xl">
              <Shield className="h-10 w-10 text-white" />
            </div>
          </motion.div>
          
          <h2 className="text-center text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bem-vindo de volta
          </h2>
          <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
            Entre na sua conta para continuar{' '}
            <Link 
              to="/register" 
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
            >
              ou crie uma nova conta
            </Link>
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div 
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card variant="glass" className="px-6 py-8 sm:px-10">
            <AnimatePresence>
              {redirectMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert type="info" onClose={() => setRedirectMessage(null)}>
                    {redirectMessage}
                  </Alert>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert type="error">
                    {error}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Input
                  label="Email"
                  type="email"
                  id="email"
                  placeholder="Digite seu email"
                  leftIcon={<Mail size={18} />}
                  autoComplete="email"
                  fullWidth
                  {...register('email')}
                  error={errors.email?.message}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Input
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Digite sua senha"
                  leftIcon={<Lock size={18} />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                  autoComplete="current-password"
                  fullWidth
                  {...register('password')}
                  error={errors.password?.message}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      Lembrar de mim
                    </span>
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  fullWidth 
                  isLoading={isSubmitting}
                  rightIcon={<ArrowRight size={18} />}
                  variant="gradient"
                >
                  {isSubmitting ? 'Entrando...' : 'Entrar'}
                </Button>
              </motion.div>
            </form>

            {/* Social Login */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Ou continue com
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" fullWidth>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" size="sm" fullWidth>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                  Twitter
                </Button>
              </div>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;