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

  hourlyRevenue: null,

  hourlyFilter: {
    date: format(new Date(), 'yyyy-MM-dd'),
    salePointIds: '',
  },

  weekdayRevenue: null,

  averageReceipt: null,

  loading: {
    list: false,
    revenueDynamics: false,
    hourlyRevenue: false,
    weekdayRevenue: false,
    averageReceipt: false,
  },
  error: {
    list: false,
    revenueDynamics: false,
    hourlyRevenue: false,
    weekdayRevenue: false,
    averageReceipt: false,
  },

  setReports: (reports) => set({ reports }),
  setActiveCategoryType: (activeCategoryType) => set({ activeCategoryType }),
  setRevenueDynamics: (revenueDynamics) => set({ revenueDynamics }),
  setGranularity: (granularity) => set({ granularity }),
  setReportsFilter: (data) => set({ reportsFilter: { ...get().reportsFilter, ...data } }),
  setHourlyRevenue: (hourlyRevenue) => set({ hourlyRevenue }),
  setHourlyFilter: (data) => set({ hourlyFilter: { ...get().hourlyFilter, ...data } }),
  setWeekdayRevenue: (weekdayRevenue) => set({ weekdayRevenue }),
  setAverageReceipt: (averageReceipt) => set({ averageReceipt }),
  setLoading: (data) => set({ loading: { ...get().loading, ...data } }),
  setError: (data) => set({ error: { ...get().error, ...data } }),
}));
