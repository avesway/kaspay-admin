import React from 'react';
import { Navigate, Outlet, redirect } from 'react-router';

import { writeTokenRequest } from '@/config/axios';
import { ROUTES } from '@/constants';
import { authAPI } from '@/modules/auth/auth.api';
import { validateAuthToken } from '@/modules/auth/auth.processes';
import { useProfileStore } from '@/modules/profile/profile.store';

export function ProtectedRoute() {
  const account = useProfileStore((state) => state.account);

  if (!account) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}

export async function protectedLoader() {
  try {
    const authToken = await validateAuthToken();

    if (!authToken) return redirect(ROUTES.LOGIN);

    if (authToken) {
      const { setAccount } = useProfileStore.getState();

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
