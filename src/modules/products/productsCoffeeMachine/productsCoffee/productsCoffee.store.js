import { create } from 'zustand';

export const useProductsCoffeeStore = create((set, get) => ({
  drinks: [],
  ingredientProducts: [],
  loading: {
    list: false,
    create: false,
    update: false,
    delete: false,
  },

  setDrinks: (drinks) => set({ drinks }),
  setIngredientProducts: (ingredientProducts) => set({ ingredientProducts }),
  setLoading: (data) => set({ loading: { ...get().loading, ...data } }),
}));
