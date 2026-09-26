import { toast } from 'sonner';

import { createImageProduct } from './productImages.processes';
import { productsCatalogAPI } from './productsCatalog.api';
import { useProductsCatalogStore } from './productsCatalog.store';

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

export function setPaginationProducts(size, page) {
  const { setPagination } = useProductsCatalogStore.getState();
  setPagination({ size, page });
  getProductsCatalog();
}

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

export async function getCategories() {
  const { setCategories } = useProductsCatalogStore.getState();
  await productsCatalogAPI
    .getListCategories()
    .then((res) => setCategories(res))
    .catch(() => {});
}

export async function getCountries() {
  const { setCountries } = useProductsCatalogStore.getState();
  await productsCatalogAPI
    .getListCountries()
    .then((res) => setCountries(res))
    .catch(() => {});
}
