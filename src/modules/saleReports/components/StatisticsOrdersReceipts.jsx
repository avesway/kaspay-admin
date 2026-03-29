import { Loader2, CircleAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { format } from 'date-fns';
import React from 'react';
import AppTable from '@/shared/AppTable';
import { useSaleReportsStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import Pagination from '@/shared/Pagination';
import { updatePaginationStatisticsOrderReceipts } from '@/actions/saleReports.actions';
import { priceRoundedRubles } from '@/helpers/priceHelpers';

const yy = {
  orderId: '260311-890545',
  orderAt: '2026-03-11T22:43:28.576+03:00',
  salePointId: 597,
  salePointName: 'Точка 1',
  itemsQuantity: 1,
  itemsTotalSalePrice: 2000,
  averageDiscountRate: 0,
  itemsDiscount: 0,
  averageMarginRate: 6667,
  itemsMargin: 800,
  currencyCode: 'BYN',
};

const columnsTable = [
  {
    accessorKey: 'salePointName',
    header: 'Точка продажи',
    cell: ({ getValue }) => <span className="">{getValue()}</span>,
  },
  {
    accessorKey: 'orderAt',
    header: 'Дата и время чека',
    cell: ({ getValue }) => <span className="text-sm">{format(getValue(), 'dd.MM.yyyy HH:mm')}</span>,
  },
  {
    accessorKey: 'itemsQuantity',
    header: 'Кол-во позиций',
  },
  {
    accessorKey: 'itemsTotalSalePrice',
    header: 'Стоимость',
    cell: ({ row }) => {
      const totalPrice = priceRoundedRubles(row.original.itemsTotalSalePrice).toLocaleString();
      const currencyCode = row.original.currencyCode;

      return (
        <span className="font-medium">
          {totalPrice} {currencyCode}
        </span>
      );
    },
  },
  {
    accessorKey: 'itemsDiscount',
    header: 'Скидка',
    cell: ({ row }) => {
      const totalPrice = row.original.itemsDiscount > 0 ? priceRoundedRubles(row.original.itemsDiscount).toLocaleString() : '';
      const currencyCode = row.original.currencyCode;

      return <span className="font-medium">{totalPrice ? `${totalPrice} ${currencyCode}` : '--'}</span>;
    },
  },
  {
    accessorKey: 'averageMarginRate',
    header: 'Маржа, %',
    cell: ({ getValue }) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
        {priceRoundedRubles(getValue())}%
      </span>
    ),
  },
  {
    accessorKey: 'itemsMargin',
    header: 'Маржа, BYN',
    cell: ({ row }) => {
      const totalPrice = priceRoundedRubles(row.original.itemsMargin).toLocaleString();
      const currencyCode = row.original.currencyCode;

      return (
        <span className="font-medium">
          {totalPrice} {currencyCode}
        </span>
      );
    },
  },
];

const StatisticsOrdersReceipts = () => {
  const { paginationReceipts, statisticOrderReceipts, loading, error } = useSaleReportsStore(
    useShallow((state) => ({
      paginationReceipts: state.paginationReceipts,
      statisticOrderReceipts: state.statisticOrderReceipts,
      loading: state.loading,
      error: state.error,
    })),
  );

  return (
    <Card className="mt-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">Детализация по чекам</CardTitle>
      </CardHeader>
      <CardContent>
        {loading.orderReceipts ? (
          <div className="mt-5 flex justify-center">
            <Loader2 className="animate-spin" color="var(--color-primary)" />
          </div>
        ) : error.orderReceipts ? (
          <div className="mt-5 flex gap-3 justify-center">
            <CircleAlert color="var(--color-destructive)" />
            <p className="text-destructive">Ошибка получения статистики</p>
          </div>
        ) : (
          <>
            <AppTable data={statisticOrderReceipts} columns={columnsTable} paginationRequest={paginationReceipts} />
            <Pagination pagination={paginationReceipts} setPagination={updatePaginationStatisticsOrderReceipts} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticsOrdersReceipts;
