import instanceAxios from '@/config/axios';

export const saleReportsAPI = {
  getStatisticsStorageRemainingProducts: async (ids) => {
    try {
      const response = await instanceAxios.get(`statistics/storages/remaining-products?${ids}`);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  getStatisticsOrdersTotal: async (params = '') => {
    try {
      const response = await instanceAxios.get(`statistics/orders/total${params}`);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  getStatisticsOrderDays: async (params = '') => {
    try {
      const response = await instanceAxios.get(`statistics/orders/days${params}`);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  getStatisticsOrderTopProducts: async (params = '') => {
    try {
      const response = await instanceAxios.get(`statistics/orders/products/total${params}`);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  getStatisticsOrderReceipts: async (params = '') => {
    try {
      const response = await instanceAxios.get(`statistics/orders/receipts${params}`);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
};
