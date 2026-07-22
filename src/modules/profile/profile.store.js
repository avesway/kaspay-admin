import { create } from 'zustand';

export const useProfileStore = create((set, get) => ({
  account: null,

  setAccount: (account) => set({ account }),
}));
