import React from 'react';
import { Package } from 'lucide-react';

import { priceRoundedRubles } from '@/helpers/priceHelpers';
import { useSaleReportsStore } from '@/modules/saleReports/saleReports.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

const StorageItem = ({ storage, loading }) => {
  const statisticStorageRemainingProducts = useSaleReportsStore((state) => state.statisticStorageRemainingProducts);

  return (
    <Card className="w-[30%] max-sm:w-full">
      {loading ? (
        <Skeleton className="bg-gray-60 shadow-primary h-20 w-full rounded-2xl p-5" />
      ) : (
        <>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="text-primary h-5 w-5" />
              {storage.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-muted-foreground text-sm">Расположение</p>
              <p className="font-medium">
                {storage.address?.country ? `${storage.address.country}, ` : ''}
                {storage.address?.region ? `${storage.address.region}, ` : ''}
                {storage.address?.city ? `г. ${storage.address.city}, ` : ''}
                {storage.address?.street ? `${storage.address.street} ` : ''}
                {storage.address?.building ? `${storage.address.building}` : ''}
              </p>
            </div>
            <div className="flex justify-between">
              {statisticStorageRemainingProducts.length ? (
                <>
                  <div>
                    <p className="text-muted-foreground text-sm">Всего товаров</p>
                    <p className="text-2xl font-bold">
                      {statisticStorageRemainingProducts.find((i) => i.storageId === storage.id)?.totalQuantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-sm">Общая стоимость</p>
                    <p className="text-2xl font-bold">
                      {priceRoundedRubles(
                        statisticStorageRemainingProducts.find((i) => i.storageId === storage.id)?.totalPrice,
                      ).toFixed(0)}{' '}
                      {statisticStorageRemainingProducts.find((i) => i.storageId === storage.id)?.currencyCode}
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default StorageItem;
