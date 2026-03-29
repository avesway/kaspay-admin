import { useProductsBalancesStore } from '@/store';
import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import ProductsExpiredItem from './ProductsExpiredItem';
import { Card, CardHeader, CardContent, CardTitle } from '@/shared/ui/card';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Pagination from '@/shared/Pagination';
import { getProductsBalances, updatePaginationProductsBalances } from '@/actions/productsBalances.actions';

const ProductsExpiredList = () => {
  const { productsBalances, loading, pagination } = useProductsBalancesStore(
    useShallow((state) => ({
      productsBalances: state.productsBalances,
      loading: state.loading,
      pagination: state.pagination,
    })),
  );

  useEffect(() => {
    getProductsBalances('daysBeforeExpiration=2');
  }, []);

  return (
    <Card className="mt-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Товары с истекающим сроком годности (≤2 дня)
        </CardTitle>
        <div className="text-sm text-muted-foreground"></div>
      </CardHeader>

      <CardContent>
        {loading.list ? (
          <div className="mt-5 ">
            <Loader2 className="animate-spin" />
          </div>
        ) : productsBalances.length ? (
          <div>
            {productsBalances.map((product) => (
              <ProductsExpiredItem key={product.id} product={product} />
            ))}
            <Pagination pagination={pagination} setPagination={updatePaginationProductsBalances} />
          </div>
        ) : (
          <div className="mt-5 ">
            <p>Товаров нет</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductsExpiredList;
