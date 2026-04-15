import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { useDevicesStore, useSalePointsStore } from '@/store';
import { getListDevices } from '@/actions/devices.actions';
import { getListSalePoints } from '@/actions/salePoints.actions';
import { Button } from '@/shared/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import DeviceDetails from './components/DeviceDetails';

function DevicePage() {
  const { id, deviceId } = useParams();
  const navigate = useNavigate();
  const { salePoints, activeSalePoint } = useSalePointsStore(
    useShallow((state) => ({ salePoints: state.salePoints, activeSalePoint: state.activeSalePoint })),
  );
  const { devices, activeDevice } = useDevicesStore(
    useShallow((state) => ({ devices: state.devices, activeDevice: state.activeDevice })),
  );

  useEffect(() => {
    if (id && !salePoints.length) getListSalePoints(id);
    if (deviceId && !devices.length) getListDevices(deviceId);
  }, [id, deviceId]);

  return (
    <div className="">
      <div className="flex flex-items gap-5">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft />
          Назад
        </Button>
        <h1 className="text-3xl font-bold flex flex-row items-center">
          Объекты / {!activeSalePoint ? <Loader2 className="animate-spin mx-1" /> : activeSalePoint.name} /{' '}
          {!activeDevice ? <Loader2 className="animate-spin mx-1" /> : activeDevice.name}
        </h1>
      </div>

      <DeviceDetails />
    </div>
  );
}

export const Component = DevicePage;
