import { toast } from 'sonner';

import { createImageProduct } from './productImages.processes';
import { productsSingleAPI } from './productsSingle.api';
import { useProductsSingleStore } from './productsSingle.store';

export async function getProductsSingle(params = '') {
  const { setProductsSingle, setPagination, setLoading, pagination } = useProductsSingleStore.getState();

  setLoading({ list: true });

  await productsSingleAPI
    .getListProducts(`size=${pagination.size}&page=${pagination.page}${params ? `&${params}` : ''}`)
    .then((res) => {
      setProductsSingle(res.items);
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

export async function createProductSingle(data, setOpen, imageProduct) {
  const { setLoading } = useProductsSingleStore.getState();
  setLoading({ create: true });

  const product = await productsSingleAPI
    .createProduct(data)
    .then(async (res) => {
      if (imageProduct) await createImageProduct(res.id, imageProduct);
      await getProductsSingle();
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

export function setPaginationProductsSingle(size, page) {
  const { setPagination } = useProductsSingleStore.getState();
  setPagination({ size, page });
  getProductsSingle();
}

export async function updateProductSingle(productId, data, setOpen, imageProduct) {
  const { setLoading } = useProductsSingleStore.getState();
  setLoading({ update: true });

  const product = await productsSingleAPI
    .updateProduct(productId, data)
    .then(async (res) => {
      if (imageProduct) await createImageProduct(res.id, imageProduct);
      await getProductsSingle();
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

export async function deleteProductSingle(productId, setOpen) {
  const { setLoading } = useProductsSingleStore.getState();
  setLoading({ delete: true });

  await productsSingleAPI
    .deleteProduct(productId)
    .then(async () => {
      await getProductsSingle();
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

export async function getCategories() {
  const { setCategories } = useProductsSingleStore.getState();
  await productsSingleAPI
    .getListCategories()
    .then((res) => setCategories(res))
    .catch(() => {});
}

export async function getCountries() {
  const { setCountries } = useProductsSingleStore.getState();
  await productsSingleAPI
    .getListCountries()
    .then((res) => setCountries(res))
    .catch(() => {});
}
