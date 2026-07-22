import instanceAxios from '@/config/axios';

export const storagesAPI = {
  getListStorages: async (params) => {
    const response = await instanceAxios.get(`storages?${params}`);
    return response?.data;
  },
  getListDeliveries: async (params) => {
    const response = await instanceAxios.get(`deliveries?${params}`);
    return response?.data;
  },
  getListSuppliers: async () => {
    const response = await instanceAxios.get(`suppliers`);
    return response?.data;
  },
  createDelivery: async (data) => {
    const response = await instanceAxios.post(`deliveries`, data);

    return response?.data;
  },
  calculationsDeliveryPrice: async (data) => {
    const response = await instanceAxios.post(`calculations/delivery-price`, data);
    return response?.data;
  },
};
