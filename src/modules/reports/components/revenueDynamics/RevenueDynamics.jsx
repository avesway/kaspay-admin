import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import RevenueDynamicsChart from './RevenueDynamicsChart';
import RevenueDynamicsStatCard from './RevenueDynamicsStatCard';
import { getRevenueDynamics } from '../../reports.processes';
import { useReportsStore } from '../../reports.store';

const RevenueDynamics = () => {
  const { revenueDynamics, loading, error } = useReportsStore(
    useShallow((state) => ({
      revenueDynamics: state.revenueDynamics,
      loading: state.loading,
      error: state.error,
    })),
  );

  useEffect(() => {
    getRevenueDynamics();
  }, []);

  if (loading.revenueDynamics && !revenueDynamics) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error.revenueDynamics) {
    return <p className="text-destructive p-10 text-center">Ошибка получения отчета</p>;
  }

  return (
    <div>
      <div className="mt-5 grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <RevenueDynamicsStatCard
          label="За период"
          valueKopecks={revenueDynamics?.totalRevenue}
          rate={revenueDynamics?.totalRevenueDeltaRate}
          delta={revenueDynamics?.totalRevenueDelta}
          previous={revenueDynamics?.previousTotalRevenue}
          previousFrom={revenueDynamics?.previousFrom}
          previousTo={revenueDynamics?.previousTo}
        />
        <RevenueDynamicsStatCard
          label="Среднее/день"
          valueKopecks={revenueDynamics?.averageRevenue}
          rate={revenueDynamics?.averageRevenueDeltaRate}
          delta={revenueDynamics?.averageRevenueDelta}
          previous={revenueDynamics?.previousAverageRevenue}
        />
        <RevenueDynamicsStatCard
          label="Макс. день"
          valueKopecks={revenueDynamics?.maxBucket?.revenue}
          footer={revenueDynamics?.maxBucket ? `${revenueDynamics.maxBucket.bucketFrom.split('-').reverse().join('.').slice(0, 5)}` : ''}
        />
        <RevenueDynamicsStatCard
          label="Мин. день"
          valueKopecks={revenueDynamics?.minBucket?.revenue}
          footer={revenueDynamics?.minBucket ? `${revenueDynamics.minBucket.bucketFrom.split('-').reverse().join('.').slice(0, 5)}` : ''}
        />
      </div>

      <RevenueDynamicsChart report={revenueDynamics} />
    </div>
  );
};

export default RevenueDynamics;
