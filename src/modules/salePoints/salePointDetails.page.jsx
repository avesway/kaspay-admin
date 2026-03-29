import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useLocation, useParams } from 'react-router';
import { Button } from '@/shared/ui/button';
import { ArrowLeft } from 'lucide-react';
import SalePointOperations from './components/SalePointOperations';
import { getListSalePoints } from '@/actions/salePoints.actions';
import SalePointsOperationsFilter from './components/SalePointsOperationsFilter';

function SalePointDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (id) getListSalePoints(id);
  }, [id]);

  return (
    <div className="">
      <div className="flex flex-items gap-5">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft />
          Назад
        </Button>
        <h1 className="text-3xl font-bold">Объекты / {location.state.salePoint.name}</h1>
      </div>

      <SalePointsOperationsFilter />
      <SalePointOperations />
    </div>
  );
}

export const Component = SalePointDetailsPage;
