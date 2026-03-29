import { refreshToken } from '@/actions/auth.actions';
import instanceAxios from '@/config/axios';

export const authAPI = {
  login: async (data) => {
    try {
      const response = await instanceAxios.post('auth/login', data);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  account: async () => {
    try {
      await refreshToken();
      const response = await instanceAxios.get('account');

      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await refreshToken();
      const response = await instanceAxios.post('auth/logout');

      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  refresh: async (data) => {
    try {
      const response = await instanceAxios.post('auth/refresh', data);

      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
