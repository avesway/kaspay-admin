import React, { useEffect } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import Pagination from '@/shared/Pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

import ProductsExpiredItem from './ProductsExpiredItem';
import { getProductsBalances, setPaginationProductsBalances } from '../productsBalances.processes';
import { useProductsBalancesStore } from '../productsBalances.store';

const ProductsExpiredList = () => {
  const { productsBalances, loading, pagination, setParamsRequest } = useProductsBalancesStore(
    useShallow((state) => ({
      productsBalances: state.productsBalances,
      loading: state.loading,
      pagination: state.pagination,
      setParamsRequest: state.setParamsRequest,
    })),
  );

  useEffect(() => {
    setParamsRequest('balanceTypes=inStock&daysBeforeExpiration=2');
    getProductsBalances();
  }, []);

  return (
    <Card className="mt-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl max-sm:flex-col max-sm:gap-3 max-sm:text-xl">
          <AlertTriangle className="text-destructive h-5 w-5 max-sm:h-7 max-sm:w-7" />
          Товары с истекающим сроком годности (≤2 дня)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading.list ? (
          <div className="mt-5">
            <Loader2 className="animate-spin" />
          </div>
        ) : productsBalances.length ? (
          <div>
            {productsBalances.map((product) => (
              <ProductsExpiredItem key={product.id} product={product} />
            ))}
            <Pagination pagination={pagination} setPagination={setPaginationProductsBalances} />
          </div>
        ) : (
          <div className="mt-5">
            <p>Товаров нет</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductsExpiredList;
