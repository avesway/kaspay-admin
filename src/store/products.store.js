import { create } from 'zustand';

export const useProductsStore = create((set, get) => ({
  products: [],
  productsBalances: [],
  categories: [],
  countries: [],

  activeParams: '',
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
  error: false,

  setProducts: (products) => set({ products }),
  setCategories: (categories) => set({ categories }),
  setCountries: (countries) => set({ countries }),
  setLoading: (data) => set({ loading: { ...get().loading, ...data } }),
  updatePagination: (data) => set({ pagination: { ...get().pagination, ...data } }),
}));
