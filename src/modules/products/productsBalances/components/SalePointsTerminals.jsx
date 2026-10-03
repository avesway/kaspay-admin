import React, { useEffect, useState } from 'react';
import { ArrowLeft, CircleAlert, Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { getListSaleDevices, getListSalePoints } from '@/modules/salePoints/salePoints.processes';
import { useSalePointsStore } from '@/modules/salePoints/salePoints.store';
import Pagination from '@/shared/Pagination';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

import ProductsBalancesTable from './ProductsBalancesTable';
import TerminalsTable from './TerminalsTable';
import { getProductsBalancesView, setPaginationProductsBalancesView } from '../productsBalances.processes';
import { useProductsBalancesStore } from '../productsBalances.store';

const LoadingSpinner = () => (
  <div className="mt-5 flex justify-center">
    <Loader2 className="animate-spin" color="var(--color-primary)" />
  </div>
);

const getUniqueMatrixNames = (terminal) => [
  ...new Set(
    (terminal.slaveDevices || [])
      .map((device) => device.deviceProductMatrixPriceList?.matrixName)
      .filter(Boolean),
  ),
];

const getUniquePriceListNames = (terminal) => [
  ...new Set(
    (terminal.slaveDevices || [])
      .map((device) => device.deviceProductMatrixPriceList?.priceListName)
      .filter(Boolean),
  ),
];

const SalePointsTerminals = () => {
  const [terminals, setTerminals] = useState([]);
  const [selectedTerminal, setSelectedTerminal] = useState(null);

  const { loadingSalePoints, loadingDevices, errorSalePoints, errorDevices } = useSalePointsStore(
    useShallow((state) => ({
      loadingSalePoints: state.loading.list,
      loadingDevices: state.loading.devices,
      errorSalePoints: state.error.list,
      errorDevices: state.error.devices,
    })),
  );
  const { pagination, productsBalancesView, loadingListView, errorListView, setParamsRequest } = useProductsBalancesStore(
    useShallow((state) => ({
      pagination: state.pagination,
      productsBalancesView: state.productsBalancesView,
      loadingListView: state.loading.listView,
      errorListView: state.error.listView,
      setParamsRequest: state.setParamsRequest,
    })),
  );

  useEffect(() => {
    let cancelled = false;

    async function loadTerminals() {
      const salePoints = await getListSalePoints();
      const devices = await Promise.all(
        salePoints.map((salePoint) => getListSaleDevices(salePoint.id, 'deviceTypes=terminal')),
      );
      const rows = salePoints.flatMap((salePoint, index) =>
        (devices[index] || []).map((terminal) => ({ ...terminal, salePoint })),
      );

      if (!cancelled) setTerminals(rows);
    }

    loadTerminals();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedTerminal) return;

    setParamsRequest(`storageTypes=device&balanceTypes=inStock&deviceId=${selectedTerminal.id}`);
    getProductsBalancesView();
  }, [selectedTerminal]);

  if (!selectedTerminal) {
    const isError = (errorSalePoints || errorDevices) && !terminals.length;

    return loadingSalePoints || loadingDevices ? (
      <LoadingSpinner />
    ) : isError ? (
      <div className="mt-5 flex justify-center gap-3">
        <CircleAlert color="var(--color-destructive)" />
        <p className="text-destructive">Ошибка получения терминалов</p>
      </div>
    ) : (
      <TerminalsTable data={terminals} onDetails={setSelectedTerminal} />
    );
  }

  const matrixNames = getUniqueMatrixNames(selectedTerminal);
  const priceListNames = getUniquePriceListNames(selectedTerminal);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={() => setSelectedTerminal(null)}>
          <ArrowLeft className="h-4 w-4" />
          Назад к списку
        </Button>
        <h2 className="text-xl font-bold">{selectedTerminal.name}</h2>

        {matrixNames.length ? (
          matrixNames.map((matrixName) => (
            <Badge key={matrixName} variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              Матрица: {matrixName}
            </Badge>
          ))
        ) : (
          <Badge variant="outline" className="border-orange-500 bg-orange-50 text-orange-500">
            Матрица: Не подключена
          </Badge>
        )}

        {priceListNames.length ? (
          priceListNames.map((priceListName) => (
            <Badge key={priceListName} variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              {priceListName}
            </Badge>
          ))
        ) : (
          <Badge variant="outline" className="border-orange-500 bg-orange-50 text-orange-500">
            Прайс-лист не подключен
          </Badge>
        )}
      </div>

      {loadingListView ? (
        <LoadingSpinner />
      ) : errorListView ? (
        <div className="mt-5 flex justify-center gap-3">
          <CircleAlert color="var(--color-destructive)" />
          <p className="text-destructive">Ошибка получения продуктов</p>
        </div>
      ) : (
        <>
          <ProductsBalancesTable
            data={productsBalancesView}
            storageTab="device"
            deviceId={selectedTerminal.id}
            sourceName={selectedTerminal.name}
          />
          <Pagination pagination={pagination} setPagination={setPaginationProductsBalancesView} />
        </>
      )}
    </div>
  );
};

export default SalePointsTerminals;
