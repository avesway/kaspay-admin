import { priceManagementAPI } from '@/api/priceManagement.api';
import { updateProductsBalances } from './productsBalances.actions';

export async function calculationProductPrices(data) {
  await priceManagementAPI
    .calculations(data)
    .then((res) => updateProductsBalances(res))
    .catch((err) => console.log('ERROR priceManagementAPI.calculations', err));
}
