import React, { useEffect, useMemo, useRef } from 'react';
import { differenceInHours, parseISO, format } from 'date-fns';
import AppTable from '@/shared/AppTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Checkbox } from '@/shared/ui/checkbox';
import { useProductsBalancesStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { getProductsBalances, updatePaginationProductsBalances } from '@/actions/productsBalances.actions';
import usePriceBaseProducts from '../hooks/usePriceBaseProducts';
import Pagination from '@/shared/Pagination';
import { priceRoundedRubles } from '@/helpers/priceHelpers';

const PricesBaseProductsList = () => {
  const { productsBalances, pagination } = useProductsBalancesStore(
    useShallow((state) => ({
      productsBalances: state.productsBalances,
      pagination: state.pagination,
    })),
  );

  const { savePriceProduct, activeProduct, updateActiveProduct } = usePriceBaseProducts();

  useEffect(() => {
    getProductsBalances('storageTypes=warehouse&storageTypes=salePoint&storageTypes=device&balanceTypes=inStock');
  }, []);

  const columnsPriceManagement = [
    {
      accessorKey: 'product.name',
      header: 'Полное название',
    },
    {
      accessorKey: 'product.category.name',
      header: 'Категория',
      cell: ({ getValue }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
          {getValue()}
        </span>
      ),
    },
    {
      accessorKey: 'delivery.waybillNumber',
      header: 'Накладная',
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    },
    {
      accessorKey: 'delivery.deliveryDate',
      header: 'Дата накладной',
    },
    {
      accessorKey: 'storageAmount.quantity',
      header: 'Остатки',
      cell: ({ getValue }) => <span>{getValue()} ШТ</span>,
    },
    {
      accessorKey: 'delivery.productionAttributes.expiredAt',
      header: 'Окончание срока годности',
      cell: ({ getValue }) => {
        if (getValue()) {
          const target = parseISO(getValue());
          const now = new Date();
          const hoursLeft = differenceInHours(target, now);
          return (
            <span>
              {format(getValue(), 'dd.MM.yyyy HH:mm')} ({hoursLeft} ч)
            </span>
          );
        }

        return <span>-</span>;
      },
    },
    {
      accessorKey: 'priceAttributes.price',
      header: 'Себестоимость (с НДС)',
      cell: ({ row }) => {
        const priceAttributes = row.original.priceAttributes;
        return (
          <span>
            {priceRoundedRubles(priceAttributes.price)} {priceAttributes.currencyCode}
          </span>
        );
      },
    },
    {
      accessorKey: 'priceAttributes.salePrice',
      header: 'Розничная цена',
      cell: ({ row }) => {
        const originalSalePrice = priceRoundedRubles(row.original.priceAttributes.salePrice);
        const originalDiscountRate = priceRoundedRubles(row.original.priceAttributes.discountRate);
        const originalId = row.original.id;
        const inputRef = useRef(null);

        useEffect(() => {
          if (originalId === activeProduct.productId && inputRef.current && activeProduct.input === 'salePrice') {
            inputRef.current.focus();
          }
        }, [originalId]);

        return (
          <div className="flex flex-col">
            <Input
              ref={inputRef}
              key="sdfsdf"
              className="w-20"
              value={
                originalId === activeProduct.productId && activeProduct.salePrice != null
                  ? activeProduct.salePrice
                  : originalSalePrice
              }
              onChange={({ target }) => {
                updateActiveProduct({
                  productId: originalId,
                  input: 'salePrice',
                  salePrice: +target.value <= 0 ? 0 : +target.value,
                  discountRate: activeProduct.discountRate === null ? originalDiscountRate : activeProduct.discountRate,
                  originalSalePrice:
                    activeProduct.originalSalePrice === null ? originalSalePrice : activeProduct.originalSalePrice,
                  isCalculations: true,
                });
              }}
              type="number"
            />
            {originalId === activeProduct.productId && activeProduct.originalSalePrice != null ? (
              <span className="text-[12px] mt-2">Пред. : {activeProduct.originalSalePrice}</span>
            ) : null}
          </div>
        );
      },
    },
    {
      accessorKey: 'priceAttributes.discountRate',
      header: 'Скидка, %',
      cell: ({ row }) => {
        const originalDiscountRate = priceRoundedRubles(row.original.priceAttributes.discountRate);
        const originalSalePrice = priceRoundedRubles(row.original.priceAttributes.salePrice);
        const originalId = row.original.id;
        const inputRef = useRef(null);

        useEffect(() => {
          if (originalId === activeProduct.productId && inputRef.current && activeProduct.input === 'discountRate') {
            inputRef.current.focus();
          }
        }, [originalId]);

        return (
          <div className="flex flex-col">
            <Input
              ref={inputRef}
              key="sdf"
              className="w-20"
              value={
                originalId === activeProduct.productId && activeProduct.discountRate != null
                  ? activeProduct.discountRate
                  : originalDiscountRate
              }
              onChange={({ target }) => {
                updateActiveProduct({
                  productId: originalId,
                  input: 'discountRate',
                  discountRate: +target.value <= 0 ? 0 : +target.value,
                  originalDiscountRate:
                    activeProduct.originalDiscountRate === null ? originalDiscountRate : activeProduct.originalDiscountRate,
                  salePrice: activeProduct.salePrice === null ? originalSalePrice : activeProduct.salePrice,
                  isCalculations: true,
                });
              }}
              type="number"
            />
            {originalId === activeProduct.productId && activeProduct.originalDiscountRate != null ? (
              <span className="text-[12px] mt-2">Пред. : {activeProduct.originalDiscountRate}</span>
            ) : null}
          </div>
        );
      },
    },
    {
      accessorKey: 'priceAttributes.discount',
      header: 'Скидка',
      cell: ({ row }) => {
        const priceAttributes = row.original.priceAttributes;
        return (
          <span>
            {priceRoundedRubles(priceAttributes.discount)} {priceAttributes.currencyCode}
          </span>
        );
      },
    },
    {
      accessorKey: 'priceAttributes.totalSalePrice',
      header: 'Цена со скидкой',
      cell: ({ row }) => {
        const priceAttributes = row.original.priceAttributes;

        return (
          <span>
            {priceAttributes.discountRate === 0
              ? ''
              : `${priceRoundedRubles(priceAttributes.totalSalePrice)} ${priceAttributes.currencyCode}`}
          </span>
        );
      },
    },
    {
      accessorKey: 'priceAttributes.marginRate',
      header: 'Маржа, %',
      cell: ({ row }) => {
        const originalMarginRate = priceRoundedRubles(row.original.priceAttributes.marginRate);

        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
            {originalMarginRate} %
          </span>
        );
      },
    },
    {
      accessorKey: 'priceAttributes.margin',
      header: 'Маржа, BYN',
      cell: ({ row }) => {
        const currencyCode = row.original.priceAttributes.currencyCode;
        const originalMargin = priceRoundedRubles(row.original.priceAttributes.margin);

        return (
          <span>
            {originalMargin} {currencyCode}
          </span>
        );
      },
    },
    {
      header: 'Сохранить',
      cell: ({ row }) => {
        const originalId = row.original.id;
        // const originalUploadToTerminal = row.original.uploadedToSalePoint;

        const isEqualValuesSaleRate =
          activeProduct.salePrice != null && activeProduct.originalSalePrice != null
            ? activeProduct.salePrice === activeProduct.originalSalePrice
            : true;
        const isEqualValuesDiscountRate =
          activeProduct.discountRate != null && activeProduct.originalDiscountRate != null
            ? activeProduct.discountRate === activeProduct.originalDiscountRate
            : true;
        // const isEqualValuesUploadToTerminal =
        //   activeProduct.uploadToTerminal != null ? activeProduct.uploadToTerminal === originalUploadToTerminal : true;

        //   const isSaved = isEqualValuesDiscountRate && isEqualValuesSaleRate && isEqualValuesUploadToTerminal;
        const isSaved = isEqualValuesDiscountRate && isEqualValuesSaleRate;

        return (
          <Checkbox
            className="w-7 h-7"
            checked={originalId === activeProduct.productId ? isSaved : true}
            disabled={originalId === activeProduct.productId ? isSaved : true}
            onCheckedChange={() => savePriceProduct(row.original)}
          />
        );
      },
    },
    // {
    //   accessorKey: 'uploadedToSalePoint',
    //   header: 'Выгрузить на терминал',
    //   cell: ({ row }) => {
    //     const originalChecked = row.original.uploadedToSalePoint;
    //     const originalId = row.original.id;

    //     return (
    //       <Checkbox
    //         className="w-7 h-7"
    //         checked={
    //           originalId === activeProduct.productId && activeProduct.uploadToTerminal != null
    //             ? activeProduct.uploadToTerminal
    //             : originalChecked
    //         }
    //         onCheckedChange={(v) => {
    //           updateActiveProduct({
    //             productId: originalId,
    //             uploadToTerminal: v,
    //             isCalculations: activeProduct.isCalculations === null ? null : activeProduct.isCalculations,
    //           });
    //         }}
    //       />
    //     );
    //   },
    // },
  ];

  const memoizedColumns = useMemo(() => columnsPriceManagement, [activeProduct]);

  return (
    <Card className="mt-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">Базовые цены</CardTitle>
        <CardDescription>Управление ценами товаров по объектам</CardDescription>
      </CardHeader>
      <CardContent>
        <AppTable data={productsBalances} columns={memoizedColumns} paginationRequest={pagination} />
        <Pagination pagination={pagination} setPagination={updatePaginationProductsBalances} />
      </CardContent>
    </Card>
  );
};

export default PricesBaseProductsList;
