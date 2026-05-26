import { create } from 'zustand';

export const useProductsMatrixTemplatesStore = create((set, get) => ({
  templates: [],
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

  setTemplates: (templates) => set({ templates }),
  setLoading: (data) => set({ loading: { ...get().loading, ...data } }),
  setPagination: (data) => set({ pagination: { ...get().pagination, ...data } }),
}));
