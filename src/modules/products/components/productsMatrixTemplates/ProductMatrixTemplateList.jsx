import React, { useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/shared/ui/card';
import AppTable from '@/shared/AppTable';
import Pagination from '@/shared/Pagination';
import { useShallow } from 'zustand/react/shallow';
import { useProductsMatrixTemplatesStore } from '../../store';
import { getMatrixTemplates, setPaginationMatrixTemplates } from '../../actions/matrixTemplates';
import { TEMPLATE_TYPES } from './constants';
import ProductMatrixTemplateUpdate from './ProductMatrixTemplateUpdate';
import ProductMatrixTemplateDelete from './ProductMatrixTemplateDelete';

const ProductMatrixTemplateList = () => {
  const { templates, pagination } = useProductsMatrixTemplatesStore(
    useShallow((state) => ({
      templates: state.templates,
      pagination: state.pagination,
    })),
  );

  useEffect(() => {
    getMatrixTemplates();
  }, []);

  const columns = [
    {
      accessorKey: 'name',
      header: 'Название',
    },
    {
      accessorKey: 'type',
      header: 'Тип',
      cell: ({ getValue }) => {
        const found = TEMPLATE_TYPES.find((t) => t.value === getValue());
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
            {found?.label || getValue()}
          </span>
        );
      },
    },
    {
      accessorKey: 'template',
      header: 'Размер матрицы',
    },
    {
      accessorKey: 'matrixData',
      header: 'Заполнено ячеек',
      cell: ({ getValue }) => <span>{Object.keys(getValue() || {}).length}</span>,
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <ProductMatrixTemplateUpdate template={row.original} />
          <ProductMatrixTemplateDelete template={row.original} />
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="text-sm text-muted-foreground">Всего шаблонов: {pagination.totalItems}</div>
      </CardHeader>
      <CardContent>
        <AppTable data={templates} columns={columns} paginationRequest={pagination} />
        <Pagination pagination={pagination} setPagination={setPaginationMatrixTemplates} />
      </CardContent>
    </Card>
  );
};

export default ProductMatrixTemplateList;
