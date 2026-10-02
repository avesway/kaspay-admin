import { format } from 'date-fns';
import { create } from 'zustand';

export const useMovementTasksStore = create((set, get) => ({
  movementTasks: [],
  movementTaskTypes: [],
  filter: {
    statuses: '',
    createdAtFrom: format(new Date(), 'yyyy-MM-dd'),
    createdAtTo: format(new Date(), 'yyyy-MM-dd'),
  },
  pagination: {
    size: 10,
    page: 1,
    totalItems: 0,
    totalPages: 0,
  },

  loading: {
    list: false,
    types: false,
  },
  error: {
    list: false,
    types: false,
  },

  setMovementTasks: (movementTasks) => set({ movementTasks }),
  setMovementTaskTypes: (movementTaskTypes) => set({ movementTaskTypes }),
  setFilter: (data) => set({ filter: { ...get().filter, ...data } }),
  setPagination: (data) => set({ pagination: { ...get().pagination, ...data } }),
  setLoading: (data) => set({ loading: { ...get().loading, ...data } }),
  setError: (data) => set({ error: { ...get().error, ...data } }),
}));
