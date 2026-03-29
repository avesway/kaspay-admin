import { getListSalePoints } from '@/actions/salePoints.actions';
import { getStatisticsOrdersTotal, updateStatisticsFilter } from '@/actions/saleReports.actions';
import { priceRoundedRubles } from '@/helpers/priceHelpers';
import { Card, CardContent } from '@/shared/ui/card';
import { useSaleReportsStore } from '@/store/saleReports.store';
import { DollarSign, Package, ShoppingCart, TrendingUp, Loader2, CircleAlert } from 'lucide-react';
import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

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
      icon: <DollarSign className="h-6 w-6 text-primary" />,
    },
    {
      id: 2,
      title: 'Продано товаров, шт',
      value: 'itemsQuantity',
      isRecalculation: false,
      icon: <ShoppingCart className="h-6 w-6 text-primary" />,
    },
    {
      id: 3,
      title: 'Общая маржа, BYN',
      value: 'itemsMargin',
      isRecalculation: true,
      icon: <Package className="h-6 w-6 text-primary" />,
    },
    {
      id: 4,
      title: 'Средняя маржа, %',
      value: 'averageMarginRate',
      isRecalculation: true,
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <div className="grid gap-6 mt-10 md:grid-cols-2 lg:grid-cols-4">
      {cardsStatistics.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                <p className="text-3xl font-bold mt-3">
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
              <div className="rounded-lg bg-primary/10 p-3">{item.icon}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatisticsSales;
