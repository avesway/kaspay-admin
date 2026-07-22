import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { ENV, ROUTES } from '@/constants';
import { authAPI } from '@/modules/auth/auth.api';
import { useProfileStore } from '@/modules/profile/profile.store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

import { Button } from './ui/button';
import { SidebarTrigger } from './ui/sidebar';

const AppHeader = () => {
  const navigate = useNavigate();
  const account = useProfileStore((state) => state.account);

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

  return (
    <header className="bg-card sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b px-6">
      <div className="flex w-full items-center justify-between gap-3">
        <SidebarTrigger />
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-auto cursor-pointer" asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={5} align="end" className="min-w-56">
            <DropdownMenuLabel>{account.fullName}</DropdownMenuLabel>
            <DropdownMenuLabel className="text-text-60 mt-[-7px] text-xs">{account.login}</DropdownMenuLabel>
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
