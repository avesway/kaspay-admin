import { PAGE_TITLES } from '@/constants/routes';
import React from 'react';
import { useLocation } from 'react-router';
import StoragesList from './components/StoragesList';
import StoragesProductsList from './components/StorageProductsList';
import StorageRegisterProduct from './components/StoragesRegisterProduct';

function StoragesPage() {
  const { pathname } = useLocation();

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{PAGE_TITLES[pathname]}</h1>
          <p className="text-muted-foreground">Отслеживание остатков на всех складах</p>
        </div>

        <StorageRegisterProduct />
      </div>

      <StoragesList />
      <StoragesProductsList />
    </>
  );
}

export const Component = StoragesPage;
