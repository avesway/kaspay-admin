import React, { useEffect } from 'react';
import { CircleAlert, DollarSign, Loader2, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { priceRoundedRubles } from '@/helpers/priceHelpers';
import { getListSalePoints } from '@/modules/salePoints/salePoints.processes';
import { useSaleReportsStore } from '@/modules/saleReports/saleReports.store';
import { Card, CardContent } from '@/shared/ui/card';

import { getStatisticsOrdersTotal, updateStatisticsFilter } from '../saleReports.processes';

const StatisticsSales = ({ isFilter }) => {
  const { statisticOrdersTotal, loading, error } = useSaleReportsStore(
    useShallow((state) => ({
      statisticOrdersTotal: state.statisticOrdersTotal,
      loading: state.loading,
      error: state.error,
    })),
  );

  useEffect(() => {
    const prepare = async () => {
      const salePoints = await getListSalePoints();
      if (salePoints.length) updateStatisticsFilter({ salePointIds: salePoints[0].id });
    };

    isFilter ? prepare() : getStatisticsOrdersTotal();
  }, []);

  const cardsStatistics = [
    {
      id: 1,
      title: 'Общая выручка, BYN',
      value: 'itemsTotalSalePrice',
      isRecalculation: true,
      icon: <DollarSign className="text-primary h-6 w-6" />,
    },
    {
      id: 2,
      title: 'Продано товаров, шт',
      value: 'itemsQuantity',
      isRecalculation: false,
      icon: <ShoppingCart className="text-primary h-6 w-6" />,
    },
    {
      id: 3,
      title: 'Общая маржа, BYN',
      value: 'itemsMargin',
      isRecalculation: true,
      icon: <Package className="text-primary h-6 w-6" />,
    },
    {
      id: 4,
      title: 'Средняя маржа, %',
      value: 'averageMarginRate',
      isRecalculation: true,
      icon: <TrendingUp className="text-primary h-6 w-6" />,
    },
  ];

  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cardsStatistics.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm font-medium">{item.title}</p>
                <p className="mt-3 text-3xl font-bold">
                  {loading.ordersTotal ? (
                    <Loader2 className="animate-spin" color="var(--color-primary)" />
                  ) : error.ordersTotal ? (
                    <CircleAlert color="var(--color-destructive)" />
                  ) : item.isRecalculation ? (
                    priceRoundedRubles(statisticOrdersTotal[item.value]).toLocaleString()
                  ) : (
                    statisticOrdersTotal[item.value]
                  )}
                </p>
              </div>
              <div className="bg-primary/10 rounded-lg p-3">{item.icon}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatisticsSales;
