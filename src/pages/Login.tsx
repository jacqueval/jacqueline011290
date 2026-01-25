import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { login } from '../utils/auth';

const loginSchema = z.object({
  username: z.string().min(1, 'Username obrigatório'),
  password: z.string().min(1, 'Senha obrigatória'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await login(data);
      localStorage.setItem('token', res.token);
      localStorage.setItem('refreshToken', res.refreshToken);
      navigate('/protected');
    } catch {
      setError('Credenciais inválidas');
    }
  };

  return (
    <section className="screen">
      <header className="header">
        🐾 Bem-vindo! 🐾
      </header>

      <div className="content login-box">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="text" placeholder="Username" {...register('username')} />
          {errors.username && <p style={{ color: 'red', fontSize: '12px' }}>{errors.username.message}</p>}
          <input type="password" placeholder="Senha" {...register('password')} />
          {errors.password && <p style={{ color: 'red', fontSize: '12px' }}>{errors.password.message}</p>}

          <button type="submit" className="btn-primary">Entrar</button>
        </form>

        <div className="login-links">
          <a href="#">Esqueceu a senha?</a>
          <a href="#">Cadastre-se</a>
        </div>
      </div>
    </section>
  );
};

export default Login;