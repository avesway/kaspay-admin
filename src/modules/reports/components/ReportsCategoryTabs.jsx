import React from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';

import { REPORTS_CATEGORY_TYPES } from '../helpers/reportsConfig';
import { updateCategoryType } from '../reports.processes';
import { useReportsStore } from '../reports.store';

const ReportsCategoryTabs = () => {
  const activeCategoryType = useReportsStore((state) => state.activeCategoryType);

  return (
    <Tabs value={activeCategoryType} onValueChange={updateCategoryType}>
      <TabsList>
        {REPORTS_CATEGORY_TYPES.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default ReportsCategoryTabs;
