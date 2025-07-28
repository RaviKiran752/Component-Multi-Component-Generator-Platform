import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../components/AuthForm';
import { login } from '../services/api';
import { useStore } from '../store/useStore';

export default function LoginPage() {
  const setUser = useStore(s => s.setUser);
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await login(email, password);
      setUser(res.data.user, res.data.token);
      localStorage.setItem('token', res.data.token);
      router.push('/');
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'response' in err) {
        setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed');
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm mode="login" onSubmit={handleLogin} error={error} loading={loading} />;
} 