import { refreshToken } from '@/actions/auth.actions';
import instanceAxios from '@/config/axios';

export const priceManagementAPI = {
  calculations: async (data) => {
    try {
      await refreshToken();
      const response = await instanceAxios.post(`calculations/product-price`, data);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
};
