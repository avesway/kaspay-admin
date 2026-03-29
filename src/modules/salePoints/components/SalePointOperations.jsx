import { Loader2, CircleAlert, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { format } from 'date-fns';
import { getOperationsSalePoint, updatePaginationOperationsSalePoint } from '@/actions/salePoints.actions';
import { useSalePointsStore } from '@/store';
import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Pagination from '@/shared/Pagination';
import AppTable from '@/shared/AppTable';
import { cn } from '@/lib/utils';
import { priceRoundedRubles } from '@/helpers/priceHelpers';

const columnsTableOperations = [
  {
    accessorKey: 'id',
    header: 'ID заказа',
  },
  {
    accessorKey: 'createdAt',
    header: 'Создан',
    cell: ({ getValue }) => <span className="text-sm">{format(getValue(), 'dd.MM.yyyy HH:mm')}</span>,
  },
  {
    accessorKey: 'itemData.itemsQuantity',
    header: 'Кол-во товаров',
  },
  {
    accessorKey: 'itemData',
    header: 'Сумма',
    cell: ({ getValue }) => {
      const totalPrice = priceRoundedRubles(getValue().itemsTotalSalePrice).toLocaleString();
      const currencyCode = getValue().currencyCode;

      return (
        <span className="font-medium">
          {totalPrice} {currencyCode}
        </span>
      );
    },
  },
  {
    accessorKey: 'status.statusType',
    header: 'Статус',
    cell: ({ getValue }) => {
      const description = getValue().description;
      const status = getValue().name;

      function checkStatus(status) {
        switch (status) {
          case 'paid':
            return 'text-green-600 bg-green-50';
          case 'delivered':
            return 'text-green-600 bg-green-50';
          case 'refunded':
            return 'text-orange-400 bg-orange-50';
          case 'cancelled':
            return 'text-orange-400 bg-orange-50';
          case 'error':
            return 'text-destructive bg-red-50';
          case 'paymentError':
            return 'text-destructive bg-red-50';
          case 'refundError':
            return 'text-destructive bg-red-50';
          case 'deliveryError':
            return 'text-destructive bg-red-50';
          case 'deviceError':
            return 'text-destructive bg-red-50';
          default:
            return 'text-foreground bg-secondary';
        }
      }

      return (
        <span
          className={cn(
            checkStatus(status),
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-[14px] font-medium  border border-border',
          )}
        >
          {description}
        </span>
      );
    },
  },
];

const SalePointOperations = () => {
  const { activeSalePoint, salePointOperations, loading, error, paginationOperations } = useSalePointsStore(
    useShallow((state) => ({
      activeSalePoint: state.activeSalePoint,
      salePointOperations: state.salePointOperations,
      loading: state.loading,
      error: state.error,
      paginationOperations: state.paginationOperations,
    })),
  );

  useEffect(() => {
    if (activeSalePoint) getOperationsSalePoint(activeSalePoint.id);
  }, [activeSalePoint]);

  return (
    <Card className="mt-10">
      <CardHeader className="flex items-center gap-2 text-2xl">
        <CreditCard className="h-6 w-6 text-primary" />
        <CardTitle className="flex items-center gap-2 text-2xl">Последние операции</CardTitle>
      </CardHeader>
      <CardContent>
        {loading.operations ? (
          <div className="mt-5 flex justify-center">
            <Loader2 className="animate-spin" color="var(--color-primary)" />
          </div>
        ) : error.operations ? (
          <div className="mt-5 flex gap-3 justify-center">
            <CircleAlert color="var(--color-destructive)" />
            <p className="text-destructive">Ошибка получения операций</p>
          </div>
        ) : !salePointOperations.length ? (
          <div className="mt-5 flex justify-center">
            <p>Нет данных</p>
          </div>
        ) : (
          <>
            <AppTable data={salePointOperations} columns={columnsTableOperations} paginationRequest={paginationOperations} />
            <Pagination pagination={paginationOperations} setPagination={updatePaginationOperationsSalePoint} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SalePointOperations;
