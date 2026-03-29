import { productsAPI } from '@/api/products.api';
import { storagesAPI } from '@/api/storages.api';
import { useStoragesStore } from '@/store';
import { getProductsBalances } from './productsBalances.actions';
import { toast } from 'sonner';
import { format, set } from 'date-fns';
import { priceRoundedKopecks } from '@/helpers/priceHelpers';

export async function getListStorages(params = '') {
  const { setStorages, setLoading, setError } = useStoragesStore.getState();

  setLoading({ listStorages: true });

  await storagesAPI
    .getListStorages(params)
    .then((res) => setStorages(res.items))
    .catch((err) => setError({ listStorages: true }))
    .finally(() => setLoading({ listStorages: false }));
}

export async function getListDeliveries() {
  const { setDeliveries, setLoading, setError } = useStoragesStore.getState();

  setLoading({ listDeliveries: true });

  await storagesAPI
    .getListDeliveries()
    .then((res) => setDeliveries(res.items))
    .catch((err) => setError({ listDeliveries: true }))
    .finally(() => setLoading({ listDeliveries: false }));
}

export async function getListSuppliers() {
  const { setSuppliers, setLoading, setError } = useStoragesStore.getState();

  setLoading({ listSuppliers: true });

  await storagesAPI
    .getListSuppliers()
    .then((res) => setSuppliers(res.items))
    .catch((err) => setError({ listSuppliers: true }))
    .finally(() => setLoading({ listSuppliers: false }));
}

export async function productsBalancesMovemenets(productId, data, form, setOpen) {
  await productsAPI
    .movingProductBalance(productId, data)
    .then((res) => {
      getProductsBalances();
      form.reset();
      setOpen(false);

      toast.success('Продукт успешно перемещен', {
        position: 'top-center',
      });
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message || 'Ошибка перемещения продукта', {
        position: 'top-center',
      });
    });
}

export async function registerProducStorage(data, form, setOpen) {
  try {
    const formatted = data.products.map((item) => {
      if (
        !item.productionAttributes.timeProduced ||
        !item.productionAttributes.producedAt ||
        !item.productionAttributes.expirationPeriod
      ) {
        delete item.productionAttributes;

        return {
          ...item,
          priceAttributes: {
            ...item.priceAttributes,
            totalCostPrice: priceRoundedKopecks(item.priceAttributes.totalCostPrice),
            costPrice: priceRoundedKopecks(item.priceAttributes.costPrice),
            totalVat: priceRoundedKopecks(item.priceAttributes.totalVat),
            totalPrice: priceRoundedKopecks(item.priceAttributes.totalPrice),
            vatRate: priceRoundedKopecks(item.priceAttributes.vatRate),
          },
        };
      }

      const [hours, minutes, seconds] = item.productionAttributes.timeProduced.split(':').map(Number);

      const combinedDate = set(item.productionAttributes.producedAt, {
        hours,
        minutes,
        seconds,
      });

      return {
        ...item,
        priceAttributes: {
          ...item.priceAttributes,
          totalCostPrice: priceRoundedKopecks(item.priceAttributes.totalCostPrice),
          costPrice: priceRoundedKopecks(item.priceAttributes.costPrice),
          totalVat: priceRoundedKopecks(item.priceAttributes.totalVat),
          totalPrice: priceRoundedKopecks(item.priceAttributes.totalPrice),
          vatRate: priceRoundedKopecks(item.priceAttributes.vatRate),
        },
        productionAttributes: {
          producedAt: format(combinedDate, "yyyy-MM-dd'T'HH:mm:ssXX"),
          expirationPeriod: `PT${item.productionAttributes.expirationPeriod}H`,
        },
      };
    });

    data.products = formatted;

    await storagesAPI
      .createDelivery(data)
      .then((res) => {
        getProductsBalances();
        form.reset();
        setOpen(false);

        toast.success('Продукт успешно добавлен', {
          position: 'top-center',
        });
      })
      .catch((err) => {
        toast.error('Ошибка добавления продукта', {
          position: 'top-center',
        });
      });
  } catch (error) {
    console.log('Error registerProducStorage', error);
  }
}
