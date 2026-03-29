import { PAGE_TITLES } from '@/constants/routes';
import React from 'react';
import { useLocation } from 'react-router';
import PricesBaseProductsList from './components/PricesBaseProductsList';

function PriceManagementPage() {
  const { pathname } = useLocation();

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold">{PAGE_TITLES[pathname]}</h1>
        <p className="text-muted-foreground">Установка базовых цен и уникальных цен для разных объектов</p>
      </div>

      <PricesBaseProductsList />
    </>
  );
}

export const Component = PriceManagementPage;
