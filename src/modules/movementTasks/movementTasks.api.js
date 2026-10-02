import instanceAxios from '@/config/axios';

export const movementTasksAPI = {
  getMovementTaskTypes: async () => {
    const response = await instanceAxios.get('products/movement-tasks/types');
    return response?.data;
  },
  getMovementTasks: async (params = '') => {
    const response = await instanceAxios.get(`products/movement-tasks${params}`);
    return response?.data;
  },
};
