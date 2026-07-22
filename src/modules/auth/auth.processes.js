import { writeTokenRequest } from '@/config/axios';
import { ENV } from '@/constants';
import { authAPI } from '@/modules/auth/auth.api';

let refreshTokenPromise = null;
const TOKEN_REFRESH_BUFFER = 60 * 1000;

export async function validateAuthToken() {
  const authTokens = localStorage.getItem(ENV.AUTH_TOKENS);
  if (!authTokens) return null;

  const { accessToken, accessTokenExpiredAt, refreshToken: storedRefreshToken } = JSON.parse(authTokens) ?? {};
  if (!accessToken || !storedRefreshToken) return null;

  const shouldRefresh = Date.now() > new Date(accessTokenExpiredAt).getTime() - TOKEN_REFRESH_BUFFER;

  if (shouldRefresh) {
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
