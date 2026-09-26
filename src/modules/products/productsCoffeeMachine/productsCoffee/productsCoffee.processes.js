import { toast } from 'sonner';

import { productsCoffeeAPI } from './productsCoffee.api';
import { useProductsCoffeeStore } from './productsCoffee.store';
import { productsCompositeAPI } from '../productsComposite/productsComposite.api';

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || fallback;
}

function buildPayload(data) {
  return {
    name: data.name,
    shortName: data.shortName,
    purposeType: 'coffee',
    composition: {
      items: data.items.map((item) => ({
        productId: item.productId,
        unitAmount: item.unitAmount,
      })),
    },
  };
}

export async function getDrinks() {
  const { setDrinks, setLoading } = useProductsCoffeeStore.getState();

  setLoading({ list: true });

  await productsCoffeeAPI
    .getListProducts('purposeTypes=coffee&size=20&page=1')
    .then((res) => setDrinks(res.items))
    .catch(() => {
      toast.error('Ошибка получения напитков', { position: 'top-center' });
    })
    .finally(() => setLoading({ list: false }));
}

export async function getIngredientProducts() {
  const { setIngredientProducts } = useProductsCoffeeStore.getState();

  await productsCompositeAPI
    .getListProducts('purposeTypes=composite&size=1000&page=1')
    .then((res) => setIngredientProducts(res.items))
    .catch(() => {});
}

export async function createDrink(data, setOpen) {
  const { setLoading } = useProductsCoffeeStore.getState();
  setLoading({ create: true });

  const drink = await productsCoffeeAPI
    .createProduct(buildPayload(data))
    .then(async (res) => {
      await getDrinks();
      toast.success('Напиток успешно добавлен', { position: 'top-center' });
      return res;
    })
    .catch((error) => {
      toast.error(getErrorMessage(error, 'Ошибка добавления напитка'), { position: 'top-center' });
      return null;
    })
    .finally(() => {
      setLoading({ create: false });
      setOpen(false);
    });

  return drink;
}

export async function updateDrink(drinkId, data, setOpen) {
  const { setLoading } = useProductsCoffeeStore.getState();
  setLoading({ update: true });

  const drink = await productsCoffeeAPI
    .updateProduct(drinkId, buildPayload(data))
    .then(async (res) => {
      await getDrinks();
      toast.success('Напиток успешно изменен', { position: 'top-center' });
      return res;
    })
    .catch((error) => {
      toast.error(getErrorMessage(error, 'Ошибка изменения напитка'), { position: 'top-center' });
      return null;
    })
    .finally(() => {
      setLoading({ update: false });
      setOpen(false);
    });

  return drink;
}

export async function deleteDrink(drinkId, setOpen) {
  const { setLoading } = useProductsCoffeeStore.getState();
  setLoading({ delete: true });

  await productsCoffeeAPI
    .deleteProduct(drinkId)
    .then(async () => {
      await getDrinks();
      toast.success('Напиток успешно удален', { position: 'top-center' });
    })
    .catch((error) => {
      toast.error(getErrorMessage(error, 'Ошибка удаления напитка'), { position: 'top-center' });
    })
    .finally(() => {
      setLoading({ delete: false });
      setOpen(false);
    });
}
