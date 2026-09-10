import { format } from 'date-fns';
import { create } from 'zustand';

export const useReportsStore = create((set, get) => ({
  reports: [],

  activeCategoryType: '',

  revenueDynamics: null,

  granularity: 'day',

  reportsFilter: {
    from: format(new Date(), 'yyyy-MM-dd'),
    to: '',
    salePointIds: '',
  },

  loading: {
    list: false,
    revenueDynamics: false,
  },
  error: {
    list: false,
    revenueDynamics: false,
  },

  setReports: (reports) => set({ reports }),
  setActiveCategoryType: (activeCategoryType) => set({ activeCategoryType }),
  setRevenueDynamics: (revenueDynamics) => set({ revenueDynamics }),
  setGranularity: (granularity) => set({ granularity }),
  setReportsFilter: (data) => set({ reportsFilter: { ...get().reportsFilter, ...data } }),
  setLoading: (data) => set({ loading: { ...get().loading, ...data } }),
  setError: (data) => set({ error: { ...get().error, ...data } }),
}));
