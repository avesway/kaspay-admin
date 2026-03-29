import { create } from 'zustand';
import { format } from 'date-fns';

export const useSalePointsStore = create((set, get) => ({
  salePoints: [],
  saleDevices: [],
  salePointOperations: [],

  activeSalePoint: null,

  pagination: {
    size: 10,
    page: 1,
    totalItems: 0,
    totalPages: 0,
  },

  filterOperations: {
    from: format(new Date(), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd'),
  },

  paginationOperations: {
    size: 10,
    page: 1,
    totalItems: 0,
    totalPages: 0,
  },

  paginationDevices: {
    size: 10,
    page: 1,
    totalItems: 0,
    totalPages: 0,
  },

  loading: {
    list: false,
    devices: false,
    operations: false,
  },
  error: {
    list: false,
    devices: false,
    operations: false,
  },

  setSalePoints: (data) => set({ salePoints: data }),
  setSaleDevices: (data) => set({ saleDevices: data }),
  setSalePointOperations: (data) => set({ salePointOperations: data }),
  setActiveSalePoint: (data) => set({ activeSalePoint: data }),
  setLoading: (data) => set({ loading: { ...get().loading, ...data } }),
  setError: (data) => set({ error: { ...get().error, ...data } }),
  updateFilterOperations: (data) => set({ filterOperations: { ...get().filterOperations, ...data } }),
  updatePagination: (data) => set({ pagination: { ...get().pagination, ...data } }),
  updatePaginationOperations: (data) => set({ paginationOperations: { ...get().paginationOperations, ...data } }),
  updatePaginationDevices: (data) => set({ paginationOperations: { ...get().paginationDevices, ...data } }),
}));
