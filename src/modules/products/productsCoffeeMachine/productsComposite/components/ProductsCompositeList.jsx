import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { cn } from '@/lib/utils';
import AppTable from '@/shared/AppTable';
import Pagination from '@/shared/Pagination';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';

import ProductImageCell from '../../../productsSingle/catalog/components/ProductImageCell';
import { getProductsComposite, setPaginationProductsComposite } from '../productsComposite.processes';
import { useProductsCompositeStore } from '../productsComposite.store';

const ProductsCompositeList = ({ purposeTypes }) => {
  const { products, pagination, setPagination } = useProductsCompositeStore(
    useShallow((state) => ({
      products: state.products,
      pagination: state.pagination,
      setPagination: state.setPagination,
    })),
  );

  useEffect(() => {
    setPagination({ page: 1 });
    getProductsComposite(purposeTypes);
  }, [purposeTypes]);

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
      header: 'Название',
      cell: ({ getValue }) => <span className="text-sm">{getValue()}</span>,
    },
    {
      accessorKey: 'category.name',
      header: 'Категория',
      cell: ({ getValue }) => (
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
            'bg-secondary text-secondary-foreground border-border border',
          )}
        >
          {getValue()}
        </span>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="text-muted-foreground text-sm">Всего товаров: {pagination.totalItems}</div>
      </CardHeader>
      <CardContent>
        <AppTable data={products} columns={columns} paginationRequest={pagination} />
        <Pagination pagination={pagination} setPagination={setPaginationProductsComposite} />
      </CardContent>
    </Card>
  );
};

export default ProductsCompositeList;
