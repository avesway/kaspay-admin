import { toast } from 'sonner';

import { productsCompositeAPI } from './productsComposite.api';
import { useProductsCompositeStore } from './productsComposite.store';
import { createImageProduct } from '../../productsSingle/catalog/productImages.processes';

export async function getProductsComposite(purposeTypes) {
  const { setProducts, setPagination, setPurposeTypes, setLoading, pagination } = useProductsCompositeStore.getState();

  setPurposeTypes(purposeTypes);
  setLoading({ list: true });

  await productsCompositeAPI
    .getListProducts(`size=${pagination.size}&page=${pagination.page}&purposeTypes=${purposeTypes}`)
    .then((res) => {
      setProducts(res.items);
      setPagination({
        totalItems: res.totalItems,
        totalPages: res.totalPages,
      });
    })
    .catch(() => {
      toast.error('Ошибка получения товаров для кофемашины', { position: 'top-center' });
    })
    .finally(() => setLoading({ list: false }));
}

export function setPaginationProductsComposite(size, page) {
  const { setPagination, purposeTypes } = useProductsCompositeStore.getState();
  setPagination({ size, page });
  getProductsComposite(purposeTypes);
}

export async function createProductComposite(data, setOpen, imageProduct) {
  const { setLoading, purposeTypes } = useProductsCompositeStore.getState();
  setLoading({ create: true });

  const product = await productsCompositeAPI
    .createProduct(data)
    .then(async (res) => {
      if (imageProduct) await createImageProduct(res.id, imageProduct);
      await getProductsComposite(purposeTypes);
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

export async function updateProductComposite(productId, data, setOpen, imageProduct) {
  const { setLoading, purposeTypes } = useProductsCompositeStore.getState();
  setLoading({ update: true });

  const product = await productsCompositeAPI
    .updateProduct(productId, data)
    .then(async (res) => {
      if (imageProduct) await createImageProduct(res.id, imageProduct);
      await getProductsComposite(purposeTypes);
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

export async function deleteProductComposite(productId, setOpen) {
  const { setLoading, purposeTypes } = useProductsCompositeStore.getState();
  setLoading({ delete: true });

  await productsCompositeAPI
    .deleteProduct(productId)
    .then(async () => {
      await getProductsComposite(purposeTypes);
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

export async function getUnitTypes() {
  const { setUnitTypes } = useProductsCompositeStore.getState();
  await productsCompositeAPI
    .getUnitTypes()
    .then((res) => setUnitTypes(res))
    .catch(() => {});
}
