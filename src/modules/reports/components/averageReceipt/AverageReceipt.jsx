import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import AverageReceiptCards from './AverageReceiptCards';
import AverageReceiptChart from './AverageReceiptChart';
import { getAverageReceipt, getReportsSalePoints, updateAverageReceiptFilter } from '../../reports.processes';
import { useReportsStore } from '../../reports.store';
import ReportsFilter from '../ReportsFilter';

const AverageReceipt = () => {
  const { averageReceipt, loading, error } = useReportsStore(
    useShallow((state) => ({
      averageReceipt: state.averageReceipt,
      loading: state.loading,
      error: state.error,
    })),
  );

  useEffect(() => {
    getReportsSalePoints();
    getAverageReceipt();
  }, []);

  if (loading.averageReceipt && !averageReceipt) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error.averageReceipt) {
    return <p className="text-destructive p-10 text-center">Ошибка получения отчета</p>;
  }

  return (
    <div>
      <ReportsFilter onUpdate={updateAverageReceiptFilter} />

      <AverageReceiptCards report={averageReceipt} />

      <AverageReceiptChart report={averageReceipt} />
    </div>
  );
};

export default AverageReceipt;
