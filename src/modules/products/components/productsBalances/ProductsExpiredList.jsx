import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import ProductsExpiredItem from './ProductsExpiredItem';
import { Card, CardHeader, CardContent, CardTitle } from '@/shared/ui/card';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Pagination from '@/shared/Pagination';
import { useProductsBalancesStore } from '@/store';
import { getProductsBalances, setPaginationProductsBalances } from '../../actions/balances';

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
        <CardTitle className="flex items-center gap-2 text-2xl max-sm:text-xl max-sm:flex-col max-sm:gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive max-sm:h-7 max-sm:w-7" />
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
