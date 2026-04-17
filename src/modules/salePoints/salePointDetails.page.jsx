import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import { Button } from '@/shared/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getListSalePoints } from '@/actions/salePoints.actions';
import DevicesList from '../devices/components/DevicesList';
import { useSalePointsStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';

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
      <div className="flex flex-items gap-5 max-sm:flex-col max-sm:gap-5">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft />
          Назад
        </Button>
        <h1 className="text-3xl font-bold flex flex-row items-center max-sm:text-xl">
          Объекты / {!activeSalePoint ? <Loader2 className="animate-spin mx-1" /> : activeSalePoint.name}
        </h1>
      </div>

      <DevicesList />
    </div>
  );
}

export const Component = SalePointDetailsPage;
