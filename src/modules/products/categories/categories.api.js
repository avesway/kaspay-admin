import instanceAxios from '@/config/axios';

export const categoriesAPI = {
  getListCategories: async () => {
    const response = await instanceAxios.get(`products/categories`);
    return response?.data;
  },
  createCategory: async (data) => {
    const response = await instanceAxios.post(`products/categories`, data);
    return response?.data;
  },
  updateCategory: async (categoryId, data) => {
    const response = await instanceAxios.put(`products/categories/${categoryId}`, data);
    return response?.data;
  },
  deleteCategory: async (categoryId) => {
    const response = await instanceAxios.delete(`products/categories/${categoryId}`);
    return response?.data;
  },
};
