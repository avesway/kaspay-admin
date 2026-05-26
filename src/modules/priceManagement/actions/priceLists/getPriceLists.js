import { priceListsAPI } from '../../api';
import { usePriceListsStore } from '../../store';
import { toast } from 'sonner';

export async function getPriceLists() {
  const { setPriceLists, setPagination, pagination, setLoading, setError } = usePriceListsStore.getState();

  setLoading({ list: true });

  await priceListsAPI
    .getList(`size=${pagination.size}&page=${pagination.page}`)
    .then((res) => {
      setPriceLists(res?.items || []);
      setPagination({ totalItems: res?.totalItems || 0, totalPages: res?.totalPages || 0 });
      setError({ list: false });
    })
    .catch(() => {
      toast.error('Ошибка получения прайс листов', { position: 'top-center' });
      setError({ list: true });
    })
    .finally(() => setLoading({ list: false }));
}
