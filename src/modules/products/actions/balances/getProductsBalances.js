import { productsBalancesAPI } from '../../api/productsBalances.api';
import { useProductsBalancesStore } from '../../store';
import { toast } from 'sonner';

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
