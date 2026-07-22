import React from 'react';
import { useLocation } from 'react-router';

import { PAGE_TITLES } from '@/constants/routes';

import StatisticsFilter from './components/StatisticsFilter';
import StatisticsOrdersDays from './components/StatisticsOrdersDays';
import StatisticsOrdersReceipts from './components/StatisticsOrdersReceipts';
import StatisticsOrdersTopProducts from './components/StatisticsOrdersTopProducts';
import StatisticsSales from './components/StatisticsSales';

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

      <div className="flwx-wrap mt-10 flex flex-row justify-between max-lg:flex-col max-lg:gap-5">
        <StatisticsOrdersDays />
        <StatisticsOrdersTopProducts />
      </div>

      <StatisticsOrdersReceipts />
    </div>
  );
}

export const Component = SalesPage;
