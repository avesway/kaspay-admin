import { create } from 'zustand';

export const useMatricesStore = create((set, get) => ({
  templates: [],
  typesMatrices: [],
  pagination: {
    size: 10,
    page: 1,
    totalItems: 0,
    totalPages: 0,
  },
  loading: {
    list: false,
    types: false,
    create: false,
    update: false,
    delete: false,
  },
  error: {
    list: false,
    types: false,
    create: false,
    update: false,
    delete: false,
    emptyColumns: false,
  },
  activeColumn: {
    rowId: '',
    columnId: '',
    productId: '',
    productQuantity: '',
  },
  activeMatrix: null,
  activeMatrixRows: [],
  updatedMatrixRows: {
    originalColumns: [],
    deactivatedColumnIds: [],
    addedColumns: [],
  },

  setTemplates: (data) => set({ templates: [...data] }),
  setTypesMatrices: (types) => set({ typesMatrices: types }),
  setLoading: (data) => set({ loading: { ...get().loading, ...data } }),
  setError: (data) => set({ error: { ...get().error, ...data } }),
  setPagination: (data) => set({ pagination: { ...get().pagination, ...data } }),
  setActiveMatrix: (data) => set({ activeMatrix: data }),
  setActiveMatrixRows: (data) => set({ activeMatrixRows: data }),
  setUpdatedMatrixRows: (data) => set({ updatedMatrixRows: { ...get().updatedMatrixRows, ...data } }),
  setActiveColumn: (data) => set({ activeColumn: { ...get().activeColumn, ...data } }),
}));
