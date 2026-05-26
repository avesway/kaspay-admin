import { create } from 'zustand';

export const usePriceListsStore = create((set, get) => ({
  priceLists: [],

  pagination: {
    size: 10,
    page: 1,
    totalItems: 0,
    totalPages: 0,
  },

  loading: {
    list: false,
    update: false,
    create: false,
    delete: false,
  },
  error: {
    list: false,
  },

  setPriceLists: (priceLists) => set({ priceLists }),
  setLoading: (data) => set({ loading: { ...get().loading, ...data } }),
  setError: (data) => set({ error: { ...get().error, ...data } }),
  setPagination: (data) => set({ pagination: { ...get().pagination, ...data } }),
}));
