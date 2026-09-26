import React, { useState } from 'react';
import { useLocation } from 'react-router';

import { PAGE_TITLES } from '@/constants/routes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

import MatricesSection from './matrices/components/MatricesSection';
import ProductsCoffeeMachineSection from './productsCoffeeMachine/components/ProductsCoffeeMachineSection';
import ProductCreate from './productsSingle/catalog/components/ProductCreate';
import ProductList from './productsSingle/catalog/components/ProductList';
import CategoriesSection from './productsSingle/categories/components/CategoriesSection';

function ProductsPage() {
  const { pathname, state } = useLocation();
  const [activeTab, setActiveTab] = useState(state?.tab || 'products');
  const [activeCatalogTab, setActiveCatalogTab] = useState('catalog');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{PAGE_TITLES[pathname]}</h1>
        <p className="text-muted-foreground">Управление каталогом товаров и шаблонами матриц</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="products">Товары</TabsTrigger>
          <TabsTrigger value="coffeeMachineProducts">Товары для кофемашины</TabsTrigger>
          <TabsTrigger value="matrix-templates">Шаблоны матриц</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Tabs value={activeCatalogTab} onValueChange={setActiveCatalogTab}>
            <TabsList>
              {[
                { value: 'catalog', title: 'Каталог товаров' },
                { value: 'categories', title: 'Категории' },
              ].map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="catalog">
              <div className="mt-5 mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Каталог товаров</h3>
                <ProductCreate />
              </div>
              <ProductList />
            </TabsContent>

            <TabsContent value="categories">
              <CategoriesSection />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="coffeeMachineProducts">
          <ProductsCoffeeMachineSection />
        </TabsContent>

        <TabsContent value="matrix-templates">
          <MatricesSection />
        </TabsContent>
      </Tabs>

      {/* <div className="mt-5 mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Каталог товаров</h2>
        <ProductCreate />
      </div>
      <ProductList /> */}
    </div>
  );
}

export const Component = ProductsPage;
