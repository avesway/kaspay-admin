import instanceAxios from '@/config/axios';

export const matricesAPI = {
  getListMatrices: async () => {
    const response = await instanceAxios.get(`devices/product-matrices`);
    return response?.data;
  },
  getTypesMatrices: async () => {
    const response = await instanceAxios.get(`devices/product-matrices/types`);
    return response?.data;
  },
  create: async (data) => {
    const response = await instanceAxios.post(`devices/product-matrices`, data);
    return response?.data;
  },
  update: async (matrixId, data) => {
    const response = await instanceAxios.put(`devices/product-matrices/${matrixId}`, data);
    return response?.data;
  },
  deactivation: async (matrixId) => {
    const response = await instanceAxios.post(`devices/product-matrices/${matrixId}/deactivation`);
    return response?.data;
  },
};
