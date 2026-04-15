import { refreshToken } from '@/actions/auth.actions';
import instanceAxios from '@/config/axios';

export const devicesAPI = {
  getListDevices: async () => {
    try {
      await refreshToken();
      const response = await instanceAxios.get(`devices?deviceTypes=terminal`);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  getEventsDevices: async (params) => {
    try {
      await refreshToken();
      const response = await instanceAxios.get(`devices/events${params}`);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  getCommandsDevices: async (params) => {
    try {
      await refreshToken();
      const response = await instanceAxios.get(`devices/commands${params}`);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  getCommandsTypesDevices: async () => {
    try {
      await refreshToken();
      const response = await instanceAxios.get(`devices/commands/types`);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  sendCommandDevices: async (data) => {
    try {
      await refreshToken();
      const response = await instanceAxios.post(`devices/commands`, data);

      return response?.data;
    } catch (error) {
      throw error;
    }
  },
};
