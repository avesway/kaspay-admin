import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useLocation } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { PAGE_TITLES } from '@/constants/routes';

import ReportsCategoryTabs from './components/ReportsCategoryTabs';
import ReportsGrid from './components/ReportsGrid';
import { getReports, getReportsSalePoints } from './reports.processes';
import { useReportsStore } from './reports.store';

function ReportsPage() {
  const { pathname } = useLocation();
  const { loading, error } = useReportsStore(
    useShallow((state) => ({
      loading: state.loading,
      error: state.error,
    })),
  );

  useEffect(() => {
    getReports();
  }, []);

  return (
    <div className="">
      <div>
        <h1 className="text-3xl font-bold">{PAGE_TITLES[pathname]}</h1>
        <p className="text-muted-foreground">Каталог аналитических отчётов по кофейням и микромаркетам</p>
      </div>

      <ReportsCategoryTabs />

      <div className="mt-6">
        {loading.list ? (
          <div className="flex justify-center p-10">
            <Loader2 className="animate-spin" />
          </div>
        ) : error.list ? (
          <p className="text-destructive p-10 text-center">Ошибка получения отчетов</p>
        ) : (
          <ReportsGrid />
        )}
      </div>
    </div>
  );
}

export const Component = ReportsPage;
