import { create } from 'zustand';

export const useProductsCompositeStore = create((set, get) => ({
  products: [],
  purposeTypes: '',
  unitTypes: [],
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
  setPurposeTypes: (purposeTypes) => set({ purposeTypes }),
  setUnitTypes: (unitTypes) => set({ unitTypes }),
  setLoading: (data) => set({ loading: { ...get().loading, ...data } }),
  setPagination: (data) => set({ pagination: { ...get().pagination, ...data } }),
}));
