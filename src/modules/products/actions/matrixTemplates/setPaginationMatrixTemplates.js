import { useProductsMatrixTemplatesStore } from '../../store';
import { getMatrixTemplates } from './getMatrixTemplates';

export function setPaginationMatrixTemplates(size, page) {
  const { setPagination } = useProductsMatrixTemplatesStore.getState();
  setPagination({ size, page });
  getMatrixTemplates();
}
