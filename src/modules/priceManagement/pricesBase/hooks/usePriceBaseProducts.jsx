import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { priceRoundedKopecks } from '@/helpers/priceHelpers';
import { updateProductBalances } from '@/modules/products/productsBalances/productsBalances.processes';

import { calculationProductPrices } from '../priceBase.processes';
import { usePriceBaseStore } from '../priceBase.store';

const usePriceBaseProducts = () => {
  const { activeProduct, updateActiveProduct } = usePriceBaseStore(
    useShallow((state) => ({ activeProduct: state.activeProduct, updateActiveProduct: state.updateActiveProduct })),
  );

  useEffect(() => {
    if (activeProduct.productId && activeProduct.isCalculations) {
      const data = {
        balanceId: activeProduct.productId,
        discountRate: priceRoundedKopecks(activeProduct.discountRate),
        salePrice: priceRoundedKopecks(activeProduct.salePrice),
      };
      calculationProductPrices(data);
    }
  }, [activeProduct]);

  const savePriceProduct = async (product) => {
    const data = {
      //  uploadToTerminal: activeProduct.uploadToTerminal != null ? activeProduct.uploadToTerminal : product.uploadedToSalePoint,
      priceAttributes: {
        discountRate:
          activeProduct.discountRate != null
            ? priceRoundedKopecks(activeProduct.discountRate)
            : product.priceAttributes.discountRate,
        salePrice:
          activeProduct.salePrice != null ? priceRoundedKopecks(activeProduct.salePrice) : product.priceAttributes.salePrice,
      },
    };

    await updateProductBalances(activeProduct.productId, data);
  };

  return {
    savePriceProduct,
    activeProduct,
    updateActiveProduct,
  };
};

export default usePriceBaseProducts;
