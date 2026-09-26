import React from 'react';
import { Warehouse } from 'lucide-react';

import { priceRoundedRubles } from '@/helpers/priceHelpers';
import { useSaleReportsStore } from '@/modules/saleReports/saleReports.store';
import { Card } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

function formatStoragePrice(kopecks) {
  const rubles = priceRoundedRubles(kopecks ?? 0);

  if (rubles >= 1000) {
    return `${(rubles / 1000).toFixed(1)}K`;
  }

  return `${Math.round(rubles)}`;
}

const StorageItem = ({ storage, loading }) => {
  const statisticStorageRemainingProducts = useSaleReportsStore((state) => state.statisticStorageRemainingProducts);
  const statistic = statisticStorageRemainingProducts.find((i) => i.storageId === storage.id);

  if (loading) {
    return <Skeleton className="h-[76px] w-full rounded-2xl" />;
  }

  return (
    <Card className="rounded-2xl px-5 py-4 shadow-none">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-11 flex-none items-center justify-center rounded-xl bg-primary/10">
            <Warehouse className="text-primary size-5" />
          </div>
          <div>
            <p className="text-base leading-tight font-medium">{storage.name}</p>
            <p className="text-muted-foreground text-sm">{statistic?.totalQuantity ?? 0} шт</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xl leading-tight font-bold">{formatStoragePrice(statistic?.totalPrice)}</p>
          <p className="text-muted-foreground text-sm">{statistic?.currencyCode ?? 'BYN'}</p>
        </div>
      </div>
    </Card>
  );
};

export default StorageItem;
