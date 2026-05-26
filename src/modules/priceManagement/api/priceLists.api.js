import instanceAxios from '@/config/axios';

export const priceListsAPI = {
  getList: async (params) => {
    const response = await instanceAxios.get(`${params ? `?${params}` : ''}`);
    return response?.data;
  },
  create: async (data) => {
    const response = await instanceAxios.post(``, data);
    return response?.data;
  },
  update: async (id, data) => {
    const response = await instanceAxios.put(`${id ? `/${id}` : ''}`, data);
    return response?.data;
  },
  delete: async (id) => {
    const response = await instanceAxios.delete(`${id ? `/${id}` : ''}`);
    return response?.data;
  },
};
