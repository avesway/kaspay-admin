import { useProductsCatalogStore } from '../../store';
import { getProductsCatalog } from './getProductsCatalog';

export function setPaginationProducts(size, page) {
  const { setPagination } = useProductsCatalogStore.getState();
  setPagination({ size, page });
  getProductsCatalog();
}
