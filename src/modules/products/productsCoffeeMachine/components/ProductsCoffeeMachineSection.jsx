import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

import DrinkCreate from '../productsCoffee/components/DrinkCreate';
import DrinksList from '../productsCoffee/components/DrinksList';
import ProductCompositeCreate from '../productsComposite/components/ProductCompositeCreate';
import ProductsCompositeList from '../productsComposite/components/ProductsCompositeList';

const COFFEE_MACHINE_TABS = [
  { value: 'products', title: 'Товары' },
  { value: 'drinks', title: 'Напитки' },
];

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
          {COFFEE_MACHINE_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="products">
          <div className="mt-5 mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Ресурсы для кофемашины</h2>
              <p className="text-muted-foreground text-[14px]">Кофе, молоко, стаканы и другие расходники</p>
            </div>
            <ProductCompositeCreate />
          </div>
          <ProductsCompositeList purposeTypes="composite" />
        </TabsContent>

        <TabsContent value="drinks">
          <div className="mt-5 mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Напитки</h2>
              <p className="text-muted-foreground text-[14px]">Рецепты напитков с указанием используемых ресурсов</p>
            </div>
            <DrinkCreate />
          </div>
          <DrinksList />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ProductsCoffeeMachineSection;
