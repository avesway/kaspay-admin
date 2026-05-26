import { priceManagementAPI } from '../../api';
import { updateProductBalances } from '@/modules/products/actions/balances';

export async function calculationProductPrices(data) {
  await priceManagementAPI
    .calculations(data)
    .then((res) => updateProductBalances(res))
    .catch((err) => console.log('ERROR priceManagementAPI.calculations', err));
}
