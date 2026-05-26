import { PAGE_TITLES } from '@/constants/routes';
import React from 'react';
import { useLocation } from 'react-router';
import StatisticsSales from './saleReports/components/StatisticsSales';
import ProductsExpiredList from './products/components/productsBalances/ProductsExpiredList';

function HomePage() {
  const { pathname } = useLocation();

  return (
    <div className="">
      <div>
        <h1 className="text-3xl font-bold">{PAGE_TITLES[pathname]}</h1>
        <p className="text-muted-foreground">Добро пожаловать! Обзор ваших операций.</p>
      </div>

      <StatisticsSales />
      <ProductsExpiredList />
    </div>
  );
}

export const Component = HomePage;
