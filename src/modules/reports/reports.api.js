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
};
