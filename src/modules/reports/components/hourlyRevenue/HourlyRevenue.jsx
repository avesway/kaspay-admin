import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import HourlyFilter from './HourlyFilter';
import HourlyRevenueCards from './HourlyRevenueCards';
import HourlyRevenueChart from './HourlyRevenueChart';
import { getHourlyRevenue, getReportsSalePoints } from '../../reports.processes';
import { useReportsStore } from '../../reports.store';

const HourlyRevenue = () => {
  const { hourlyRevenue, loading, error } = useReportsStore(
    useShallow((state) => ({
      hourlyRevenue: state.hourlyRevenue,
      loading: state.loading,
      error: state.error,
    })),
  );

  useEffect(() => {
    getReportsSalePoints();
    getHourlyRevenue();
  }, []);

  if (loading.hourlyRevenue && !hourlyRevenue) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error.hourlyRevenue) {
    return <p className="text-destructive p-10 text-center">Ошибка получения отчета</p>;
  }

  return (
    <div>
      <HourlyFilter />

      <HourlyRevenueCards report={hourlyRevenue} />

      <HourlyRevenueChart report={hourlyRevenue} />
    </div>
  );
};

export default HourlyRevenue;
