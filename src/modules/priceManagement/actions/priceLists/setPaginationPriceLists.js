import { usePriceListsStore } from '../../store';
import { getPriceLists } from './getPriceLists';

export function setPaginationPriceLists(size, page) {
  const { setPagination } = usePriceListsStore.getState();
  setPagination({ size, page });
  getPriceLists();
}
