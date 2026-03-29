import { productsAPI } from '@/api/products.api';
import { useProductsBalancesStore } from '@/store';
import { usePriceManagementStore } from '@/store/priceManagement.store';
import { toast } from 'sonner';

export function updatePaginationProductsBalances(size, page) {
  const { updatePagination } = useProductsBalancesStore.getState();

  updatePagination({ size, page });
  getProductsBalances('pagination');
}

export async function getProductsBalances(params = '') {
  const { setProductsBalances, updatePagination, setParamsRequest, setLoading, setError } = useProductsBalancesStore.getState();

  if (params != 'pagination' && params != '') setParamsRequest(params);
  if (params === 'newPage') setParamsRequest('');

  setLoading({ list: true });
  const updatedParams = getParamsRequest();

  await productsAPI
    .getListProductsBalances(updatedParams)
    .then((res) => {
      setProductsBalances(res.items);
      updatePagination({ totalItems: res.totalItems, totalPages: res.totalPages });
    })
    .catch((err) => {
      toast.error('Ошибка получения продуктов', {
        position: 'top-center',
      });
      setError({ list: true });
    })
    .finally(() => setLoading({ list: false }));
}

export async function updatePriceProductBalance(productId, data) {
  const { updateActiveProduct } = usePriceManagementStore.getState();

  await productsAPI
    .savePriceProductBalance(productId, data)
    .then((res) => {
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
      toast.success('Продукт успешно изменен', {
        position: 'top-center',
      });
    })
    .catch((err) => {
      toast.error('Ошибка сохранения', {
        position: 'top-center',
      });
    });
}

export async function updateProductsBalances(data) {
  const { setProductsBalances, productsBalances } = useProductsBalancesStore.getState();

  const updatedProduct = productsBalances.map((item) => {
    if (item.id === data.balanceId) {
      return { ...item, priceAttributes: { ...item.priceAttributes, ...data } };
    }

    return item;
  });

  setProductsBalances(updatedProduct);
}

function getParamsRequest() {
  try {
    const { paramsRequest, pagination } = useProductsBalancesStore.getState();

    return `size=${pagination.size}&page=${pagination.page}${paramsRequest ? `&${paramsRequest}` : ''}`;
  } catch (error) {
    console.log('Error getParamsRequest productsBalances: ', error);
  }
}
