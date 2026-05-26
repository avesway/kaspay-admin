import instanceAxios from '@/config/axios';

export const productsCatalogAPI = {
  getListProducts: async (params) => {
    const response = await instanceAxios.get(`products?${params}`);
    return response?.data;
  },
  createImageProduct: async (id, data) => {
    const response = await instanceAxios.post(`products/${id}/images`, data);
    return response?.data;
  },
  deleteImageProduct: async (productId, imageId) => {
    const response = await instanceAxios.delete(`products/${productId}/images/${imageId}`);
    return response?.data;
  },
  getImageProduct: async (id) => {
    const response = await instanceAxios.get(`images/${id}`, { responseType: 'blob' });
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
  getListCategories: async () => {
    const response = await instanceAxios.get(`products/categories`);
    return response?.data;
  },
  getListCountries: async () => {
    const response = await instanceAxios.get(`countries`);
    return response?.data;
  },
};
