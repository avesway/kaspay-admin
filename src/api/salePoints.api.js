
import instanceAxios from '@/config/axios';

export const salePointsAPI = {
  getListSalePoints: async () => {
    try {
      const response = await instanceAxios.get(`sale-points`);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  getListSaleDevices: async (params) => {
    try {
      const response = await instanceAxios.get(`devices${params}`);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  getOperationsSalePoint: async (params) => {
    try {
      const response = await instanceAxios.get(`products/orders${params}`);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
};
