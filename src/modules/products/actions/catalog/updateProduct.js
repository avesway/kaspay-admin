import { productsCatalogAPI } from '../../api/productsCatalog.api';
import { useProductsCatalogStore } from '../../store';
import { toast } from 'sonner';
import { getProductsCatalog } from './getProductsCatalog';
import { createImageProduct } from './productImages';

export async function updateProduct(productId, data, setOpen, imageProduct) {
  const { setLoading } = useProductsCatalogStore.getState();
  setLoading({ update: true });

  const product = await productsCatalogAPI
    .updateProduct(productId, data)
    .then(async (res) => {
      if (imageProduct) await createImageProduct(res.id, imageProduct);
      await getProductsCatalog();
      toast.success('Товар успешно изменен', { position: 'top-center' });
      return res;
    })
    .catch(() => {
      toast.error('Ошибка изменения товара', { position: 'top-center' });
      return null;
    })
    .finally(() => {
      setLoading({ update: false });
      setOpen(false);
    });

  return product;
}
