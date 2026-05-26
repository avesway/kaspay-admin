import { productsCatalogAPI } from '../../api/productsCatalog.api';
import { useProductsCatalogStore } from '../../store';

export async function getCategories() {
  const { setCategories } = useProductsCatalogStore.getState();
  await productsCatalogAPI
    .getListCategories()
    .then((res) => setCategories(res))
    .catch(() => {});
}
