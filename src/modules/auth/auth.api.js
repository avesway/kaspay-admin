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
    const response = await instanceAxios.post('auth/logout');
    return response?.data;
  },

  refresh: async (data) => {
    const response = await instanceAxios.post('auth/refresh', data);
    return response.data;
  },
};
