import { create } from 'zustand';

export const useProductsCoffeeStore = create((set, get) => ({
  compositions: [],
  ingredientProducts: [],
  loading: {
    list: false,
    create: false,
    update: false,
    delete: false,
  },

  setCompositions: (compositions) => set({ compositions }),
  setIngredientProducts: (ingredientProducts) => set({ ingredientProducts }),
  setLoading: (data) => set({ loading: { ...get().loading, ...data } }),
}));
