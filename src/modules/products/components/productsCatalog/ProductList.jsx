import React, { useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/shared/ui/card';
import { cn } from '@/lib/utils';
import AppTable from '@/shared/AppTable';
import ProductDelete from './ProductDelete';
import ProductImageCell from './ProductImageCell';
import { useShallow } from 'zustand/react/shallow';
import Pagination from '@/shared/Pagination';
import { useProductsCatalogStore } from '@/modules/products/store';
import ProductUpdate from './ProductUpdate';
import { getProductsCatalog, setPaginationProducts } from '../../actions/catalog';

const ProductList = () => {
  const { products, pagination } = useProductsCatalogStore(
    useShallow((state) => ({
      products: state.products,
      pagination: state.pagination,
    })),
  );

  useEffect(() => {
    getProductsCatalog();
  }, []);

  const columns = [
    {
      accessorKey: 'imagePath',
      header: 'Фото',
      cell: ({ row }) => <ProductImageCell imagePath={row.original.imagePath} alt={row.original.shortName} />,
    },
    {
      accessorKey: 'barcode',
      header: 'Штрихкод',
      cell: ({ getValue }) => <span className="font-mono text-sm">{getValue()}</span>,
    },
    {
      accessorKey: 'name',
      header: 'Полное название',
      cell: ({ getValue }) => <span className="text-sm">{getValue()}</span>,
    },
    {
      accessorKey: 'category.name',
      header: 'Категория',
      cell: ({ getValue }) => (
        <span
          className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            'bg-secondary text-secondary-foreground border border-border',
          )}
        >
          {getValue()}
        </span>
      ),
    },
    {
      header: 'КБЖУ',
      cell: ({ row }) => {
        const macronutrients = row.original.macronutrients;
        return (
          <div className="text-xs space-y-0.5">
            <div>К: {macronutrients?.calories || 0} ккал</div>
            <div className="text-muted-foreground">
              Б: {macronutrients?.proteins || 0}г Ж: {macronutrients?.fat || 0}г У: {macronutrients?.carbohydrates || 0}г
            </div>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <ProductUpdate product={row.original} />
          <ProductDelete product={row.original} />
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="text-sm text-muted-foreground">Всего товаров: {pagination.totalItems}</div>
      </CardHeader>
      <CardContent>
        <AppTable data={products} columns={columns} paginationRequest={pagination} />
        <Pagination pagination={pagination} setPagination={setPaginationProducts} />
      </CardContent>
    </Card>
  );
};

export default ProductList;
