import React, { useEffect, useState } from 'react';
import { CheckCircle, CircleX, DollarSign, Info } from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';

import { useDevicesStore } from '../devices.store';

const DeviceInfo = () => {
  const activeControllerDevice = useDevicesStore((state) => state.activeControllerDevice);
  const [dataInfo, setDataInfo] = useState(null);

  useEffect(() => {
    if (activeControllerDevice) {
      let typeStatus;
      let typeMatrix;
      let typePriceList;

      typeStatus =
        activeControllerDevice.statusType.name === 'active'
          ? 'success'
          : activeControllerDevice.statusType.name === 'delivery'
            ? 'warning'
            : 'error';
      typeMatrix = activeControllerDevice?.deviceProductMatrixPriceList?.matrixId ? 'success' : 'warning';
      typePriceList = activeControllerDevice?.deviceProductMatrixPriceList?.priceListId ? 'success' : 'warning';

      handleDataInfo(activeControllerDevice, typeStatus, typeMatrix, typePriceList);
    }
  }, [activeControllerDevice]);

  function handleDataInfo(device, typeStatus, typeMatrix, typePriceList) {
    setDataInfo([
      {
        id: 1,
        title: 'Статус',
        icon: renderIcon(typeStatus),
        description: (
          <Badge variant="outline" className={renderBadgeStyle(typeStatus)}>
            {device.statusType.description}
          </Badge>
        ),
      },
      {
        id: 2,
        title: 'Матрица',
        icon: renderIcon(typeMatrix),
        description: (
          <Badge variant="outline" className={renderBadgeStyle(typeMatrix)}>
            {typeMatrix === 'success' ? device?.deviceProductMatrixPriceList?.matrixName : 'Не подключена'}
          </Badge>
        ),
      },
      {
        id: 3,
        title: 'Прайс лист',
        icon: renderIcon(typePriceList),
        description: (
          <Badge variant="outline" className={renderBadgeStyle(typePriceList)}>
            {typePriceList === 'success' ? device?.deviceProductMatrixPriceList?.priceListName : 'Не подключен'}
          </Badge>
        ),
      },
      {
        id: 4,
        title: 'Базовые цены',
        icon: <DollarSign size={20} color={typePriceList === 'warning' ? 'var(--color-green-500)' : 'var(--color-orange-500)'} />,
        description: (
          <Badge
            variant="outline"
            className={
              typePriceList === 'warning'
                ? 'border-b-green-500 bg-green-50 text-green-500'
                : 'border-b-orange-500 bg-orange-50 text-orange-500'
            }
          >
            {typePriceList === 'warning' ? 'Активны' : 'Не активны'}
          </Badge>
        ),
      },
    ]);
  }

  function renderIcon(type) {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} color="var(--color-green-500)" />;
      case 'warning':
        return <Info size={20} color="var(--color-orange-500)" />;
      case 'error':
        return <CircleX size={20} color="var(--color-destructive)" />;
    }
  }

  function renderBadgeStyle(type) {
    switch (type) {
      case 'success':
        return 'border-b-green-500 bg-green-50 text-green-500';
      case 'warning':
        return 'border-b-orange-500 bg-orange-50 text-orange-500';
      case 'error':
        return 'border-b-destructive bg-destructive/10 text-destructive';
    }
  }

  return (
    dataInfo?.length && (
      <Card className="mt-5 w-auto">
        <CardContent className="flex flex-row gap-20">
          {dataInfo.map((i) => (
            <div key={i.id}>
              <span className="text-muted-foreground text-[14px]">{i.title}</span>
              <div className="mt-2 flex flex-row items-center gap-2">
                <div>{i.icon}</div>
                {i.description}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  );
};

export default DeviceInfo;
