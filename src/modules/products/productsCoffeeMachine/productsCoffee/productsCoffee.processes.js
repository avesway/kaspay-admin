import { toast } from 'sonner';

import { getProductUnitType } from './helpers/units';
import { productsCoffeeAPI } from './productsCoffee.api';
import { useProductsCoffeeStore } from './productsCoffee.store';
import { productsSingleAPI } from '../../productsSingle/catalog/productsSingle.api';

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || fallback;
}

function buildItemsPayload(items) {
  const { ingredientProducts } = useProductsCoffeeStore.getState();
  return items.map((item) => ({
    productId: item.productId,
    unitAmount: item.unitAmount,
    unitType: getProductUnitType(ingredientProducts.find((product) => product.id == item.productId)),
  }));
}

export async function getCompositions() {
  const { setCompositions, setLoading } = useProductsCoffeeStore.getState();

  setLoading({ list: true });

  await productsCoffeeAPI
    .getListCompositions()
    .then((res) => setCompositions(res))
    .catch(() => {
      toast.error('Ошибка получения рецептов напитков', { position: 'top-center' });
    })
    .finally(() => setLoading({ list: false }));
}

export async function getIngredientProducts() {
  const { setIngredientProducts } = useProductsCoffeeStore.getState();

  await productsSingleAPI
    .getListProducts('purposeTypes=composite&size=1000&page=1')
    .then((res) => setIngredientProducts(res.items))
    .catch(() => {});
}

export async function createComposition(data, setOpen) {
  const { setLoading } = useProductsCoffeeStore.getState();
  setLoading({ create: true });

  const payload = {
    name: data.name,
    description: data.description,
    isActive: data.isActive,
    items: buildItemsPayload(data.items),
  };

  const composition = await productsCoffeeAPI
    .createComposition(payload)
    .then(async (res) => {
      await getCompositions();
      toast.success('Рецепт успешно добавлен', { position: 'top-center' });
      return res;
    })
    .catch((error) => {
      toast.error(getErrorMessage(error, 'Ошибка добавления рецепта'), { position: 'top-center' });
      return null;
    })
    .finally(() => {
      setLoading({ create: false });
      setOpen(false);
    });

  return composition;
}

export async function updateComposition(compositionId, data, setOpen) {
  const { setLoading } = useProductsCoffeeStore.getState();
  setLoading({ update: true });

  const payload = {
    name: data.name,
    description: data.description,
    isActive: data.isActive,
    items: buildItemsPayload(data.items),
  };

  const composition = await productsCoffeeAPI
    .updateComposition(compositionId, payload)
    .then(async (res) => {
      await getCompositions();
      toast.success('Рецепт успешно изменен', { position: 'top-center' });
      return res;
    })
    .catch((error) => {
      toast.error(getErrorMessage(error, 'Ошибка изменения рецепта'), { position: 'top-center' });
      return null;
    })
    .finally(() => {
      setLoading({ update: false });
      setOpen(false);
    });

  return composition;
}

export async function deleteComposition(compositionId, setOpen) {
  const { setLoading } = useProductsCoffeeStore.getState();
  setLoading({ delete: true });

  await productsCoffeeAPI
    .deleteComposition(compositionId)
    .then(async () => {
      await getCompositions();
      toast.success('Рецепт успешно удален', { position: 'top-center' });
    })
    .catch((error) => {
      toast.error(getErrorMessage(error, 'Ошибка удаления рецепта'), { position: 'top-center' });
    })
    .finally(() => {
      setLoading({ delete: false });
      setOpen(false);
    });
}
