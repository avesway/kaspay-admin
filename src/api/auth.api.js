import instanceAxios from '@/config/axios';

export const authAPI = {
  login: async (data) => {
    const response = await instanceAxios.post('auth/login', data);
    return response?.data;
  },

  account: async () => {
    try {
      const response = await instanceAxios.get('account');

      return response?.data;
    } catch (error) {
      return null;
    }
  },

  logout: async () => {
    try {
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
