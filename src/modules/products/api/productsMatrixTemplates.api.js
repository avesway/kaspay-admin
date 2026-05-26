import { COFFEE_TEMPLATES, FRIDGE_TEMPLATES } from '../components/productsMatrixTemplates/mockData';

const MOCK_ALL = [...COFFEE_TEMPLATES, ...FRIDGE_TEMPLATES];

export const productsMatrixTemplatesAPI = {
  getList: async () => {
    return { items: MOCK_ALL, totalItems: MOCK_ALL.length, totalPages: 1 };
  },
  create: async (data) => {
    return { id: Date.now(), ...data };
  },
  update: async (id, data) => {
    return { id, ...data };
  },
  delete: async (id) => {
    return null;
  },
};
