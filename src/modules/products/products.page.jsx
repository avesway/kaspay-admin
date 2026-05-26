import { PAGE_TITLES } from '@/constants/routes';
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { useLocation } from 'react-router';
import ProductList from './components/productsCatalog/ProductList';
import ProductsCoffeeMachineSection from './components/productsCoffeeMachine/ProductsCoffeeMachineSection';
import ProductsMatrixTemplatesSection from './components/productsMatrixTemplates/ProductsMatrixTemplatesSection';
import ProductCreate from './components/productsCatalog/ProductCreate';

function ProductsPage() {
  const { pathname, state } = useLocation();
  const [activeTab, setActiveTab] = useState(state?.tab || 'products');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{PAGE_TITLES[pathname]}</h1>
        <p className="text-muted-foreground">Управление каталогом товаров и шаблонами матриц</p>
      </div>

      <div className="flex items-center justify-between mb-4 mt-5">
        <h2 className="text-xl font-semibold">Каталог товаров</h2>
        <ProductCreate />
      </div>
      <ProductList />

      {/* <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="products">Товары</TabsTrigger>
          <TabsTrigger value="coffeeMachineProducts">Товары для кофемашины</TabsTrigger>
          <TabsTrigger value="matrix-templates">Шаблоны матриц</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="flex items-center justify-between mb-4 mt-5">
            <h2 className="text-xl font-semibold">Каталог товаров</h2>
            <ProductCreate />
          </div>
          <ProductList />
        </TabsContent>

        <TabsContent value="coffeeMachineProducts">
          <ProductsCoffeeMachineSection />
        </TabsContent>

        <TabsContent value="matrix-templates">
          <ProductsMatrixTemplatesSection />
        </TabsContent>
      </Tabs> */}
    </div>
  );
}

export const Component = ProductsPage;
