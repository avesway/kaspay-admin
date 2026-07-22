import instanceAxios from '@/config/axios';

export const saleReportsAPI = {
  getStatisticsStorageRemainingProducts: async (ids) => {
    const response = await instanceAxios.get(`statistics/storages/remaining-products?${ids}`);
    return response?.data;
  },
  getStatisticsOrdersTotal: async (params = '') => {
    const response = await instanceAxios.get(`statistics/orders/total${params}`);
    return response?.data;
  },
  getStatisticsOrderDays: async (params = '') => {
    const response = await instanceAxios.get(`statistics/orders/days${params}`);
    return response?.data;
  },
  getStatisticsOrderTopProducts: async (params = '') => {
    const response = await instanceAxios.get(`statistics/orders/products/total${params}`);
    return response?.data;
  },
  getStatisticsOrderReceipts: async (params = '') => {
    const response = await instanceAxios.get(`statistics/orders/receipts${params}`);
    return response?.data;
  },
};
