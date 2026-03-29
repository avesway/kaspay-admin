import { refreshToken } from '@/actions/auth.actions';
import instanceAxios from '@/config/axios';

export const productsAPI = {
  getListProducts: async (params) => {
    try {
      await refreshToken();
      const response = await instanceAxios.get(`products?${params}`);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  getListProductsBalances: async (params) => {
    try {
      await refreshToken();
      const response = await instanceAxios.get(`products/balances?${params}`);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  savePriceProductBalance: async (id, data) => {
    try {
      await refreshToken();
      const response = await instanceAxios.patch(`products/balances/${id}`, data);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  movingProductBalance: async (id, data) => {
    try {
      await refreshToken();
      const response = await instanceAxios.post(`products/balances/${id}/movemenets`, data);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  createImageProduct: async (id, data) => {
    try {
      await refreshToken();
      const response = await instanceAxios.post(`products/${id}/images`, data);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  deleteImageProduct: async (productId, imageId) => {
    try {
      await refreshToken();
      const response = await instanceAxios.delete(`products/${productId}/images/${imageId}`);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  getImageProduct: async (id) => {
    try {
      await refreshToken();
      const response = await instanceAxios.get(`images/${id}`, {
        responseType: 'blob',
      });

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  createProduct: async (data) => {
    try {
      await refreshToken();
      const response = await instanceAxios.post(`products`, data);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  updateProduct: async (id, data) => {
    try {
      await refreshToken();
      const response = await instanceAxios.put(`products/${id}`, data);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  deleteProduct: async (id) => {
    try {
      await refreshToken();
      const response = await instanceAxios.delete(`products/${id}`);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  getListCategories: async () => {
    try {
      await refreshToken();
      const response = await instanceAxios.get(`products/categories`);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  getListCountries: async () => {
    try {
      await refreshToken();
      const response = await instanceAxios.get(`countries`);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
};
