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
  updateProduct: async (id, data) => {
    const response = await instanceAxios.put(`products/${id}`, data);
    return response?.data;
  },
  deleteProduct: async (id) => {
    const response = await instanceAxios.delete(`products/${id}`);
    return response?.data;
  },
  getUnitTypes: async () => {
    const response = await instanceAxios.get(`products/unit-types`);
    return response?.data;
  },
};
