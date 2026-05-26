import { productsMatrixTemplatesAPI } from '../../api/productsMatrixTemplates.api';
import { useProductsMatrixTemplatesStore } from '../../store';
import { toast } from 'sonner';

export async function getMatrixTemplates() {
  const { setTemplates, setPagination, setLoading } = useProductsMatrixTemplatesStore.getState();

  setLoading({ list: true });

  await productsMatrixTemplatesAPI
    .getList()
    .then((res) => {
      setTemplates(res.items);
      setPagination({ totalItems: res.totalItems, totalPages: res.totalPages });
    })
    .catch(() => {
      toast.error('Ошибка получения шаблонов матриц', { position: 'top-center' });
    })
    .finally(() => setLoading({ list: false }));
}
