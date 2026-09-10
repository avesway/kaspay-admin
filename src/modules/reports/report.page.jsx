import React, { useEffect } from 'react';
import { ArrowLeft, Construction } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';

import { ROUTES } from '@/constants/routes';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';

import ReportsFilter from './components/ReportsFilter';
import RevenueDynamics from './components/revenueDynamics/RevenueDynamics';
import { getReportsSalePoints, updateGranularity } from './reports.processes';
import { useReportsStore } from './reports.store';

const GRANULARITY_TABS = [
  { value: 'day', title: 'День' },
  { value: 'week', title: 'Неделя' },
  { value: 'month', title: 'Месяц' },
];

const ReportPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const report = state?.report;
  const granularity = useReportsStore((state) => state.granularity);

  const isRevenueDynamics = report?.name === 'revenueDynamics';

  useEffect(() => {
    if (report?.isAvailable && isRevenueDynamics) {
      getReportsSalePoints();
    }
  }, []);

  return (
    <div className="space-y-6">
      <Button variant="outline" className="gap-2" onClick={() => navigate(ROUTES.REPORTS)}>
        <ArrowLeft className="size-4" />
        Все отчёты
      </Button>

      <div>
        <h1 className="text-3xl font-bold">{report?.title || 'Отчет'}</h1>
        <p className="text-muted-foreground">{report?.description || ''}</p>
      </div>

      {(!report?.isAvailable || !isRevenueDynamics) && (
        <Card>
          <CardContent className="text-muted-foreground flex flex-col items-center gap-4 p-16">
            <Construction className="h-12 w-12" />
            <p className="text-lg font-medium">Отчет в разработке</p>
            <p className="text-sm">Этот отчет еще не реализован. Загляните позже.</p>
          </CardContent>
        </Card>
      )}

      {report?.isAvailable && isRevenueDynamics && (
        <div>
          <ReportsFilter />

          <Tabs value={granularity} onValueChange={updateGranularity} className="mt-5">
            <TabsList className="w-fit">
              {GRANULARITY_TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <RevenueDynamics />
        </div>
      )}
    </div>
  );
};

export const Component = ReportPage;
