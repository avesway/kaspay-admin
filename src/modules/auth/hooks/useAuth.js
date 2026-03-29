import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { ENV, ROUTES } from '@/constants';
import { useState } from 'react';
import { authAPI } from '@/api/auth.api';

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const authHandler = async (data) => {
    setLoading(true);
    await authAPI
      .login(data)
      .then((res) => {
        localStorage.setItem(ENV.AUTH_TOKENS, JSON.stringify(res.token));
        navigate(ROUTES.HOME);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || 'Ошибка', {
          position: 'top-center',
        });
      })
      .finally(() => setLoading(false));
  };
  return { authHandler, loading };
};

export default useAuth;
