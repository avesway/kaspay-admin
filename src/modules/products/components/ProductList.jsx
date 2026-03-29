import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '@/shared/ui/card';
import { cn } from '@/lib/utils';
import AppTable from '@/shared/AppTable';
import ProductDelete from './ProductDelete';
import ProductEdit from './ProductEdit';
import { useProductsStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import Pagination from '@/shared/Pagination';
import { productsAPI } from '@/api/products.api';
import { getProducts, updatePaginationProducts } from '@/actions/products.actions';

const ProductList = () => {
  const { products, pagination } = useProductsStore(
    useShallow((state) => ({
      products: state.products,
      pagination: state.pagination,
    })),
  );

  useEffect(() => {
    getProducts();
  }, []);

  const columns = [
    {
      accessorKey: 'imagePath',
      header: 'Фото',
      cell: ({ row }) => {
        const photo = row.original.imagePath && row.original.imagePath === '-' ? null : row.original.imagePath;
        const fullName = row.original.shortName;

        const [imageUrl, setImageUrl] = useState(null);

        useEffect(() => {
          const loadImage = async () => {
            try {
              const blob = await productsAPI.getImageProduct(photo);
              const url = URL.createObjectURL(blob);
              setImageUrl(url);

              return () => URL.revokeObjectURL(url);
            } catch (error) {
              console.error('Ошибка загрузки:', error);
            }
          };

          if (photo) loadImage();
        }, [photo]);

        return (
          <div className="flex flex-col items-center justify-center w-11 h-11 rounded-md bg-muted border border-border overflow-hidden">
            {photo ? (
              <img src={imageUrl} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <>
                <p className="text-xs text-muted-foreground">нет</p>
                <p className="text-xs text-muted-foreground">фото</p>
              </>
            )}
          </div>
        );
      },
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
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-2">
            <ProductEdit product={product} />
            <ProductDelete product={product} />
          </div>
        );
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="text-sm text-muted-foreground">Всего товаров: {pagination.totalItems}</div>
      </CardHeader>

      <CardContent>
        <AppTable data={products} columns={columns} paginationRequest={pagination} />
        <Pagination pagination={pagination} setPagination={updatePaginationProducts} />
      </CardContent>
    </Card>
  );
};

export default ProductList;
