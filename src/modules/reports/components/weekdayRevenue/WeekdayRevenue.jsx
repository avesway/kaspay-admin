import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import WeekdayHeatmap from './WeekdayHeatmap';
import WeekdayRevenueCards from './WeekdayRevenueCards';
import WeekdayRevenueChart from './WeekdayRevenueChart';
import { getReportsSalePoints, getWeekdayRevenue, updateWeekdayFilter } from '../../reports.processes';
import { useReportsStore } from '../../reports.store';
import ReportsFilter from '../ReportsFilter';

const WeekdayRevenue = () => {
  const { weekdayRevenue, loading, error } = useReportsStore(
    useShallow((state) => ({
      weekdayRevenue: state.weekdayRevenue,
      loading: state.loading,
      error: state.error,
    })),
  );

  useEffect(() => {
    getReportsSalePoints();
    getWeekdayRevenue();
  }, []);

  if (loading.weekdayRevenue && !weekdayRevenue) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error.weekdayRevenue) {
    return <p className="text-destructive p-10 text-center">Ошибка получения отчета</p>;
  }

  return (
    <div>
      <ReportsFilter onUpdate={updateWeekdayFilter} />

      <WeekdayRevenueCards report={weekdayRevenue} />

      <WeekdayRevenueChart report={weekdayRevenue} />

      <WeekdayHeatmap report={weekdayRevenue} />
    </div>
  );
};

export default WeekdayRevenue;
