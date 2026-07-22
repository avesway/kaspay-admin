import { toast } from 'sonner';

import { pricesListsAPI } from './pricesLists.api';
import { usePricesListsStore } from './pricesLists.store';

export async function getPricesListsItems() {
  const { setPricesLists, setLoading, setError, setPagination } = usePricesListsStore.getState();

  try {
    setLoading({ list: true });

    const response = await pricesListsAPI.getItems();

    setPricesLists(response?.items || []);
    setPagination({ totalItems: response?.totalItems || 0, totalPages: response?.totalPages || 0 });
    setError({ list: false });
  } catch (error) {
    setError({ list: true });
    toast.error('Ошибка получения прайс листов', { position: 'top-center' });
    console.log('error', error);
  } finally {
    setLoading({ list: false });
  }
}

export async function getProductsPriceList(matrixId, priceListId) {
  const { setProductsPriceList, setLoading, setError } = usePricesListsStore.getState();

  try {
    setLoading({ productsPriceList: true });

    const response = await pricesListsAPI.getProductsPriceList(matrixId, priceListId);

    setProductsPriceList(response.items);
    setError({ productsPriceList: false });
    return response.items;
  } catch (error) {
    setError({ productsPriceList: true });
  } finally {
    setLoading({ productsPriceList: false });
  }
}

export function setPaginationPricesLists(size, page) {
  const { setPagination } = usePricesListsStore.getState();
  setPagination({ size, page });
  getPricesListsItems();
}

export async function createPriceList(data, setOpen) {
  const { setLoading } = usePricesListsStore.getState();

  try {
    setLoading({ create: true });

    await pricesListsAPI.create(data);
    await getPricesListsItems();
    toast.success('Прайс лист успешно создан', { position: 'top-center' });
    setOpen(false);
  } catch (error) {
    if (error?.response?.status === 409) {
      toast.error(error?.response?.data?.message, { position: 'top-center' });
      return;
    }

    toast.error('Ошибка создания прайс листа', { position: 'top-center' });
  } finally {
    setLoading({ create: false });
  }
}

export async function updatePriceList(priceListId, data, setOpen) {
  const { setLoading } = usePricesListsStore.getState();

  try {
    setLoading({ update: true });

    await pricesListsAPI.update(priceListId, data);
    await getPricesListsItems();
    toast.success('Прайс лист успешно изменен', { position: 'top-center' });
    setOpen(false);
  } catch (error) {
    if (error?.response?.status === 409) {
      toast.error(error?.response?.data?.message, { position: 'top-center' });
      return;
    }

    toast.error('Ошибка изменения прайс листа', { position: 'top-center' });
  } finally {
    setLoading({ update: false });
  }
}
