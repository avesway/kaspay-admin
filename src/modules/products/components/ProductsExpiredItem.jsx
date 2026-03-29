import React from 'react';
import { differenceInHours, parseISO, format } from 'date-fns';

const ProductsExpiredItem = ({ product }) => {
  return (
    <div
      className={`flex items-center mb-3 justify-between rounded-lg border bg-amber-100 p-4 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md `}
      //  onClick={() => handleProductClick(item)}
    >
      <div className="flex-1">
        <p className="font-medium">{product.product.name}</p>
        <p className="text-sm opasity-80">{product?.storageAmount?.storage?.name}</p>
      </div>
      <div className="text-center px-4">
        <p className="text-sm font-medium">{product?.storageAmount?.quantity} шт</p>
        {/* {item.discount && item.discount > 0 ? (
          <div className="flex items-center gap-1 text-xs">
            <span className="line-through opacity-60">{item.shelfPrice} BYN</span>
            <span className="font-semibold">{discountedPrice?.toFixed(0)} BYN</span>
            <span className="bg-primary/20 text-primary px-1 rounded">-{item.discount}%</span>
          </div>
        ) : (
          <p className="text-xs opacity-70">{item.shelfPrice} BYN</p>
        )} */}
      </div>
      <div className="text-right min-w-[150px]">
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
