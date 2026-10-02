import React, { useEffect, useState } from 'react';
import { AlertTriangle, CircleAlert, Loader2, Package, PackageX, Store, TrendingDown, Warehouse } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import Pagination from '@/shared/Pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

import ProductsBalancesTable from './ProductsBalancesTable';
import SalePointsTerminals from './SalePointsTerminals';
import { getProductsBalancesView, setPaginationProductsBalancesView } from '../productsBalances.processes';
import { useProductsBalancesStore } from '../productsBalances.store';

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
  },
  {
    id: 2,
    tab: 'salePoint',
    icon: Store,
    className: 'text-primary',
    nameTab: 'Мини-склад',
    nameTable: 'Мини склад',
    storageTypes: ['salePoint'],
    balanceTypes: 'inStock',
  },
  {
    id: 3,
    tab: 'device',
    icon: Package,
    className: 'text-primary',
    nameTab: 'Точки продаж',
    nameTable: 'Точки продаж',
    storageTypes: ['device'],
    balanceTypes: 'inStock',
    table: 'salePoints',
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
  },
];

const ProductsBalances = () => {
  const [activeTab, setActiveTab] = useState('warehouse');
  const [contentTab, setContentTab] = useState(tabs.find((i) => i.tab === 'warehouse'));
  const { pagination, productsBalancesView, loading, error, setParamsRequest } = useProductsBalancesStore(
    useShallow((state) => ({
      pagination: state.pagination,
      productsBalancesView: state.productsBalancesView,
      loading: state.loading,
      error: state.error,
      setParamsRequest: state.setParamsRequest,
    })),
  );

  useEffect(() => {
    if (!contentTab || contentTab.table === 'salePoints') return;

    const storageTypes = contentTab.storageTypes.map((item) => `storageTypes=${item}&`).join('');
    setParamsRequest(`${storageTypes}balanceTypes=${contentTab.balanceTypes}`);
    getProductsBalancesView();
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
            {<tab.icon className={tab.className} />}
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
              {tab.table === 'salePoints' ? (
                <SalePointsTerminals />
              ) : loading.listView ? (
                <div className="mt-5 flex justify-center">
                  <Loader2 className="animate-spin" color="var(--color-primary)" />
                </div>
              ) : error.listView ? (
                <div className="mt-5 flex justify-center gap-3">
                  <CircleAlert color="var(--color-destructive)" />
                  <p className="text-destructive">Ошибка получения продуктов</p>
                </div>
              ) : (
                <>
                  <ProductsBalancesTable data={productsBalancesView} storageTab={contentTab?.tab} />
                  <Pagination pagination={pagination} setPagination={setPaginationProductsBalancesView} />
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
