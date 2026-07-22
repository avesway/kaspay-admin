import instanceAxios from '@/config/axios';

export const pricesListsAPI = {
  getItems: async (params) => {
    const response = await instanceAxios.get(`products/price-lists${params || ''}`);
    return response?.data;
  },
  getProductsPriceList: async (matrixId, priceListId) => {
    const response = await instanceAxios.get(
      `products/price-lists/templates?matrixId=${matrixId}${priceListId ? `&priceListId=${priceListId}` : ''}`,
    );
    return response?.data;
  },
  calculationProductPrice: async (data) => {
    const response = await instanceAxios.post(`calculations/product-price-list-item`, data);
    return response?.data;
  },
  create: async (data) => {
    const response = await instanceAxios.post(`products/price-lists`, data);
    return response?.data;
  },
  update: async (id, data) => {
    const response = await instanceAxios.put(`products/price-lists/${id}`, data);
    return response?.data;
  },
  delete: async (id) => {
    const response = await instanceAxios.delete(`${id ? `/${id}` : ''}`);
    return response?.data;
  },
  deactivation: async (priceListId) => {
    const response = await instanceAxios.post(`products/price-lists/${priceListId}/deactivation`);
    return response?.data;
  },
};
