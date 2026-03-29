import { productsAPI } from '@/api/products.api';
import { useProductsStore } from '@/store';
import { toast } from 'sonner';

export function updatePaginationProducts(size, page) {
  const { updatePagination } = useProductsStore.getState();

  updatePagination({ size, page });
  const params = `size=${size}&page=${page}`;
  getProducts(params);
}

export async function getProducts(params = 'size=10&page=1') {
  const { setProducts, updatePagination, setLoading } = useProductsStore.getState();

  setLoading({ list: true });

  await productsAPI
    .getListProducts(params)
    .then((res) => {
      setProducts(res.items);
      updatePagination({ totalItems: res.totalItems, totalPages: res.totalPages });
    })
    .catch((err) => {
      toast.error('Ошибка получения продуктов', {
        position: 'top-center',
      });
    })
    .finally(() => setLoading({ list: false }));
}

export async function updateProduct(productId, data, setOpen, imageProduct) {
  const { setLoading } = useProductsStore.getState();

  setLoading({ update: true });

  const product = await productsAPI
    .updateProduct(productId, data)
    .then(async (res) => {
      if (imageProduct) await createImageProduct(res.id, imageProduct);
      await getProducts();

      toast.success('Товар успешно изменен', {
        position: 'top-center',
      });

      return res;
    })
    .catch((err) => {
      toast.error('Ошибка изменения товара', {
        position: 'top-center',
      });

      return null;
    })
    .finally(() => {
      setLoading({ update: false });
      setOpen(false);
    });

  return product;
}

export async function createProduct(data, setOpen, imageProduct) {
  const { setLoading } = useProductsStore.getState();

  setLoading({ create: true });

  const product = await productsAPI
    .createProduct(data)
    .then(async (res) => {
      if (imageProduct) await createImageProduct(res.id, imageProduct);
      await getProducts();

      toast.success('Товар успешно добавлен', {
        position: 'top-center',
      });

      return res;
    })
    .catch((err) => {
      toast.error('Ошибка добавления товара', {
        position: 'top-center',
      });

      return null;
    })
    .finally(() => {
      setLoading({ create: false });
      setOpen(false);
    });

  return product;
}

export async function deleteProduct(productId, setOpen) {
  const { setLoading } = useProductsStore.getState();

  setLoading({ delete: true });

  await productsAPI
    .deleteProduct(productId)
    .then(async (res) => {
      await getProducts();
      toast.success('Товар успешно удален', {
        position: 'top-center',
      });
    })
    .catch((err) => {
      toast.error('Ошибка удаления товара', {
        position: 'top-center',
      });
    })
    .finally(() => {
      setLoading({ delete: false });
      setOpen(false);
    });
}

export async function createImageProduct(productId, image) {
  const formData = new FormData();
  formData.append('file', image);

  await productsAPI
    .createImageProduct(productId, formData)
    .then((res) => {})
    .catch((err) => {
      toast.error('Ошибка изменения изображения', {
        position: 'top-center',
      });
    });
}

export async function getCategories() {
  const { setCategories } = useProductsStore.getState();

  await productsAPI
    .getListCategories()
    .then((res) => setCategories(res))
    .catch((err) => {});
}

export async function getCountries() {
  const { setCountries } = useProductsStore.getState();

  await productsAPI
    .getListCountries()
    .then((res) => setCountries(res))
    .catch((err) => {});
}
