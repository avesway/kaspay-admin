import React, { useState } from 'react';
import { useLocation } from 'react-router';

import { PAGE_TITLES } from '@/constants/routes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

//import ProductsCoffeeMachineSection from './components/productsCoffeeMachine/ProductsCoffeeMachineSection';
import CategoriesSection from './categories/components/CategoriesSection';
import MatricesSection from './matrices/components/MatricesSection';
import ProductCreate from './productsCatalog/components/ProductCreate';
import ProductList from './productsCatalog/components/ProductList';

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
          {/* <TabsTrigger value="coffeeMachineProducts">Товары для кофемашины</TabsTrigger> */}
          <TabsTrigger value="matrix-templates">Шаблоны матриц</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Tabs value={activeCatalogTab} onValueChange={setActiveCatalogTab}>
            <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-none bg-transparent p-0 shadow-none">
              {[
                { value: 'catalog', title: 'Каталог товаров' },
                { value: 'categories', title: 'Категории' },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:border-primary h-auto flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-1 pb-3 pt-2 text-base font-semibold shadow-none data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
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

        <TabsContent value="coffeeMachineProducts">{/* <ProductsCoffeeMachineSection /> */}</TabsContent>

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
