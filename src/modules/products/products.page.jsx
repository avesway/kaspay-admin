import { PAGE_TITLES } from '@/constants/routes';
import React from 'react';
import { useLocation } from 'react-router';
import ProductList from './components/ProductList';
import ProductAdd from './components/ProductAdd';

function ProductsPage() {
  const { pathname } = useLocation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{PAGE_TITLES[pathname]}</h1>
        <p className="text-muted-foreground">Управление каталогом товаров</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Каталог товаров</h2>
        <ProductAdd />
      </div>

      <ProductList />
    </div>
  );
}

export const Component = ProductsPage;
