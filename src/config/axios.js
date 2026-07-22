import axios from 'axios';

import { ENV, ROUTES } from '@/constants';
import { validateAuthToken } from '@/modules/auth/auth.processes';

const instanceAxios = axios.create({ baseURL: `${ENV.SERVER_URL}${ENV.VERSION_API}` });

export const writeTokenRequest = async (token) => {
  if (token) instanceAxios.defaults.headers.common['X-BID-Token'] = token;

  return true;
};

instanceAxios.interceptors.request.use(
  async (originalRequest) => {
    if (originalRequest.url?.includes('auth/refresh') || originalRequest.url?.includes('auth/login')) {
      return originalRequest;
    }

    const authToken = await validateAuthToken();

    if (!authToken) {
      localStorage.removeItem(ENV.AUTH_TOKENS);

      window.location.replace(window.location.origin + window.location.pathname + '#' + ROUTES.LOGIN);

      return Promise.reject(new Error('No auth tokens'));
    }

    originalRequest.headers['X-BID-Token'] = authToken;

    return originalRequest;
  },
  (error) => Promise.reject(error),
);

export default instanceAxios;
