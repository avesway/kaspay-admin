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
  getDeviceControllerFirmwares: async () => {
    const response = await instanceAxios.get(`devices/firmwares`);
    return response?.data;
  },
  sendCommandDevices: async (data) => {
    const response = await instanceAxios.post(`devices/commands`, data);
    return response?.data;
  },
  attachMatrix: async (data) => {
    const response = await instanceAxios.post(`devices/device-product-matrix-price-lists`, data);
    return response?.data;
  },
  updateMatrixPriceList: async (linkId, data) => {
    const response = await instanceAxios.put(`devices/device-product-matrix-price-lists/${linkId}`, data);
    return response?.data;
  },
  attachMatrixPreview: async (data) => {
    const response = await instanceAxios.post(`devices/device-product-matrix-price-lists/attach-preview`, data);
    return response?.data;
  },
  replaceMatrixPreview: async (linkId, data) => {
    const response = await instanceAxios.post(`devices/device-product-matrix-price-lists/${linkId}/replacement-preview`, data);
    return response?.data;
  },
  replaceMatrix: async (linkId, data) => {
    const response = await instanceAxios.post(`devices/device-product-matrix-price-lists/${linkId}/replacement`, data);
    return response?.data;
  },
  detachMatrix: async (id) => {
    const response = await instanceAxios.delete(`devices/device-product-matrix-price-lists/${id}`);
    return response?.data;
  },
};
