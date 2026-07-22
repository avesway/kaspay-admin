import { create } from 'zustand';

export const useProductsCatalogStore = create((set, get) => ({
  products: [],
  categories: [],
  countries: [],

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

  setProductsCatalog: (products) => set({ products }),
  setCategories: (categories) => set({ categories }),
  setCountries: (countries) => set({ countries }),
  setLoading: (data) => set({ loading: { ...get().loading, ...data } }),
  setPagination: (data) => set({ pagination: { ...get().pagination, ...data } }),
}));
