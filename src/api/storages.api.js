import { refreshToken } from '@/actions/auth.actions';
import instanceAxios from '@/config/axios';

export const storagesAPI = {
  getListStorages: async (params) => {
    try {
      await refreshToken();
      const response = await instanceAxios.get(`storages?${params}`);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  getListDeliveries: async (params) => {
    try {
      await refreshToken();
      const response = await instanceAxios.get(`deliveries?${params}`);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  getListSuppliers: async () => {
    try {
      await refreshToken();
      const response = await instanceAxios.get(`suppliers`);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  createDelivery: async (data) => {
    try {
      await refreshToken();
      const response = await instanceAxios.post(`deliveries`, data);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  calculationsDeliveryPrice: async (data) => {
    try {
      await refreshToken();
      const response = await instanceAxios.post(`calculations/delivery-price`, data);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
};
