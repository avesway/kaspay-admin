import { authAPI } from '@/api/auth.api';
import { writeTokenRequest } from '@/config/axios';
import { ENV, ROUTES } from '@/constants';
import { useAccountStore } from '@/store';
import { redirect } from 'react-router';

let refreshTokenPromise = null;

export async function checkAuth() {
  try {
    const authTokens = localStorage.getItem(ENV.AUTH_TOKENS);
    if (!authTokens) return false;

    const accessToken = JSON.parse(authTokens)?.accessToken;
    const refreshToken = JSON.parse(authTokens)?.refreshToken;

    if (!accessToken || !refreshToken) return false;
    writeTokenRequest(accessToken);

    const { setAccount } = useAccountStore.getState();
    const user = await authAPI.account();
    setAccount(user);

    return user;
  } catch (error) {
    console.log('Error checkAuth: ', error);
    return false;
  }
}

export async function refreshToken() {
  try {
    const authTokens = localStorage.getItem(ENV.AUTH_TOKENS);
    if (!authTokens) return false;

    const accessTokenExpiredAt = JSON.parse(authTokens)?.accessTokenExpiredAt;
    const refreshToken = JSON.parse(authTokens)?.refreshToken;

    if (!accessTokenExpiredAt || !refreshToken) return false;

    const expiryTime = new Date(accessTokenExpiredAt).getTime();
    const currentTime = new Date().getTime();
    const thresholdMs = 30 * 1000;

    if (expiryTime - currentTime <= thresholdMs) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = await authAPI
          .refresh({ refreshToken })
          .then((res) => {
            localStorage.setItem(ENV.AUTH_TOKENS, JSON.stringify(res));
            writeTokenRequest(res.accessToken);
            return res;
          })
          .catch((err) => {
            console.log('err refresh', err);
            localStorage.removeItem(ENV.AUTH_TOKENS);
            redirect(ROUTES.LOGIN);
            return null;
          });
      }

      const newToken = await refreshTokenPromise;
      refreshTokenPromise = null;
      return newToken;
    }

    return true;
  } catch (error) {
    console.log('Error refreshToken: ', error);
    return false;
  }
}
