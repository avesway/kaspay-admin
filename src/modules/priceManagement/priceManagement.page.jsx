import { PAGE_TITLES } from '@/constants/routes';
import React, { useState } from 'react';
import { useLocation } from 'react-router';
import PricesBaseProductsList from './components/PricesBaseProductsList';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import PriceListsSection from './components/priceLists/PriceListsSection';

function PriceManagementPage() {
  const { pathname } = useLocation();
  const [activeTab, setActiveTab] = useState('base-products');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{PAGE_TITLES[pathname]}</h1>
        <p className="text-muted-foreground">Установка базовых цен и уникальных цен для разных объектов</p>
      </div>

      <PricesBaseProductsList />

      {/* <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="base-products">Базовые цены</TabsTrigger>
          <TabsTrigger value="price-lists">Прайс листы</TabsTrigger>
        </TabsList>

        <TabsContent value="base-products">
          <PricesBaseProductsList />
        </TabsContent>

        <TabsContent value="price-lists">
          <PriceListsSection />
        </TabsContent>
      </Tabs> */}
    </div>
  );
}

export const Component = PriceManagementPage;
