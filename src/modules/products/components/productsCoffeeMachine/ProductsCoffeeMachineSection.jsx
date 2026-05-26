import ProductList from '@/modules/products/components/productsCatalog/ProductList';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { useState } from 'react';
import ProductCreate from '../productsCatalog/ProductCreate';
import ProductCoffeeMachineCreate from './ProductCoffeeMachineCreate';
import ProductsCoffeeMachineList from './ProductsCoffeeMachineList';

const ProductsCoffeeMachineSection = () => {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <>
      <div className="flex items-center justify-between mb-4 mt-5">
        <div>
          <h2 className="text-xl font-semibold">Товары для кофемашины</h2>
          <p className="text-muted-foreground text-[14px]">Управление ресурсами и напитками для кофейных автоматов</p>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger
            className="rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-3 pb-2"
            value="products"
          >
            Товары
          </TabsTrigger>
          <TabsTrigger
            className="rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-3 pb-2"
            value="drinks"
          >
            Напитки
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="flex items-center justify-between mb-4 mt-5">
            <div>
              <h2 className="text-xl font-semibold">Ресурсы для кофемашины</h2>
              <p className="text-muted-foreground text-[14px]">Кофе, молоко, стаканы и другие расходники</p>
            </div>
            <ProductCoffeeMachineCreate />
          </div>
          <ProductsCoffeeMachineList />
        </TabsContent>

        <TabsContent value="drinks">
          <div className="flex items-center justify-between mb-4 mt-5">
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
