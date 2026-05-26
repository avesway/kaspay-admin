import { useProductsBalancesStore } from '../../store';
import { getProductsBalances } from './getProductsBalances';

export function setPaginationProductsBalances(size, page) {
  const { setPagination } = useProductsBalancesStore.getState();
  setPagination({ size, page });
  getProductsBalances();
}
