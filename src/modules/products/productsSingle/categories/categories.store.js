import { create } from 'zustand';

export const useCategoriesStore = create((set, get) => ({
  categories: [],

  loading: {
    list: false,
    create: false,
    update: false,
    delete: false,
  },

  error: {
    list: false,
  },

  setCategories: (categories) => set({ categories }),
  setLoading: (data) => set({ loading: { ...get().loading, ...data } }),
  setError: (data) => set({ error: { ...get().error, ...data } }),
}));
