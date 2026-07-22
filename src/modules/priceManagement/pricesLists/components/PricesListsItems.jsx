import React, { useEffect } from 'react';
import { CircleAlert, Edit, Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { cn } from '@/lib/utils';
import { useMatricesStore } from '@/modules/products/matrices/matrices.store';
import AppTable from '@/shared/AppTable';
import Pagination from '@/shared/Pagination';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';

import PriceListDeactivation from './PriceListDeactivation';
import { getPricesListsItems, setPaginationPricesLists } from '../pricesLists.processes';
import { usePricesListsStore } from '../pricesLists.store';

const PricesListsItems = ({ setOpenForm }) => {
  const templates = useMatricesStore((state) => state.templates);
  const { pricesLists, setActivePriceList, pagination, loading, error } = usePricesListsStore(
    useShallow((state) => ({
      pricesLists: state.pricesLists,
      setActivePriceList: state.setActivePriceList,
      pagination: state.pagination,
      loading: state.loading,
      error: state.error,
    })),
  );

  useEffect(() => {
    getPricesListsItems();
  }, []);

  const columns = [
    {
      accessorKey: 'name',
      header: 'Название',
    },
    {
      accessorKey: 'matrixId',
      header: 'Матрица',
      cell: ({ getValue }) => {
        const found = templates.find((t) => t.id === getValue());
        return (
          <span className="bg-secondary text-secondary-foreground border-border inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
            {found?.name || getValue()}
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
      accessorKey: 'currencyCode',
      header: 'Основная валюта',
      cell: ({ row, getValue }) => <span>{getValue() || row.original.currencyCode || '-'}</span>,
    },
    {
      accessorKey: 'items',
      header: 'Кол. продуктов',
      cell: ({ row, getValue }) => <span>{getValue()?.length || '-'}</span>,
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setActivePriceList(pricesLists.find((list) => list.id === row.original.id));
              setOpenForm(true);
            }}
          >
            <Edit className="size-4" />
          </Button>

          <PriceListDeactivation priceListId={row.original.id} />
        </div>
      ),
    },
  ];

  if (loading.list)
    return (
      <div className="mt-10 flex justify-center">
        <Loader2 className="animate-spin" color="var(--color-primary)" />
      </div>
    );

  if (error.list)
    return (
      <div className="mt-10 flex justify-center gap-5">
        <CircleAlert color="var(--color-destructive)" />
        <p className="text-destructive">Ошибка получения прайс листов</p>
      </div>
    );

  return (
    <Card>
      <CardHeader>
        {pricesLists.length ? (
          <div className="text-muted-foreground text-sm">Всего прайс листов: {pagination.totalItems}</div>
        ) : null}
      </CardHeader>
      <CardContent>
        {pricesLists.length ? (
          <>
            <AppTable data={pricesLists} columns={columns} paginationRequest={pagination} />
            <Pagination pagination={pagination} setPagination={setPaginationPricesLists} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="text-muted-foreground">Нет созданных прайс листов</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PricesListsItems;
