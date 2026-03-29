import { useSalePointsStore } from '@/store';
import React, { useEffect } from 'react';
import AppTable from '@/shared/AppTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { useShallow } from 'zustand/react/shallow';
import { useNavigate } from 'react-router';
import { getListSalePoints } from '@/actions/salePoints.actions';
import { ROUTES } from '@/constants';

const columnsSalePoints = [
  {
    accessorKey: 'id',
    header: 'ID торговой точки',
  },
  {
    accessorKey: 'name',
    header: 'Торговая точка',
  },
  // {
  //   accessorKey: 'type',
  //   header: 'Тип',
  //   cell: ({ row }) => {
  //     const type = row.original.type;
  //     return <span>{type.description}</span>;
  //   },
  // },
  {
    accessorKey: 'phone',
    header: 'Телефон',
  },
  {
    accessorKey: 'address',
    header: 'Адрес',
    cell: ({ row }) => {
      const address = row.original.address.locationAddress;
      return (
        <div>
          <span>{address.country}, </span>
          <span>{address.region}, </span>
          <span>{address.city}, </span>
          <span>{address.street} </span>
          <span>{address.building}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'serialNumber',
    header: 'Серийный номер',
  },
];

const SalePointsList = () => {
  const navigate = useNavigate();
  const { salePoints, loading, error, setActiveSalePoint } = useSalePointsStore(
    useShallow((state) => ({
      salePoints: state.salePoints,
      loading: state.loading,
      error: state.error,
      setActiveSalePoint: state.setActiveSalePoint,
    })),
  );

  useEffect(() => {
    getListSalePoints();
  }, []);

  const goSalePoint = (row) => {
    setActiveSalePoint(row.original);

    navigate(`${ROUTES.SALE_POINTS}/${row.original.id}`, {
      state: { salePoint: row.original },
    });
  };

  return (
    <Card className="mt-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">Список торговых точек</CardTitle>
      </CardHeader>
      <CardContent>
        <AppTable data={salePoints} columns={columnsSalePoints} onClick={goSalePoint} isClickable />
      </CardContent>
    </Card>
  );
};

export default SalePointsList;
