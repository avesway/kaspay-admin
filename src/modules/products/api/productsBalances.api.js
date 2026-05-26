import instanceAxios from '@/config/axios';

export const productsBalancesAPI = {
  getList: async (params) => {
    const response = await instanceAxios.get(`products/balances?${params}`);
    return response?.data;
  },
  savePrice: async (id, data) => {
    const response = await instanceAxios.patch(`products/balances/${id}`, data);
    return response?.data;
  },
  moving: async (id, data) => {
    const response = await instanceAxios.post(`products/balances/${id}/movemenets`, data);
    return response?.data;
  },
};
