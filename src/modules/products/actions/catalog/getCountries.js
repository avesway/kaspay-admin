import { productsCatalogAPI } from '../../api/productsCatalog.api';
import { useProductsCatalogStore } from '../../store';

export async function getCountries() {
  const { setCountries } = useProductsCatalogStore.getState();
  await productsCatalogAPI
    .getListCountries()
    .then((res) => setCountries(res))
    .catch(() => {});
}
