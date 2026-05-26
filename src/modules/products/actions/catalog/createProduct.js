import { productsCatalogAPI } from '../../api/productsCatalog.api';
import { useProductsCatalogStore } from '../../store';
import { toast } from 'sonner';
import { getProductsCatalog } from './getProductsCatalog';
import { createImageProduct } from './productImages';

export async function createProduct(data, setOpen, imageProduct) {
  const { setLoading } = useProductsCatalogStore.getState();
  setLoading({ create: true });

  const product = await productsCatalogAPI
    .createProduct(data)
    .then(async (res) => {
      if (imageProduct) await createImageProduct(res.id, imageProduct);
      await getProductsCatalog();
      toast.success('Товар успешно добавлен', { position: 'top-center' });
      return res;
    })
    .catch(() => {
      toast.error('Ошибка добавления товара', { position: 'top-center' });
      return null;
    })
    .finally(() => {
      setLoading({ create: false });
      setOpen(false);
    });

  return product;
}
