import { create } from 'zustand';

export const useAccountStore = create((set, get) => ({
  account: null,

  setAccount: (account) => set({ account }),
}));
