import { useState } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '../api/axiosInstance';

interface LoginProps {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post<LoginResponse>('auth/login', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token);
      router.push('/admin');
    } catch (error: any) {
      alert('Erro no login: ' + error.response.data.message);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-300'>
      <h2 className='text-2xl font-bold mb-4'>Login Administrador</h2>
      <form onSubmit={handleLogin} className='bg-white p-6 rounded shadow-md'>
        <div className='mb-4'>
          <label className='block mb-1 text-gray-400'>Usuário:</label>
          <input
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className='border p-2 w-full'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1 text-gray-400'>Senha:</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='border p-2 w-full'
          />
        </div>
        <button
          type='submit'
          className='bg-blue-500 text-white py-2 px-4 rounded'
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
