import { create } from 'zustand';

export const useProductsBalancesStore = create((set, get) => ({
  productsBalances: [],
  productsBalancesView: [],
  productDeviceMatrixItems: [],

  paramsRequest: '',
  pagination: {
    size: 10,
    page: 1,
    totalItems: 0,
    totalPages: 0,
  },

  loading: {
    list: false,
    listView: false,
    update: false,
    create: false,
    delete: false,
    productDeviceMatrixItems: false,
  },
  error: {
    list: false,
    listView: false,
    productDeviceMatrixItems: false,
  },

  setProductsBalances: (productsBalances) => set({ productsBalances }),
  setProductsBalancesView: (productsBalancesView) => set({ productsBalancesView }),
  setParamsRequest: (paramsRequest) => set({ paramsRequest }),
  setLoading: (data) => set({ loading: { ...get().loading, ...data } }),
  setError: (data) => set({ error: { ...get().error, ...data } }),
  setPagination: (data) => set({ pagination: { ...get().pagination, ...data } }),
}));
