import React, { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

import GeneralForm from './deviceCommandsForms/GeneralForm';
import { getCommandsTypesDevice } from '../device.processes';
import { useDevicesStore } from '../devices.store';

const DeviceCommandsTypes = () => {
  const { deviceCommandsTypes, loading, activeTerminalDevice } = useDevicesStore(
    useShallow((state) => ({
      deviceCommandsTypes: state.deviceCommandsTypes,
      loading: state.loading,
      activeTerminalDevice: state.activeTerminalDevice,
    })),
  );

  const [open, setOpen] = useState('');
  const [activeCommand, setActiveCommand] = useState(null);

  useEffect(() => {
    getCommandsTypesDevice();
  }, []);

  const commandsConnection = ['checkChannel', 'reconnectChannel'];
  const commandsTerminal = [
    'reloadApplication',
    'reloadConfiguration',
    'minimizeApplication',
    'sendLogToPartner',
    'logout',
    'getPosInfo',
    'openShift',
    'closeShift',
    'stopSale',
    'resumeSale',
    'reloadCatalog',
  ];
  const commandsDevice = [
    'openLatch',
    'closeLatch',
    'executeWsRequest',
    'getControllerLog',
    'getControllerStatus',
    'changeControllerLatchMode',
    'updateControllerFirmware',
  ];

  const fff = [
    {
      description: 'Проверка канала связи',
      name: 'checkChannel',
    },
    {
      description: 'Переподключить канал связи',
      name: 'reconnectChannel',
    },
    {
      description: 'Перезагрузить приложение',
      name: 'reloadApplication',
    },
    {
      description: 'Перезагрузить конфигурацию',
      name: 'reloadConfiguration',
    },
    {
      description: 'Свернуть приложение',
      name: 'minimizeApplication',
    },
    {
      description: 'Отправить лог устройства партнеру',
      name: 'sendLogToPartner',
    },
    {
      description: 'Выйти из приложения',
      name: 'logout',
    },
    {
      description: 'Запросить информацию о терминале',
      name: 'getPosInfo',
    },
    {
      description: 'Открыть смену',
      name: 'openShift',
    },
    {
      description: 'Закрыть смену',
      name: 'closeShift',
    },
    {
      description: 'Остановить продажи',
      name: 'stopSale',
    },
    {
      description: 'Возобновить продажи',
      name: 'resumeSale',
    },
    {
      description: 'Перезагрузить каталог с товарами',
      name: 'reloadCatalog',
    },
    {
      description: 'Открыть защелку',
      name: 'openLatch',
    },
    {
      description: 'Закрыть защелку',
      name: 'closeLatch',
    },
    {
      description: 'Выполнить WebSocket запрос',
      name: 'executeWsRequest',
    },
    {
      description: 'Получить лог работы контроллера',
      name: 'getControllerLog',
    },
    {
      description: 'Получить статус контроллера',
      name: 'getControllerStatus',
    },
    {
      description: 'Изменить тип защелки контроллера',
      name: 'changeControllerLatchMode',
    },
    {
      description: 'Обновить прошивку контроллера',
      name: 'updateControllerFirmware',
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="ml-auto">Отправить команду</Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="left">
        <DropdownMenuLabel>Связь</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {deviceCommandsTypes
          .filter((i) => commandsConnection.includes(i.name))
          .map((item) => (
            <DropdownMenuItem
              key={item.name}
              onClick={() => {
                setOpen(true);
                setActiveCommand(item);
              }}
            >
              {item.description}
            </DropdownMenuItem>
          ))}

        <DropdownMenuLabel>Терминал</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {deviceCommandsTypes
          .filter((i) => commandsTerminal.includes(i.name))
          .map((item) => (
            <DropdownMenuItem
              key={item.name}
              onClick={() => {
                setOpen(true);
                setActiveCommand(item);
              }}
            >
              {item.description}
            </DropdownMenuItem>
          ))}

        <DropdownMenuLabel>Устройство</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {deviceCommandsTypes
          .filter((i) => commandsDevice.includes(i.name))
          .map((item) => (
            <DropdownMenuItem
              key={item.name}
              onClick={() => {
                setOpen(true);
                setActiveCommand(item);
              }}
            >
              {item.description}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Команда на устройство</DialogTitle>
            <DialogDescription>
              Вы действительно хотите отправить на устройство команду "
              <span className="text-foreground font-bold">{activeCommand?.description}</span>"?
            </DialogDescription>
          </DialogHeader>

          <GeneralForm
            activeCommand={activeCommand}
            activeTerminalDevice={activeTerminalDevice}
            loading={loading.sendCommand}
            setOpen={setOpen}
          />
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
};

export default DeviceCommandsTypes;
