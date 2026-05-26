import React, { useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/shared/ui/card';
import AppTable from '@/shared/AppTable';
import Pagination from '@/shared/Pagination';
import { useShallow } from 'zustand/react/shallow';
import { usePriceListsStore } from '../../store';
import { getPriceLists, setPaginationPriceLists } from '../../actions/priceLists';
import PriceListUpdate from './PriceListUpdate';
import PriceListDelete from './PriceListDelete';

const PriceListsList = () => {
  const { priceLists, pagination } = usePriceListsStore(
    useShallow((state) => ({
      priceLists: state.priceLists,
      pagination: state.pagination,
    })),
  );

  useEffect(() => {
    getPriceLists();
  }, []);

  const columns = [
    {
      accessorKey: 'name',
      header: 'Имя',
    },
    {
      accessorKey: 'description',
      header: 'Описание',
      cell: ({ getValue }) => <span>{getValue() || '-'}</span>,
    },
    {
      accessorKey: 'currencyCode',
      header: 'Основная валюта',
      cell: ({ row, getValue }) => <span>{getValue() || row.original.baseCurrency || '-'}</span>,
    },
    {
      accessorKey: 'products',
      header: 'Продукты',
      cell: ({ getValue }) => <span>{getValue()?.length || 0}</span>,
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <PriceListUpdate priceList={row.original} />
          <PriceListDelete priceList={row.original} />
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="text-sm text-muted-foreground">Всего прайс листов: {pagination.totalItems}</div>
      </CardHeader>
      <CardContent>
        <AppTable data={priceLists} columns={columns} paginationRequest={pagination} />
        <Pagination pagination={pagination} setPagination={setPaginationPriceLists} />
      </CardContent>
    </Card>
  );
};

export default PriceListsList;
