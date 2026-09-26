import React, { useEffect } from 'react';
import { CircleAlert, Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import AppTable from '@/shared/AppTable';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

import { getListSalePoints } from '../salePoints.processes';
import { useSalePointsStore } from '../salePoints.store';

const columnsSalePoints = [
  {
    accessorKey: 'name',
    header: 'Название',
    cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
  },
  {
    accessorKey: 'address',
    header: 'Адрес',
    cell: ({ row }) => {
      const address = row.original.address?.locationAddress;

      if (!address) return <span className="text-muted-foreground">—</span>;

      const parts = [address.city && `г. ${address.city}`, address.street, address.building].filter(Boolean);

      return <span>{parts.join(', ')}</span>;
    },
  },
  {
    accessorKey: 'type',
    header: 'Тип',
    cell: ({ row }) => {
      const type = row.original.type;

      return type?.description ? (
        <Badge variant="outline">{type.description}</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    id: 'matrix',
    header: 'Матрица',
    cell: ({ row }) => {
      const matrixName = row.original.deviceProductMatrixPriceList?.matrixName;

      return matrixName ? (
        <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
          {matrixName}
        </Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    id: 'status',
    header: 'Статус',
    cell: ({ row }) => {
      const status = row.original.statusType;

      if (!status?.description) return <span className="text-muted-foreground">—</span>;

      if (status.name === 'active') {
        return (
          <Badge variant="outline" className="border-green-500 bg-green-50 text-green-500">
            {status.description}
          </Badge>
        );
      }

      if (status.name === 'inactive') {
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            {status.description}
          </Badge>
        );
      }

      return (
        <Badge variant="outline" className="border-orange-500 bg-orange-50 text-orange-500">
          {status.description}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Действия',
    cell: () => <Button variant="outline" size="sm">Подробнее</Button>,
  },
];

const SalePointsTable = () => {
  const { salePoints, loading, error } = useSalePointsStore(
    useShallow((state) => ({
      salePoints: state.salePoints,
      loading: state.loading,
      error: state.error,
    })),
  );

  useEffect(() => {
    getListSalePoints();
  }, []);

  return (
    <>
      {loading.list ? (
        <div className="mt-5 flex justify-center">
          <Loader2 className="animate-spin" color="var(--color-primary)" />
        </div>
      ) : error.list ? (
        <div className="mt-5 flex justify-center gap-3">
          <CircleAlert color="var(--color-destructive)" />
          <p className="text-destructive">Ошибка получения торговых точек</p>
        </div>
      ) : (
        <AppTable data={salePoints} columns={columnsSalePoints} />
      )}
    </>
  );
};

export default SalePointsTable;
