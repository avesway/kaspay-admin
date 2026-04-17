import { PAGE_TITLES } from '@/constants/routes';
import React from 'react';
import { useLocation } from 'react-router';
import StatisticsFilter from './components/StatisticsFilter';
import StatisticsSales from './components/StatisticsSales';
import StatisticsOrdersDays from './components/StatisticsOrdersDays';
import StatisticsOrdersTopProducts from './components/StatisticsOrdersTopProducts';
import StatisticsOrdersReceipts from './components/StatisticsOrdersReceipts';

function SalesPage() {
  const { pathname } = useLocation();

  return (
    <div className="">
      <div>
        <h1 className="text-3xl font-bold">{PAGE_TITLES[pathname]}</h1>
        <p className="text-muted-foreground">Сводные финансовые отчеты и аналитика</p>
      </div>

      <StatisticsFilter />
      <StatisticsSales isFilter={true} />

      <div className="flex flex-row flwx-wrap justify-between mt-10 max-lg:flex-col max-lg:gap-5">
        <StatisticsOrdersDays />
        <StatisticsOrdersTopProducts />
      </div>

      <StatisticsOrdersReceipts />
    </div>
  );
}

export const Component = SalesPage;
