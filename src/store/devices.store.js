import { create } from 'zustand';
import { format } from 'date-fns';

export const useDevicesStore = create((set, get) => ({
  devices: [],
  deviceEvents: [],
  deviceCommands: [],
  deviceCommandsTypes: [],
  activeDevice: null,

  paginationEvents: {
    size: 10,
    page: 1,
    totalItems: 0,
    totalPages: 0,
  },

  filterEvents: {
    from: format(new Date(), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd'),
  },

  paginationCommands: {
    size: 10,
    page: 1,
    totalItems: 0,
    totalPages: 0,
  },

  filterCommands: {
    from: format(new Date(), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd'),
  },

  loading: {
    list: false,
    events: false,
    commands: false,
    commandsTypes: false,
    sendCommand: false,
  },
  error: {
    list: false,
    events: false,
    commands: false,
    commandsTypes: false,
  },

  setDevices: (data) => set({ devices: data }),
  setActiveDevice: (data) => set({ activeDevice: data }),
  setDeviceEvents: (data) => set({ deviceEvents: data }),
  setDeviceCommands: (data) => set({ deviceCommands: data }),
  setDeviceCommandsTypes: (data) => set({ deviceCommandsTypes: data }),
  setLoading: (data) => set({ loading: { ...get().loading, ...data } }),
  setError: (data) => set({ error: { ...get().error, ...data } }),

  updateFilterEvents: (data) => set({ filterEvents: { ...get().filterEvents, ...data } }),
  updatePaginationEvents: (data) => set({ paginationEvents: { ...get().paginationEvents, ...data } }),
  updateFilterCommands: (data) => set({ filterCommands: { ...get().filterCommands, ...data } }),
  updatePaginationCommands: (data) => set({ paginationCommands: { ...get().paginationCommands, ...data } }),
}));
