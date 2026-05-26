import { productsBalancesAPI } from '../../api/productsBalances.api';
import { usePriceManagementStore } from '@/modules/priceManagement/store';
import { toast } from 'sonner';
import { getProductsBalances } from './getProductsBalances';

export async function updatePriceProductBalance(productId, data) {
  const { updateActiveProduct } = usePriceManagementStore.getState();

  await productsBalancesAPI
    .savePrice(productId, data)
    .then(() => {
      getProductsBalances();
      updateActiveProduct({
        productId: null,
        input: '',
        discountRate: null,
        salePrice: null,
        uploadToTerminal: null,
        originalDiscountRate: null,
        originalSalePrice: null,
        isCalculations: null,
      });
      toast.success('Продукт успешно изменен', { position: 'top-center' });
    })
    .catch(() => {
      toast.error('Ошибка сохранения', { position: 'top-center' });
    });
}
