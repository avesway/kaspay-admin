import { Button } from '@/shared/ui/button';
import { LogOut } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from '@/constants';
import { toast } from 'sonner';
import { authAPI } from '@/api/auth.api';
import { useSessionStore } from '@/store';
import { useBankStore } from '@/store/bank.store';

const Logout = () => {
  const logout = useSessionStore((state) => state.logout);
  const setAuth = useBankStore((state) => state.setAuth);
  const navigate = useNavigate();

  const getLogout = async () => {
    await authAPI
      .logout()
      .then((res) => {
        logout();
        setAuth(null);
        navigate(ROUTES.LOGIN);
      })
      .catch((err) => {
        console.log('err', err);
        toast.error('Что-то пошло не так... Попробуйте позже', { position: 'top-center' });
      });
  };

  return (
    <Button onClick={getLogout}>
      <LogOut /> Выход
    </Button>
  );
};

export default Logout;
