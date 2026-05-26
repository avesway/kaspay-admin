import { create } from 'zustand';

export const usePriceManagementStore = create((set, get) => ({
  activeProduct: {
    productId: null,
    input: '',
    discountRate: null,
    salePrice: null,
    uploadToTerminal: null,
    originalDiscountRate: null,
    originalSalePrice: null,
    isCalculations: null,
  },

  updateActiveProduct: (data) => set({ activeProduct: { ...get().activeProduct, ...data } }),
}));
