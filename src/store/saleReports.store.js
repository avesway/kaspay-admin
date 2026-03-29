import { create } from 'zustand';
import { format } from 'date-fns';

export const useSaleReportsStore = create((set, get) => ({
  statisticOrdersTotal: {},
  statisticOrderDays: [],
  statisticOrderTopProducts: [],
  statisticOrderReceipts: [],
  statisticStorageRemainingProducts: [],

  loading: {
    storageRemainingProducts: false,
    ordersTotal: false,
    orderDays: false,
    orderTopProducts: false,
    orderReceipts: false,
  },
  error: {
    storageRemainingProducts: false,
    ordersTotal: false,
    orderDays: false,
    orderTopProducts: false,
    orderReceipts: false,
  },

  paginationTopProducts: {
    size: 5,
    page: 1,
    totalItems: 0,
    totalPages: 0,
  },

  paginationReceipts: {
    size: 5,
    page: 1,
    totalItems: 0,
    totalPages: 0,
  },

  paginationOrderDays: {
    size: 5,
    page: 1,
    totalItems: 0,
    totalPages: 0,
  },

  statisticFilter: {
    from: format(new Date(), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd'),
    salePointIds: null,
  },

  setLoading: (data) => set({ loading: { ...get().loading, ...data } }),
  setError: (data) => set({ error: { ...get().error, ...data } }),

  setStatisticStorageRemainingProducts: (data) => set({ statisticStorageRemainingProducts: data }),
  setStatisticOrdersTotal: (data) => set({ statisticOrdersTotal: data }),
  setStatisticOrderDays: (data) => set({ statisticOrderDays: data }),
  setStatisticOrderTopProducts: (data) => set({ statisticOrderTopProducts: data }),
  setStatisticOrderReceipts: (data) => set({ statisticOrderReceipts: data }),
  setStatisticFilter: (data) => set({ statisticFilter: { ...get().statisticFilter, ...data } }),
  setPaginationTopProducts: (data) => set({ paginationTopProducts: { ...get().paginationTopProducts, ...data } }),
  setPaginationReceipts: (data) => set({ paginationReceipts: { ...get().paginationReceipts, ...data } }),
  setPaginationOrderDays: (data) => set({ paginationOrderDays: { ...get().paginationOrderDays, ...data } }),
}));
