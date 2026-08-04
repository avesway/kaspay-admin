import React, { useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/shared/ui/button';

import DeviceConnectPriceList from './components/DeviceConnectPriceList';
import DeviceDetails from './components/DeviceDetails';
import DeviceInfo from './components/DeviceInfo';
import { getListDevices } from './device.processes';
import { useDevicesStore } from './devices.store';
import { getListSalePoints } from '../salePoints/salePoints.processes';
import { useSalePointsStore } from '../salePoints/salePoints.store';

function DevicePage() {
  const { id, deviceId, slaveDeviceId } = useParams();
  const navigate = useNavigate();
  const { salePoints, activeSalePoint } = useSalePointsStore(
    useShallow((state) => ({ salePoints: state.salePoints, activeSalePoint: state.activeSalePoint })),
  );
  const { devices, activeTerminalDevice, activeControllerDevice } = useDevicesStore(
    useShallow((state) => ({
      devices: state.devices,
      activeTerminalDevice: state.activeTerminalDevice,
      activeControllerDevice: state.activeControllerDevice,
    })),
  );

  useEffect(() => {
    if (id && !salePoints.length) getListSalePoints(id);
    if (deviceId && slaveDeviceId && !devices.length) getListDevices(deviceId, slaveDeviceId);
  }, [id, deviceId, slaveDeviceId]);

  return (
    <div className="">
      <div className="flex-items flex gap-5 max-sm:flex-col max-sm:gap-5">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft />
          Назад
        </Button>
        <h1 className="flex flex-row items-center text-3xl font-bold max-sm:text-xl">
          Объекты / {!activeSalePoint ? <Loader2 className="mx-1 animate-spin" /> : activeSalePoint.name} /{' '}
          {!activeTerminalDevice ? <Loader2 className="mx-1 animate-spin" /> : activeTerminalDevice.name} /{' '}
          {!activeControllerDevice ? <Loader2 className="mx-1 animate-spin" /> : activeControllerDevice.name}
        </h1>
        <DeviceConnectPriceList />
      </div>

      <DeviceInfo />
      <DeviceDetails />
    </div>
  );
}

export const Component = DevicePage;
