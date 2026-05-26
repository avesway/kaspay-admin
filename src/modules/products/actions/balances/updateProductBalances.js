import { useProductsBalancesStore } from '../../store';

export async function updateProductBalances(data) {
  const { setProductsBalances, productsBalances } = useProductsBalancesStore.getState();

  const updated = productsBalances.map((item) =>
    item.id === data.balanceId ? { ...item, priceAttributes: { ...item.priceAttributes, ...data } } : item,
  );

  setProductsBalances(updated);
}
