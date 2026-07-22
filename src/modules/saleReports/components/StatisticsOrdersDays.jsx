import React from 'react';
import { format, parse } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CircleAlert, Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { priceRoundedRubles } from '@/helpers/priceHelpers';
import { cn } from '@/lib/utils';
import Pagination from '@/shared/Pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

import { updatePaginationStatisticsOrderDays } from '../saleReports.processes';
import { useSaleReportsStore } from '../saleReports.store';

const StatisticsOrdersDays = () => {
  const { statisticOrderDays, paginationOrderDays, loading, error } = useSaleReportsStore(
    useShallow((state) => ({
      statisticOrderDays: state.statisticOrderDays,
      paginationOrderDays: state.paginationOrderDays,
      loading: state.loading,
      error: state.error,
    })),
  );

  return (
    <Card className="w-[49%] max-lg:w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">Продажи по дням</CardTitle>
      </CardHeader>
      <CardContent>
        {loading.orderDays ? (
          <div className="mt-5 flex justify-center">
            <Loader2 className="animate-spin" color="var(--color-primary)" />
          </div>
        ) : error.orderDays ? (
          <div className="mt-5 flex justify-center gap-3">
            <CircleAlert color="var(--color-destructive)" />
            <p className="text-destructive">Ошибка получения статистики</p>
          </div>
        ) : !statisticOrderDays.length ? (
          <div className="mt-5 flex justify-center">
            <p>Нет данных</p>
          </div>
        ) : (
          <>
            {statisticOrderDays.map((item) => (
              <div key={item.reportDate} className="border-foreground/30 mb-3 flex justify-between rounded-2xl border p-3">
                <div className="flex flex-col gap-1">
                  <p className="font-medium">
                    {item.reportDate
                      ? format(parse(item.reportDate, 'yyyy-MM-dd', new Date()), 'EEEE, d MMMM', { locale: ru })
                      : ''}
                  </p>
                  <p className="text-foreground/70 text-[14px]">{item.itemsQuantity} товаров</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xl font-bold">
                    {priceRoundedRubles(item.itemsTotalSalePrice).toLocaleString()} {item.currencyCode}
                  </p>
                  <p
                    className={cn(
                      priceRoundedRubles(item?.averageMarginRate) > 0 ? 'text-green-600' : 'text-destructive',
                      'text-[14px]',
                    )}
                  >
                    {priceRoundedRubles(item?.averageMarginRate)}% маржа
                  </p>
                </div>
              </div>
            ))}
            <Pagination pagination={paginationOrderDays} setPagination={updatePaginationStatisticsOrderDays} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticsOrdersDays;
