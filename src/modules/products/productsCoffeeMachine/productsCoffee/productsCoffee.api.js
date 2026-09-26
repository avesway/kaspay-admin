import instanceAxios from '@/config/axios';

export const productsCoffeeAPI = {
  getListCompositions: async (params = '') => {
    const response = await instanceAxios.get(`products/compositions${params ? `?${params}` : ''}`);
    return response?.data;
  },
  createComposition: async (data) => {
    const response = await instanceAxios.post(`products/compositions`, data);
    return response?.data;
  },
  updateComposition: async (id, data) => {
    const response = await instanceAxios.put(`products/compositions/${id}`, data);
    return response?.data;
  },
  deleteComposition: async (id) => {
    const response = await instanceAxios.delete(`products/compositions/${id}`);
    return response?.data;
  },
};
