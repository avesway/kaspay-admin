import React, { useEffect } from 'react';
import { ArrowLeft, Construction } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';

import { ROUTES } from '@/constants/routes';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';

import AverageReceipt from './components/averageReceipt/AverageReceipt';
import HourlyRevenue from './components/hourlyRevenue/HourlyRevenue';
import ReportsFilter from './components/ReportsFilter';
import RevenueDynamics from './components/revenueDynamics/RevenueDynamics';
import WeekdayRevenue from './components/weekdayRevenue/WeekdayRevenue';
import { getReportsSalePoints, updateGranularity } from './reports.processes';
import { useReportsStore } from './reports.store';

const GRANULARITY_TABS = [
  { value: 'day', title: 'День' },
  { value: 'week', title: 'Неделя' },
  { value: 'month', title: 'Месяц' },
];

// Отчеты с реализованными экранами (name из каталога)
const IMPLEMENTED_REPORTS = ['revenueDynamics', 'hourlyRevenue', 'weekdayRevenue', 'averageReceipt'];

const ReportPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const report = state?.report;
  const granularity = useReportsStore((state) => state.granularity);

  const isRevenueDynamics = report?.name === 'revenueDynamics';
  const isHourlyRevenue = report?.name === 'hourlyRevenue';
  const isImplemented = IMPLEMENTED_REPORTS.includes(report?.name);

  useEffect(() => {
    if (report?.isAvailable && isImplemented) {
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

      {(!report?.isAvailable || !isImplemented) && (
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

      {report?.isAvailable && isHourlyRevenue && <HourlyRevenue />}

      {report?.isAvailable && report?.name === 'weekdayRevenue' && <WeekdayRevenue />}

      {report?.isAvailable && report?.name === 'averageReceipt' && <AverageReceipt />}
    </div>
  );
};

export const Component = ReportPage;
