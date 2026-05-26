import { validateAuthToken } from '@/actions/auth.actions';
import { authAPI } from '@/api/auth.api';
import { writeTokenRequest } from '@/config/axios';
import { ROUTES } from '@/constants';
import { useAccountStore } from '@/store';
import React from 'react';
import { Outlet, Navigate, redirect } from 'react-router';

export function ProtectedRoute() {
  const account = useAccountStore((state) => state.account);

  if (!account) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}

export async function protectedLoader() {
  try {
    const authToken = await validateAuthToken();

    if (!Boolean(authToken)) return redirect(ROUTES.LOGIN);

    if (Boolean(authToken)) {
      const { setAccount } = useAccountStore.getState();

      await writeTokenRequest(authToken);
      const user = await authAPI.account();
      setAccount(user);
      return user;
    }
  } catch (err) {
    console.log('ERROR protectedLoader', err);
    return redirect(ROUTES.LOGIN);
  }
}
