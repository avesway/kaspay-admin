import instanceAxios from '@/config/axios';

export const reportsAPI = {
  getListReports: async (params = '') => {
    const response = await instanceAxios.get(`reports${params}`);
    return response?.data;
  },
  getRevenueDynamics: async (params = '') => {
    const response = await instanceAxios.get(`reports/revenueDynamics${params}`);
    return response?.data;
  },
  getHourlyRevenue: async (params = '') => {
    const response = await instanceAxios.get(`reports/hourlyRevenue${params}`);
    return response?.data;
  },
  getWeekdayRevenue: async (params = '') => {
    const response = await instanceAxios.get(`reports/weekdayRevenue${params}`);
    return response?.data;
  },
  getAverageReceipt: async (params = '') => {
    const response = await instanceAxios.get(`reports/averageReceipt${params}`);
    return response?.data;
  },
};
