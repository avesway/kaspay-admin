import React from 'react';
import { LogOut, User } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { useAccountStore } from '@/store';
import { authAPI } from '@/api/auth.api';
import { toast } from 'sonner';
import { ENV, ROUTES } from '@/constants';
import { SidebarTrigger } from './ui/sidebar';

const AppHeader = () => {
  const navigate = useNavigate();
  const account = useAccountStore((state) => state.account);

  const logout = async () => {
    await authAPI
      .logout()
      .then((res) => {
        localStorage.removeItem(ENV.AUTH_TOKENS);
        navigate(ROUTES.LOGIN, { replace: true });
      })
      .catch((err) => {
        console.log('err', err);
        toast.error('Ошибка', {
          position: 'top-center',
        });
      });
  };

  console.log('account', account);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-card px-6">
      <div className="flex w-full justify-between items-center gap-3">
        <SidebarTrigger />
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer ml-auto" asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={5} align="end" className="min-w-56">
            <DropdownMenuLabel>{account.fullName}</DropdownMenuLabel>
            <DropdownMenuLabel className="text-text-60 text-xs mt-[-7px]">{account.login}</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={logout}>
              <LogOut color={'var(--color-destructive)'} />
              <span className="text-destructive">Выход</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppHeader;
