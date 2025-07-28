import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../components/AuthForm';
import { signup } from '../services/api';
import { useStore } from '../store/useStore';

export default function SignupPage() {
  const setUser = useStore(s => s.setUser);
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await signup(email, password);
      setUser(res.data.user, res.data.token);
      localStorage.setItem('token', res.data.token);
      router.push('/');
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'response' in err) {
        setError((err as any).response?.data?.message || 'Signup failed');
      } else {
        setError('Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm mode="signup" onSubmit={handleSignup} error={error} loading={loading} />;
} 