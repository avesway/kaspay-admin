import { updateProductBalances } from '@/modules/products/productsBalances/productsBalances.processes';

import { priceBaseAPI } from './priceBase.api';

export async function calculationProductPrices(data) {
  await priceBaseAPI
    .calculations(data)
    .then((res) => updateProductBalances(res))
    .catch((err) => console.log('ERROR priceManagementAPI.calculations', err));
}
