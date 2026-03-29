import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Package } from 'lucide-react';
import { Skeleton } from '@/shared/ui/skeleton';
import React from 'react';
import { useSaleReportsStore } from '@/store';
import { priceRoundedRubles } from '@/helpers/priceHelpers';

const StorageItem = ({ storage, loading }) => {
  const statisticStorageRemainingProducts = useSaleReportsStore((state) => state.statisticStorageRemainingProducts);

  return (
    <Card className="w-[30%]">
      {loading ? (
        <Skeleton className="w-full h-20 bg-gray-60 shadow-primary p-5 rounded-2xl" />
      ) : (
        <>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-primary" />
              {storage.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Расположение</p>
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
                    <p className="text-sm text-muted-foreground">Всего товаров</p>
                    <p className="text-2xl font-bold">
                      {statisticStorageRemainingProducts.find((i) => i.storageId === storage.id)?.totalQuantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Общая стоимость</p>
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
