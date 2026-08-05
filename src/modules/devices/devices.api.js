import instanceAxios from '@/config/axios';

export const devicesAPI = {
  getListDevices: async () => {
    const response = await instanceAxios.get(`devices?deviceTypes=terminal`);
    return response?.data;
  },
  getEventsDevices: async (params) => {
    const response = await instanceAxios.get(`devices/events${params}`);
    return response?.data;
  },
  getCommandsDevices: async (params) => {
    const response = await instanceAxios.get(`devices/commands${params}`);
    return response?.data;
  },
  getCommandsTypesDevices: async () => {
    const response = await instanceAxios.get(`devices/commands/types`);
    return response?.data;
  },
  getDeviceControllerLatchModes: async () => {
    const response = await instanceAxios.get(`devices/latch-modes`);
    return response?.data;
  },
  sendCommandDevices: async (data) => {
    const response = await instanceAxios.post(`devices/commands`, data);
    return response?.data;
  },
  connectPriceList: async (data) => {
    const response = await instanceAxios.post(`devices/device-product-matrix-price-lists`, data);
    return response?.data;
  },
  removePriceList: async (id) => {
    const response = await instanceAxios.delete(`devices/device-product-matrix-price-lists/${id}`);
    return response?.data;
  },
};
