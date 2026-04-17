import { Loader2, CircleAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import React from 'react';
import AppTable from '@/shared/AppTable';
import { useSaleReportsStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import Pagination from '@/shared/Pagination';
import { updatePaginationStatisticsTopProducts } from '@/actions/saleReports.actions';
import { priceRoundedRubles } from '@/helpers/priceHelpers';

const columnsProducts = [
  {
    accessorKey: 'shortName',
    header: 'Товар',
  },
  {
    accessorKey: 'itemsQuantity',
    header: 'Продано',
  },
  {
    accessorKey: 'itemsTotalSalePrice',
    header: 'Выручка',
    cell: ({ getValue }) => <span className="text-sm">{priceRoundedRubles(getValue()).toLocaleString()}</span>,
  },
  {
    accessorKey: 'averageMarginRate',
    header: 'Маржа',
    cell: ({ getValue }) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
        {priceRoundedRubles(getValue())}%
      </span>
    ),
  },
];

const StatisticsOrdersTopProducts = () => {
  const { paginationTopProducts, statisticOrderTopProducts, loading, error } = useSaleReportsStore(
    useShallow((state) => ({
      paginationTopProducts: state.paginationTopProducts,
      statisticOrderTopProducts: state.statisticOrderTopProducts,
      loading: state.loading,
      error: state.error,
    })),
  );

  return (
    <Card className="w-[49%] max-lg:w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">Топ товары</CardTitle>
      </CardHeader>
      <CardContent>
        {loading.orderTopProducts ? (
          <div className="mt-5 flex justify-center">
            <Loader2 className="animate-spin" color="var(--color-primary)" />
          </div>
        ) : error.orderTopProducts ? (
          <div className="mt-5 flex gap-3 justify-center">
            <CircleAlert color="var(--color-destructive)" />
            <p className="text-destructive">Ошибка получения статистики</p>
          </div>
        ) : (
          <>
            <AppTable data={statisticOrderTopProducts} columns={columnsProducts} paginationRequest={paginationTopProducts} />
            <Pagination pagination={paginationTopProducts} setPagination={updatePaginationStatisticsTopProducts} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticsOrdersTopProducts;
