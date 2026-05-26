import { productsCatalogAPI } from '../../api/productsCatalog.api';
import { useProductsCatalogStore } from '../../store';
import { toast } from 'sonner';
import { getProductsCatalog } from './getProductsCatalog';

export async function deleteProduct(productId, setOpen) {
  const { setLoading } = useProductsCatalogStore.getState();
  setLoading({ delete: true });

  await productsCatalogAPI
    .deleteProduct(productId)
    .then(async () => {
      await getProductsCatalog();
      toast.success('Товар успешно удален', { position: 'top-center' });
    })
    .catch(() => {
      toast.error('Ошибка удаления товара', { position: 'top-center' });
    })
    .finally(() => {
      setLoading({ delete: false });
      setOpen(false);
    });
}
