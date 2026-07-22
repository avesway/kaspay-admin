import React from 'react';
import { differenceInHours, format, parseISO } from 'date-fns';

const ProductsExpiredItem = ({ product }) => {
  return (
    <div className="mb-3 flex cursor-pointer items-center justify-between rounded-lg border bg-amber-100 p-4 transition-all hover:scale-[1.01] hover:shadow-md max-sm:flex-col max-sm:gap-5">
      <div className="flex w-full items-center justify-between">
        <div className="flex-1">
          <p className="font-medium">{product.product.name}</p>
          <p className="opasity-80 text-sm">{product?.storageAmount?.storage?.name}</p>
        </div>
        <div className="ml-auto px-4 text-center">
          <p className="text-sm font-medium">{product?.storageAmount?.quantity} шт</p>
        </div>
      </div>
      <div className="min-w-[150px] text-right">
        <p className="font-semibold">
          Осталось:{' '}
          {product.delivery?.productionAttributes?.expiredAt
            ? `${differenceInHours(parseISO(product.delivery.productionAttributes.expiredAt), new Date())} ч`
            : '-'}
        </p>
        <p className="text-xs opacity-80">
          {product.delivery?.productionAttributes?.expiredAt
            ? `до ${format(product.delivery.productionAttributes.expiredAt, 'dd.MM.yyyy HH:mm')}`
            : ''}
        </p>
      </div>
    </div>
  );
};

export default ProductsExpiredItem;
