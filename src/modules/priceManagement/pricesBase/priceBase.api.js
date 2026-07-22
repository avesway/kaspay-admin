import instanceAxios from '@/config/axios';

export const priceBaseAPI = {
  calculations: async (data) => {
    const response = await instanceAxios.post(`calculations/product-price`, data);
    return response?.data;
  },
};
