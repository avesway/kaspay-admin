import React from 'react';
import { CheckCircle, CircleX, Edit } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { cn } from '@/lib/utils';
import AppTable from '@/shared/AppTable';
import Pagination from '@/shared/Pagination';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';

import MatrixDeactivation from './MatrixDeactivation';
import { getProductsCatalog } from '../../productsCatalog/productsCatalog.processes';
import { setPaginationMatricesList } from '../matrices.processes';
import { useMatricesStore } from '../matrices.store';

const MatricesList = () => {
  const navigate = useNavigate();
  const { templates, pagination, typesMatrices, setActiveMatrix, setActiveMatrixRows } = useMatricesStore(
    useShallow((state) => ({
      templates: state.templates,
      pagination: state.pagination,
      typesMatrices: state.typesMatrices,
      setActiveMatrix: state.setActiveMatrix,
      setActiveMatrixRows: state.setActiveMatrixRows,
    })),
  );

  function editingMatrix(matrixId) {
    const activeMatrix = templates.find((template) => template.id === matrixId);

    setActiveMatrix(activeMatrix);
    setActiveMatrixRows(activeMatrix.rows);
    getProductsCatalog();
    navigate(`/products/matrix-templates/${matrixId}`);
  }

  const columns = [
    {
      accessorKey: 'name',
      header: 'Название',
    },
    {
      accessorKey: 'type',
      header: 'Тип',
      cell: ({ getValue }) => {
        const found = typesMatrices.find((t) => t.name === getValue());
        return (
          <span className="bg-secondary text-secondary-foreground border-border inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
            {found?.description || getValue()}
          </span>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Статус',
      cell: ({ getValue }) => {
        return (
          <span
            className={cn(
              getValue() ? 'bg-green-50 text-green-600' : 'text-destructive bg-red-50',
              'border-border inline-flex items-center rounded-full border px-2.5 py-0.5 text-[14px] font-medium',
            )}
          >
            {getValue() ? 'Активен' : 'Деактивирован'}
          </span>
        );
      },
    },
    {
      accessorKey: 'hasActivePriceLists',
      header: 'Исп. Прайс лист',
      cell: ({ getValue }) => {
        return getValue() ? <CheckCircle color="var(--color-green-500)" /> : <CircleX color="var(--color-destructive)" />;
      },
    },
    {
      accessorKey: 'hasAttachedDevices',
      header: 'Исп. на устройстве',
      cell: ({ getValue }) => {
        return getValue() ? <CheckCircle color="var(--color-green-500)" /> : <CircleX color="var(--color-destructive)" />;
      },
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => editingMatrix(row.original.id)}>
            <Edit className="size-4" />
          </Button>
          <MatrixDeactivation
            matrixId={row.original.id}
            hasActivePriceLists={row.original.hasActivePriceLists}
            hasAttachedDevices={row.original.hasAttachedDevices}
          />
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="text-muted-foreground text-sm">Всего шаблонов: {pagination.totalItems}</div>
      </CardHeader>
      <CardContent>
        <AppTable data={templates} columns={columns} paginationRequest={pagination} />
        <Pagination pagination={pagination} setPagination={setPaginationMatricesList} />
      </CardContent>
    </Card>
  );
};

export default MatricesList;
