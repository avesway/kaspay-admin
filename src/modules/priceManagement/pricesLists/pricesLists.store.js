import { create } from 'zustand';

export const usePricesListsStore = create((set, get) => ({
  pricesLists: [],
  productsPriceList: [],
  activePriceList: null,

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
    productsPriceList: false,
  },
  error: {
    list: false,
    productsPriceList: false,
  },

  setPricesLists: (pricesLists) => set({ pricesLists }),
  setProductsPriceList: (productsPriceList) => set({ productsPriceList }),
  setActivePriceList: (priceList) => set({ activePriceList: priceList }),
  setLoading: (data) => set({ loading: { ...get().loading, ...data } }),
  setError: (data) => set({ error: { ...get().error, ...data } }),
  setPagination: (data) => set({ pagination: { ...get().pagination, ...data } }),
}));
