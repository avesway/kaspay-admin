import { create } from 'zustand';
import { toast } from 'sonner';
import { productsAPI } from '@/api/products.api';

export const useProductsBalancesStore = create((set, get) => ({
  productsBalances: [],

  paramsRequest: '',
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

  setProductsBalances: (productsBalances) => set({ productsBalances }),
  setParamsRequest: (paramsRequest) => set({ paramsRequest }),
  setLoading: (data) => set({ loading: { ...get().loading, ...data } }),
  setError: (data) => set({ error: { ...get().error, ...data } }),
  updatePagination: (data) => set({ pagination: { ...get().pagination, ...data } }),
}));
