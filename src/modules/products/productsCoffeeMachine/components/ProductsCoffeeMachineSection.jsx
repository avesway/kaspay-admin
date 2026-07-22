import { useState } from 'react';

import ProductList from '@/modules/products/productsCatalog/components/ProductList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

import ProductCoffeeMachineCreate from './ProductCoffeeMachineCreate';
import ProductsCoffeeMachineList from './ProductsCoffeeMachineList';
import ProductCreate from '../../productsCatalog/components/ProductCreate';

const ProductsCoffeeMachineSection = () => {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <>
      <div className="mt-5 mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Товары для кофемашины</h2>
          <p className="text-muted-foreground text-[14px]">Управление ресурсами и напитками для кофейных автоматов</p>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger
            className="data-[state=active]:border-primary rounded-none border-0 border-b-2 border-transparent px-3 pb-2 data-[state=active]:bg-transparent"
            value="products"
          >
            Товары
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:border-primary rounded-none border-0 border-b-2 border-transparent px-3 pb-2 data-[state=active]:bg-transparent"
            value="drinks"
          >
            Напитки
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="mt-5 mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Ресурсы для кофемашины</h2>
              <p className="text-muted-foreground text-[14px]">Кофе, молоко, стаканы и другие расходники</p>
            </div>
            <ProductCoffeeMachineCreate />
          </div>
          <ProductsCoffeeMachineList />
        </TabsContent>

        <TabsContent value="drinks">
          <div className="mt-5 mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Напитки</h2>
              <p className="text-muted-foreground text-[14px]">Рецепты напитков с указанием используемых ресурсов</p>
            </div>
            <ProductCreate />
          </div>
          <ProductList />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ProductsCoffeeMachineSection;
