import { authAPI } from '@/api/auth.api';
import { isAfter } from 'date-fns';
import { writeTokenRequest } from '@/config/axios';
import { ENV } from '@/constants';

let refreshTokenPromise = null;

export async function validateAuthToken() {
  const authTokens = localStorage.getItem(ENV.AUTH_TOKENS);
  if (!authTokens) return null;

  const { accessToken, accessTokenExpiredAt, refreshToken: storedRefreshToken } = JSON.parse(authTokens) ?? {};
  if (!accessToken || !storedRefreshToken) return null;

  if (isAfter(new Date(), new Date(accessTokenExpiredAt))) {
    const result = await refreshToken(storedRefreshToken);
    return result;
  }

  return accessToken;
}

export async function refreshToken(token) {
  if (refreshTokenPromise) return refreshTokenPromise;

  refreshTokenPromise = (async () => {
    try {
      const result = await authAPI.refresh({ refreshToken: token });

      localStorage.setItem(ENV.AUTH_TOKENS, JSON.stringify(result));
      await writeTokenRequest(result.accessToken);
      return result.accessToken;
    } catch {
      return null;
    } finally {
      refreshTokenPromise = null;
    }
  })();

  return await refreshTokenPromise;
}
