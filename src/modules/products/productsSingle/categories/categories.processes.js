import { toast } from 'sonner';

import { categoriesAPI } from './categories.api';
import { useCategoriesStore } from './categories.store';

export async function getListCategories() {
  const { setCategories, setLoading, setError } = useCategoriesStore.getState();

  setLoading({ list: true });

  const categories = await categoriesAPI
    .getListCategories()
    .then((res) => {
      setCategories(res);
      setError({ list: false });
      return res;
    })
    .catch(() => {
      setError({ list: true });
      toast.error('Ошибка получения категорий', { position: 'top-center' });
      return [];
    })
    .finally(() => setLoading({ list: false }));

  return categories;
}

export async function createCategory(data, setOpen) {
  const { setLoading } = useCategoriesStore.getState();
  setLoading({ create: true });

  await categoriesAPI
    .createCategory(data)
    .then(async () => {
      await getListCategories();
      toast.success('Категория успешно добавлена', { position: 'top-center' });
    })
    .catch(() => {
      toast.error('Ошибка добавления категории', { position: 'top-center' });
    })
    .finally(() => {
      setLoading({ create: false });
      setOpen(false);
    });
}

export async function updateCategory(categoryId, data, setOpen) {
  const { setLoading } = useCategoriesStore.getState();
  setLoading({ update: true });

  await categoriesAPI
    .updateCategory(categoryId, data)
    .then(async () => {
      await getListCategories();
      toast.success('Категория успешно обновлена', { position: 'top-center' });
    })
    .catch(() => {
      toast.error('Ошибка обновления категории', { position: 'top-center' });
    })
    .finally(() => {
      setLoading({ update: false });
      setOpen(false);
    });
}

export async function deleteCategory(categoryId, setOpen) {
  const { setLoading } = useCategoriesStore.getState();
  setLoading({ delete: true });

  await categoriesAPI
    .deleteCategory(categoryId)
    .then(async () => {
      await getListCategories();
      toast.success('Категория успешно удалена', { position: 'top-center' });
    })
    .catch(() => {
      toast.error('Ошибка удаления категории', { position: 'top-center' });
    })
    .finally(() => {
      setLoading({ delete: false });
      setOpen(false);
    });
}
