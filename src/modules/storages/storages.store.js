import { create } from 'zustand';

export const useStoragesStore = create((set, get) => ({
  storages: [],
  movingStorages: [],
  deliveries: [],
  suppliers: [],

  loading: {
    listStorages: false,
    movingStorages: false,
    listDeliveries: false,
    listSuppliers: false,
  },
  error: {
    listStorages: false,
    movingStorages: false,
    listDeliveries: false,
    listSuppliers: false,
  },

  setStorages: (storages) => set({ storages }),
  setMovingStorages: (movingStorages) => set({ movingStorages }),
  setDeliveries: (deliveries) => set({ deliveries }),
  setSuppliers: (suppliers) => set({ suppliers }),
  setLoading: (data) => set({ loading: { ...get().loading, ...data } }),
  setError: (data) => set({ error: { ...get().error, ...data } }),
}));
