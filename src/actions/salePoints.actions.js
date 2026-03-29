import { salePointsAPI } from '@/api/salePoints.api';
import { useSalePointsStore } from '@/store';

export async function getListSalePoints(salePointId) {
  const { setSalePoints, setLoading, setError, updatePagination, setActiveSalePoint } = useSalePointsStore.getState();
  setLoading({ list: true });

  const salePoints = await salePointsAPI
    .getListSalePoints()
    .then((res) => {
      if (salePointId) setActiveSalePoint(res.items.find((item) => item.id === salePointId));
      setSalePoints(res.items);
      updatePagination({ totalItems: res.totalItems, totalPages: res.totalPages });
      return res.items;
    })
    .catch((err) => {
      setError({ list: true });
      return [];
    })
    .finally(() => setLoading({ list: false }));

  return salePoints;
}

export async function getListSaleDevices(salePointId) {
  const { setSaleDevices, setLoading, setError, updatePaginationDevices } = useSalePointsStore.getState();
  setLoading({ devices: true });

  const saleDevices = await salePointsAPI
    .getListSaleDevices(`?salePointIds=${salePointId}`)
    .then((res) => {
      setSaleDevices(res.items);
      updatePaginationDevices({ totalItems: res.totalItems, totalPages: res.totalPages });
      return res.items;
    })
    .catch((err) => {
      setError({ devices: true });
      return [];
    })
    .finally(() => setLoading({ devices: false }));

  return saleDevices;
}

export async function getOperationsSalePoint() {
  const {
    setSalePointOperations,
    setLoading,
    setError,
    updatePaginationOperations,
    filterOperations,
    paginationOperations,
    activeSalePoint,
  } = useSalePointsStore.getState();

  setLoading({ operations: true });

  const params = `?from=${filterOperations.from}&to=${filterOperations.to}&salePointId=${activeSalePoint.id}&size=${paginationOperations.size}&page=${paginationOperations.page}`;

  const salePointOperations = await salePointsAPI
    .getOperationsSalePoint(params)
    .then((res) => {
      setSalePointOperations(res.items);
      updatePaginationOperations({ totalItems: res.totalItems, totalPages: res.totalPages });
      return res.items;
    })
    .catch((err) => {
      setError({ operations: true });
      return [];
    })
    .finally(() => setLoading({ operations: false }));

  return salePointOperations;
}

export function updatePaginationOperationsSalePoint(size, page) {
  const { updatePaginationOperations } = useSalePointsStore.getState();

  updatePaginationOperations({ size, page });

  getOperationsSalePoint();
}

export function updateOperationsFilter(data) {
  const { updateFilterOperations } = useSalePointsStore.getState();

  updateFilterOperations(data);

  getOperationsSalePoint();
}
