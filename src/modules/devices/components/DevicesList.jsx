import { useDevicesStore, useSalePointsStore } from '@/store';
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { useShallow } from 'zustand/react/shallow';
import { useNavigate } from 'react-router';
import { ROUTES } from '@/constants';
import { getListDevices } from '@/actions/devices.actions';
import { CircleAlert, Loader2, Package } from 'lucide-react';

const DevicesList = () => {
  const navigate = useNavigate();
  const activeSalePoint = useSalePointsStore((state) => state.activeSalePoint);
  const { devices, loading, error, setActiveDevice } = useDevicesStore(
    useShallow((state) => ({
      devices: state.devices,
      loading: state.loading,
      error: state.error,
      setActiveDevice: state.setActiveDevice,
    })),
  );

  useEffect(() => {
    getListDevices();
  }, []);

  const goDevice = (device) => {
    setActiveDevice(device);

    navigate(`${ROUTES.SALE_POINTS}/${activeSalePoint.id}/device/${device.id}`);
  };

  return (
    <div className="py-10">
      <h2 className="text-xl font-semibold">Устройства</h2>

      <div className="flex flex-col mt-5">
        {loading.list ? (
          <div className="mt-10 flex justify-center">
            <Loader2 className="animate-spin" color="var(--color-primary)" />
          </div>
        ) : error.list ? (
          <div className="mt-10 flex gap-3 justify-start">
            <CircleAlert color="var(--color-destructive)" />
            <p className="text-destructive">Ошибка получения устройств</p>
          </div>
        ) : (
          devices.map((device) => (
            <Card
              className="w-[48%] h-auto py-5 mb-5 cursor-pointer duration-200 hover:shadow-chart-5"
              key={device.id}
              onClick={() => goDevice(device)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5 text-primary" />
                  {device.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Расположение</p>
                  <p className="font-medium">
                    {device.address?.locationAddress?.country ? `${device.address?.locationAddress?.country}, ` : ''}
                    {device.address?.locationAddress?.city ? `г. ${device.address?.locationAddress?.city}, ` : ''}
                    {device.address?.locationAddress?.street ? `${device.address?.locationAddress?.street} ` : ''}
                    {device.address?.locationAddress?.building ? `${device.address?.locationAddress?.building}` : ''}
                  </p>
                </div>
                <div className="flex justify-between"></div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DevicesList;
