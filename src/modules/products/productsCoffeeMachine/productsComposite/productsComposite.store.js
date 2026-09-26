import { create } from 'zustand';

export const useProductsCoffeeMachineStore = create((set, get) => ({
  products: [],
  pagination: {
    size: 10,
    page: 1,
    totalItems: 0,
    totalPages: 0,
  },
  loading: {
    list: false,
    create: false,
    update: false,
    delete: false,
  },

  setProducts: (products) => set({ products }),
  setLoading: (data) => set({ loading: { ...get().loading, ...data } }),
  setPagination: (data) => set({ pagination: { ...get().pagination, ...data } }),
}));
