import React, { useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/shared/ui/button';

import { getListSalePoints } from './salePoints.processes';
import { useSalePointsStore } from './salePoints.store';
import DevicesList from '../devices/components/DevicesList';

function SalePointDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { salePoints, activeSalePoint } = useSalePointsStore(
    useShallow((state) => ({ salePoints: state.salePoints, activeSalePoint: state.activeSalePoint })),
  );

  useEffect(() => {
    if (id && !salePoints.length) getListSalePoints(id);
  }, [id]);

  return (
    <div className="">
      <div className="flex-items flex gap-5 max-sm:flex-col max-sm:gap-5">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft />
          Назад
        </Button>
        <h1 className="flex flex-row items-center text-3xl font-bold max-sm:text-xl">
          Объекты / {!activeSalePoint ? <Loader2 className="mx-1 animate-spin" /> : activeSalePoint.name}
        </h1>
      </div>

      <DevicesList />
    </div>
  );
}

export const Component = SalePointDetailsPage;
