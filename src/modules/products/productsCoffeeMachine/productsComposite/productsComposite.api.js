import instanceAxios from '@/config/axios';

export const productsCompositeAPI = {
  getListProducts: async (params) => {
    const response = await instanceAxios.get(`products?${params}`);
    return response?.data;
  },
  createProduct: async (data) => {
    const response = await instanceAxios.post(`products`, data);
    return response?.data;
  },
};
