import { toast } from 'sonner';

import { getListSalePoints } from '@/modules/salePoints/salePoints.processes';

import { reportsAPI } from './reports.api';
import { useReportsStore } from './reports.store';

function buildParams(filter, categoryType) {
  const params = new URLSearchParams();

  if (filter.from) params.append('from', filter.from);
  if (filter.to) params.append('to', filter.to);
  if (filter.salePointIds) params.append('salePointIds', filter.salePointIds);
  if (categoryType) params.append('categoryType', categoryType);

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}
export async function getReports() {
  const { reportsFilter, activeCategoryType, setReports, setLoading, setError } = useReportsStore.getState();

  setLoading({ list: true });

  const reports = await reportsAPI
    .getListReports(buildParams(reportsFilter, activeCategoryType))
    .then((res) => {
      setReports(res);
      setError({ list: false });
      return res;
    })
    .catch(() => {
      setError({ list: true });
      toast.error('Ошибка получения отчетов', { position: 'top-center' });
      return [];
    })
    .finally(() => setLoading({ list: false }));

  return reports;
}

export async function updateCategoryType(categoryType) {
  const { setActiveCategoryType } = useReportsStore.getState();

  setActiveCategoryType(categoryType);
  await getReports();
}

export async function updateReportsFilter(data) {
  const { setReportsFilter } = useReportsStore.getState();

  setReportsFilter(data);
  await getRevenueDynamics();
}

export async function getReportsSalePoints() {
  await getListSalePoints();
}

export async function getRevenueDynamics(granularityOverride) {
  const { reportsFilter, granularity, setRevenueDynamics, setLoading, setError } = useReportsStore.getState();
  const activeGranularity = granularityOverride ?? granularity;

  setLoading({ revenueDynamics: true });

  const params = new URLSearchParams();
  params.append('from', reportsFilter.from);
  if (reportsFilter.to) params.append('to', reportsFilter.to);
  if (reportsFilter.salePointIds) params.append('salePointIds', reportsFilter.salePointIds);
  params.append('granularity', activeGranularity);

  const data = await reportsAPI
    .getRevenueDynamics(`?${params.toString()}`)
    .then((res) => {
      setRevenueDynamics(res);
      setError({ revenueDynamics: false });
      return res;
    })
    .catch(() => {
      setError({ revenueDynamics: true });
      toast.error('Ошибка получения отчета', { position: 'top-center' });
      return null;
    })
    .finally(() => setLoading({ revenueDynamics: false }));

  return data;
}

export async function updateGranularity(granularity) {
  const { setGranularity } = useReportsStore.getState();

  setGranularity(granularity);
  await getRevenueDynamics(granularity);
}
