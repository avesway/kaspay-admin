import { saleReportsAPI } from '@/api/saleReports.api';
import { useSaleReportsStore } from '@/store';
import { toast } from 'sonner';
import { refreshToken } from './auth.actions';

export async function updateStatisticsFilter(data) {
  const { statisticFilter, setStatisticFilter, paginationTopProducts, paginationReceipts, paginationOrderDays } =
    useSaleReportsStore.getState();

  setStatisticFilter(data);
  const actualFilter = { ...statisticFilter, ...data };

  await refreshToken();

  getStatisticsOrdersTotal(
    `?from=${actualFilter.from}&to=${actualFilter.to}&salePointIds=${actualFilter.salePointIds}&filterType=paid`,
  );

  getStatisticsOrderDays(
    `?from=${actualFilter.from}&to=${actualFilter.to}&salePointIds=${actualFilter.salePointIds}&size=${paginationOrderDays.size}&page=${paginationOrderDays.page}&filterType=paid`,
  );

  getStatisticsOrderTopProducts(
    `?from=${actualFilter.from}&to=${actualFilter.to}&salePointIds=${actualFilter.salePointIds}&size=${paginationTopProducts.size}&page=${paginationTopProducts.page}&filterType=paid`,
  );

  getStatisticsOrderReceipts(
    `?from=${actualFilter.from}&to=${actualFilter.to}&salePointIds=${actualFilter.salePointIds}&size=${paginationReceipts.size}&page=${paginationReceipts.page}`,
  );
}

export async function getStatisticsStorageRemainingProducts(ids) {
  const { setLoading, setError, setStatisticStorageRemainingProducts } = useSaleReportsStore.getState();
  setLoading({ storageRemainingProducts: true });

  await saleReportsAPI
    .getStatisticsStorageRemainingProducts(ids)
    .then((res) => setStatisticStorageRemainingProducts(res))
    .catch((err) => setError({ storageRemainingProducts: true }))
    .finally(() => setLoading({ storageRemainingProducts: false }));
}

export async function getStatisticsOrdersTotal(params) {
  const { setLoading, setError, setStatisticOrdersTotal } = useSaleReportsStore.getState();
  setLoading({ ordersTotal: true });

  await saleReportsAPI
    .getStatisticsOrdersTotal(params)
    .then((res) => setStatisticOrdersTotal(res))
    .catch((err) => {
      setError({ ordersTotal: true });
      toast.error('Ошибка получения статистики', {
        position: 'top-center',
      });
    })
    .finally(() => setLoading({ ordersTotal: false }));
}

export async function getStatisticsOrderDays(params) {
  const { setLoading, setError, setStatisticOrderDays, setPaginationOrderDays } = useSaleReportsStore.getState();
  setLoading({ orderDays: true });

  await saleReportsAPI
    .getStatisticsOrderDays(params)
    .then((res) => {
      setStatisticOrderDays(res.items);
      setPaginationOrderDays({ totalItems: res.totalItems, totalPages: res.totalPages });
    })
    .catch((err) => setError({ orderDays: true }))
    .finally(() => setLoading({ orderDays: false }));
}

export async function getStatisticsOrderTopProducts(params) {
  const { setLoading, setError, setStatisticOrderTopProducts, setPaginationTopProducts } = useSaleReportsStore.getState();
  setLoading({ orderTopProducts: true });

  await saleReportsAPI
    .getStatisticsOrderTopProducts(params)
    .then((res) => {
      setStatisticOrderTopProducts(res.items);
      setPaginationTopProducts({ totalItems: res.totalItems, totalPages: res.totalPages });
    })
    .catch((err) => setError({ orderTopProducts: true }))
    .finally(() => setLoading({ orderTopProducts: false }));
}

export async function getStatisticsOrderReceipts(params) {
  const { setLoading, setError, setStatisticOrderReceipts, setPaginationReceipts } = useSaleReportsStore.getState();
  setLoading({ orderReceipts: true });

  await saleReportsAPI
    .getStatisticsOrderReceipts(params)
    .then((res) => {
      setStatisticOrderReceipts(res.items);
      setPaginationReceipts({ totalItems: res.totalItems, totalPages: res.totalPages });
    })
    .catch((err) => setError({ orderReceipts: true }))
    .finally(() => setLoading({ orderReceipts: false }));
}

export function updatePaginationStatisticsOrderDays(size, page) {
  const { setPaginationOrderDays, statisticFilter } = useSaleReportsStore.getState();

  setPaginationOrderDays({ size, page });

  getStatisticsOrderDays(
    `?from=${statisticFilter.from}&to=${statisticFilter.to}&salePointIds=${statisticFilter.salePointIds}&size=${size}&page=${page}&filterType=paid`,
  );
}

export function updatePaginationStatisticsTopProducts(size, page) {
  const { setPaginationTopProducts, statisticFilter } = useSaleReportsStore.getState();

  setPaginationTopProducts({ size, page });

  getStatisticsOrderTopProducts(
    `?from=${statisticFilter.from}&to=${statisticFilter.to}&salePointIds=${statisticFilter.salePointIds}&size=${size}&page=${page}&filterType=paid`,
  );
}

export function updatePaginationStatisticsOrderReceipts(size, page) {
  const { setPaginationReceipts, statisticFilter } = useSaleReportsStore.getState();

  setPaginationReceipts({ size, page });

  getStatisticsOrderReceipts(
    `?from=${statisticFilter.from}&to=${statisticFilter.to}&salePointIds=${statisticFilter.salePointIds}&size=${size}&page=${page}&filterType=paid`,
  );
}
