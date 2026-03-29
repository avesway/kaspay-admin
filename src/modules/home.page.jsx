import { PAGE_TITLES } from '@/constants/routes';
import React from 'react';
import { useLocation } from 'react-router';
import ProductsExpiredList from './products/components/ProductsExpiredList';
import StatisticsSales from './saleReports/components/StatisticsSales';

function HomePage() {
  const { pathname } = useLocation();

  return (
    <div className="">
      <div>
        <h1 className="text-3xl font-bold">{PAGE_TITLES[pathname]}</h1>
        <p className="text-muted-foreground">Управление каталогом товаров</p>
      </div>

      <StatisticsSales />
      <ProductsExpiredList />
    </div>
  );
}

export const Component = HomePage;
