import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { AlertTriangle, CircleAlert, Loader2, Package, PackageX, TrendingDown, Warehouse } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import AppTable from '@/shared/AppTable';
import Pagination from '@/shared/Pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

import StorageBalanceOperationProduct from '../../../storages/components/StorageBalanceOperationProduct';
import StorageDeviceMovingProduct from '../../../storages/components/StorageDeviceMovingProduct';
import StorageMovingProduct from '../../../storages/components/StorageMovingProduct';
import { getProductsBalances, setPaginationProductsBalances } from '../productsBalances.processes';
import { useProductsBalancesStore } from '../productsBalances.store';

const columnsProducts = [
  {
    accessorKey: 'product.name',
    header: 'Наименование товара',
  },
  {
    accessorKey: 'storageAmount.storage.name',
    header: 'Склад',
  },
  {
    accessorKey: 'delivery.waybillNumber',
    header: 'Накладная',
  },
  {
    accessorKey: 'delivery.deliveryDate',
    header: 'Дата накладной',
    cell: ({ getValue }) => <span className="text-sm">{getValue()}</span>,
  },
  {
    accessorKey: 'storageAmount.quantity',
    header: 'Остаток',
  },
  {
    accessorKey: 'delivery',
    header: 'Окончание срока годности',
    cell: ({ getValue }) =>
      getValue()?.productionAttributes?.expiredAt ? (
        <span className="text-sm">{format(getValue()?.productionAttributes?.expiredAt, 'dd.MM.yyyy HH:mm')}</span>
      ) : (
        '-'
      ),
  },
];

const columnsProductsMain = [
  ...columnsProducts,
  {
    id: 'actions',
    header: 'Действия',
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex flex-row gap-3">
          <StorageMovingProduct product={product} />
          <StorageDeviceMovingProduct product={product} />
          <StorageBalanceOperationProduct product={product} />
        </div>
      );
    },
  },
];

const columnsProductsSalePoint = [
  ...columnsProducts,
  {
    id: 'actions',
    header: 'Действия',
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex flex-row gap-3">
          <StorageDeviceMovingProduct product={product} />
        </div>
      );
    },
  },
];

const columnsProductsDevice = [
  ...columnsProducts,
  {
    id: 'actions',
    header: 'Действия',
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex flex-row gap-3">
          <StorageBalanceOperationProduct product={product} />
        </div>
      );
    },
  },
];

const tabs = [
  {
    id: 1,
    tab: 'warehouse',
    icon: Warehouse,
    className: 'text-primary',
    nameTab: 'Основной склад',
    nameTable: 'Основной склад',
    storageTypes: ['warehouse'],
    balanceTypes: 'inStock',
    columnsTable: columnsProductsMain,
  },
  {
    id: 2,
    tab: 'salePoint',
    icon: Package,
    className: 'text-primary',
    nameTab: 'Точки продаж',
    nameTable: 'Точки продаж',
    storageTypes: ['salePoint'],
    balanceTypes: 'inStock',
    columnsTable: columnsProductsSalePoint,
  },
  {
    id: 3,
    tab: 'device',
    icon: Package,
    className: 'text-primary',
    nameTab: 'Устройства',
    nameTable: 'Устройства продаж',
    storageTypes: ['device'],
    balanceTypes: 'inStock',
    columnsTable: columnsProductsDevice,
  },
  {
    id: 4,
    tab: 'expiration',
    icon: TrendingDown,
    className: 'text-orange-500',
    nameTab: 'Просрочен',
    nameTable: 'Просроченный товар',
    storageTypes: ['warehouse'],
    balanceTypes: 'expiration',
    columnsTable: columnsProducts,
  },
  {
    id: 5,
    tab: 'theft',
    icon: AlertTriangle,
    className: 'text-destructive',
    nameTab: 'Воровство',
    nameTable: 'Списание по причине хищения',
    storageTypes: ['warehouse'],
    balanceTypes: 'theft',
    columnsTable: columnsProducts,
  },
  {
    id: 6,
    tab: 'damage',
    icon: PackageX,
    className: 'text-orange-500',
    nameTab: 'Испорченная упаковка',
    nameTable: 'Товар с повреждённой упаковкой',
    storageTypes: ['warehouse'],
    balanceTypes: 'damage',
    columnsTable: columnsProducts,
  },
];

const ProductsBalances = () => {
  const [activeTab, setActiveTab] = useState('warehouse');
  const [contentTab, setContentTab] = useState(tabs.find((i) => i.tab === 'warehouse'));
  const { pagination, productsBalances, loading, error, setParamsRequest } = useProductsBalancesStore(
    useShallow((state) => ({
      pagination: state.pagination,
      productsBalances: state.productsBalances,
      loading: state.loading,
      error: state.error,
      setParamsRequest: state.setParamsRequest,
    })),
  );

  useEffect(() => {
    if (contentTab) {
      const storageTypes = contentTab.storageTypes.map((item) => `storageTypes=${item}&`).join('');
      setParamsRequest(`${storageTypes}balanceTypes=${contentTab.balanceTypes}`);
      getProductsBalances();
    }
  }, [contentTab]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => {
        setActiveTab(v);
        setContentTab(tabs.find((i) => i.tab === v));
      }}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.tab}>
            {<tab.icon />}
            {tab.nameTab}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.tab}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                {<tab.icon className={tab.className} />}
                {tab.nameTable}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading.list ? (
                <div className="mt-5 flex justify-center">
                  <Loader2 className="animate-spin" color="var(--color-primary)" />
                </div>
              ) : error.list ? (
                <div className="mt-5 flex justify-center gap-3">
                  <CircleAlert color="var(--color-destructive)" />
                  <p className="text-destructive">Ошибка получения продуктов</p>
                </div>
              ) : (
                <>
                  <AppTable data={productsBalances} columns={tab.columnsTable} paginationRequest={pagination} />
                  <Pagination pagination={pagination} setPagination={setPaginationProductsBalances} />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ProductsBalances;
