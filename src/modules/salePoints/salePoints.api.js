import instanceAxios from '@/config/axios';

export const salePointsAPI = {
  getListSalePoints: async () => {
    const response = await instanceAxios.get(`sale-points`);
    return response?.data;
  },
  getListSaleDevices: async (params) => {
    const response = await instanceAxios.get(`devices${params}`);
    return response?.data;
  },
  getOperationsSalePoint: async (params) => {
    const response = await instanceAxios.get(`products/orders${params}`);
    return response?.data;
  },
};
