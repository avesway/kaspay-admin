import React, { useEffect } from 'react';
import { CircleAlert, Loader2, Package } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { ROUTES } from '@/constants';
import { useSalePointsStore } from '@/modules/salePoints/salePoints.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

import { getListDevices } from '../device.processes';
import { useDevicesStore } from '../devices.store';
import { deviceMatrixBadge } from '../helpers/deviceMatrixBadge';
import { devicePriceListBadge } from '../helpers/devicePriceListBadge';
import { deviceStatusBadge } from '../helpers/deviceStatusBadge';

const DevicesList = () => {
  const navigate = useNavigate();
  const activeSalePoint = useSalePointsStore((state) => state.activeSalePoint);
  const { devices, loading, error, setActiveTerminalDevice, setActiveControllerDevice } = useDevicesStore(
    useShallow((state) => ({
      devices: state.devices,
      loading: state.loading,
      error: state.error,
      setActiveTerminalDevice: state.setActiveTerminalDevice,
      setActiveControllerDevice: state.setActiveControllerDevice,
    })),
  );

  useEffect(() => {
    getListDevices();
  }, []);

  const goDevice = (terminalDevice, controllerDevice) => {
    setActiveTerminalDevice(terminalDevice);
    setActiveControllerDevice(controllerDevice);

    navigate(`${ROUTES.SALE_POINTS}/${activeSalePoint.id}/device/${terminalDevice.id}/${controllerDevice.id}`);
  };

  return (
    <div className="py-10">
      <h2 className="text-xl font-semibold">Устройства</h2>

      <div className="mt-5 flex flex-col">
        {loading.list ? (
          <div className="mt-10 flex justify-center">
            <Loader2 className="animate-spin" color="var(--color-primary)" />
          </div>
        ) : error.list ? (
          <div className="mt-10 flex justify-start gap-3">
            <CircleAlert color="var(--color-destructive)" />
            <p className="text-destructive">Ошибка получения устройств</p>
          </div>
        ) : (
          <div className="flex flex-row flex-wrap justify-between gap-5">
            {devices.map((terminalDevice) => (
              <Card className="h-auto w-[49%] py-5 max-sm:w-full" key={terminalDevice.id}>
                <CardHeader className="flex flex-row justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Package className="text-primary h-5 w-5" />
                      {terminalDevice.name}
                      <span>(Терминал)</span>
                    </CardTitle>
                    <div>
                      <p className="text-muted-foreground text-sm">Расположение</p>
                      <p className="font-medium">
                        {terminalDevice.address?.locationAddress?.country
                          ? `${terminalDevice.address?.locationAddress?.country}, `
                          : ''}
                        {terminalDevice.address?.locationAddress?.city
                          ? `г. ${terminalDevice.address?.locationAddress?.city}, `
                          : ''}
                        {terminalDevice.address?.locationAddress?.street
                          ? `${terminalDevice.address?.locationAddress?.street} `
                          : ''}
                        {terminalDevice.address?.locationAddress?.building
                          ? `${terminalDevice.address?.locationAddress?.building}`
                          : ''}
                      </p>
                    </div>
                  </div>
                  <div>{deviceStatusBadge(terminalDevice.statusType)}</div>
                </CardHeader>
                <CardContent className="">
                  <p className="text-muted-foreground text-sm">Подключенные устройства</p>
                  {terminalDevice.slaveDevices.map((controllerDevice) => (
                    <div
                      className="hover:border-primary hover:border-1.5 mt-3 cursor-pointer rounded-2xl border p-3 duration-200"
                      onClick={() => goDevice(terminalDevice, controllerDevice)}
                      key={controllerDevice.id}
                    >
                      <div className="flex flex-row flex-wrap justify-between gap-3">
                        <div>
                          <p className="text-muted-foreground text-sm">Имя</p>
                          <p>{controllerDevice.name}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">Тип</p>
                          <p>{controllerDevice.type.description}</p>
                        </div>
                        <div>{deviceStatusBadge(controllerDevice.statusType)}</div>
                        <div>
                          {deviceMatrixBadge(
                            controllerDevice?.deviceProductMatrixPriceList?.matrixId,
                            controllerDevice?.deviceProductMatrixPriceList?.matrixName,
                          )}
                        </div>
                        <div>
                          {devicePriceListBadge(
                            controllerDevice?.deviceProductMatrixPriceList?.priceListId,
                            controllerDevice?.deviceProductMatrixPriceList?.priceListName,
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DevicesList;
