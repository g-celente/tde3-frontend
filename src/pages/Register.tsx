import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Alert, Button, Card, Input } from '../components/ui';
import { useAuth } from '../hooks';

// Esquema de validação
const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'As senhas devem coincidir')
    .required('Confirmação de senha é obrigatória'),
}).required();

type FormData = yup.InferType<typeof schema>;

const Register = () => {
  const { register: registerUser, error } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Configuração do formulário
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // Função para lidar com o envio do formulário
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await registerUser(data.name, data.email, data.password);
      setSuccess(true);
      // Redirecionar para a página de login após 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // Erro já tratado no contexto de autenticação
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crie sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            entre com sua conta existente
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="px-4 py-8 sm:px-10">
          {success && (
            <Alert type="success" className="mb-4">
              Registro realizado com sucesso! Redirecionando para o login...
            </Alert>
          )}

          {error && (
            <Alert type="error" className="mb-4">
              {error}
            </Alert>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label="Nome"
                type="text"
                id="name"
                autoComplete="name"
                fullWidth
                {...register('name')}
                error={errors.name?.message}
              />
            </div>

            <div>
              <Input
                label="Email"
                type="email"
                id="email"
                autoComplete="email"
                fullWidth
                {...register('email')}
                error={errors.email?.message}
              />
            </div>

            <div>
              <Input
                label="Senha"
                type="password"
                id="password"
                autoComplete="new-password"
                fullWidth
                {...register('password')}
                error={errors.password?.message}
              />
            </div>

            <div>
              <Input
                label="Confirmar Senha"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                fullWidth
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />
            </div>

            <div>
              <Button type="submit" fullWidth isLoading={isSubmitting}>
                Registrar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;