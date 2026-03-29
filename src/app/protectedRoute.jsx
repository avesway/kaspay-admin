import { checkAuth } from '@/actions/auth.actions';
import { ROUTES } from '@/constants';
import { useAccountStore } from '@/store';
import React from 'react';
import { Outlet, Navigate } from 'react-router';

export function ProtectedRoute() {
  const account = useAccountStore((state) => state.account);

  if (!account) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}

export async function protectedLoader() {
  try {
    const isAuth = await checkAuth();

    return isAuth;
  } catch (err) {
    console.log('ERROR protectedLoader', err);
    return false;
  }
}
