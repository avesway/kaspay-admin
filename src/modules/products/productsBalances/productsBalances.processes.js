import { toast } from 'sonner';

import { usePriceBaseStore } from '@/modules/priceManagement/pricesBase/priceBase.store';

import { productsBalancesAPI } from './productsBalances.api';
import { useProductsBalancesStore } from './productsBalances.store';

export async function getProductsBalances() {
  const { setProductsBalances, setPagination, pagination, paramsRequest, setLoading, setError } =
    useProductsBalancesStore.getState();

  setLoading({ list: true });

  await productsBalancesAPI
    .getList(`${paramsRequest ? `${paramsRequest}&` : ''}size=${pagination.size}&page=${pagination.page}`)
    .then((res) => {
      setProductsBalances(res.items);
      setPagination({ totalItems: res.totalItems, totalPages: res.totalPages });
      setError({ list: false });
    })
    .catch(() => {
      toast.error('Ошибка получения продуктов', { position: 'top-center' });
      setError({ list: true });
    })
    .finally(() => setLoading({ list: false }));
}

export function setPaginationProductsBalances(size, page) {
  const { setPagination } = useProductsBalancesStore.getState();
  setPagination({ size, page });
  getProductsBalances();
}

export async function updatePriceProductBalance(productId, data) {
  const { updateActiveProduct } = usePriceBaseStore.getState();

  await productsBalancesAPI
    .savePrice(productId, data)
    .then(() => {
      getProductsBalances();
      updateActiveProduct({
        productId: null,
        input: '',
        discountRate: null,
        salePrice: null,
        uploadToTerminal: null,
        originalDiscountRate: null,
        originalSalePrice: null,
        isCalculations: null,
      });
      toast.success('Продукт успешно изменен', { position: 'top-center' });
    })
    .catch(() => {
      toast.error('Ошибка сохранения', { position: 'top-center' });
    });
}

export async function updateProductBalances(data) {
  const { setProductsBalances, productsBalances } = useProductsBalancesStore.getState();

  const updated = productsBalances.map((item) =>
    item.id === data.balanceId ? { ...item, priceAttributes: { ...item.priceAttributes, ...data } } : item,
  );

  setProductsBalances(updated);
}
