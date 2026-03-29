import { PAGE_TITLES } from '@/constants/routes';
import React from 'react';
import { useLocation } from 'react-router';
import SalePointsList from './components/SalePointsList';
import { useSalePointsStore } from '@/store';

function SalePointsPage() {
  const { pathname } = useLocation();
  const salePoints = useSalePointsStore((state) => state.salePoints);

  return (
    <div className="">
      <div>
        <h1 className="text-3xl font-bold">{PAGE_TITLES[pathname]}</h1>
        <p className="text-muted-foreground">{`Всего в системе: ${salePoints.length} торговых точек`}</p>
      </div>

      <SalePointsList />
    </div>
  );
}

export const Component = SalePointsPage;
