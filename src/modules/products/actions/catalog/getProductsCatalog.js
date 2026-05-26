import { productsCatalogAPI } from '../../api/productsCatalog.api';
import { useProductsCatalogStore } from '../../store';
import { toast } from 'sonner';

export async function getProductsCatalog(params = '') {
  const { setProductsCatalog, setPagination, setLoading, pagination } = useProductsCatalogStore.getState();

  setLoading({ list: true });

  await productsCatalogAPI
    .getListProducts(`size=${pagination.size}&page=${pagination.page}${params ? `&${params}` : ''}`)
    .then((res) => {
      setProductsCatalog(res.items);
      setPagination({
        totalItems: res.totalItems,
        totalPages: res.totalPages,
      });
    })
    .catch(() => {
      toast.error('Ошибка получения продуктов', { position: 'top-center' });
    })
    .finally(() => setLoading({ list: false }));
}
