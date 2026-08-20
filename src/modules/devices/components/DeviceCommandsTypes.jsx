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

import ChangeControllerFirmware from './deviceCommandsForms/ChangeControllerFirmware';
import ChangeControllerLatchMode from './deviceCommandsForms/ChangeControllerLatchMode';
import ChangeControllerWiFi from './deviceCommandsForms/ChangeControllerWiFi';
import ControllerLogs from './deviceCommandsForms/ControllerLogs';
import GeneralForm from './deviceCommandsForms/GeneralForm';
import { getCommandsTypesDevice } from '../device.processes';
import { useDevicesStore } from '../devices.store';

const DeviceCommandsTypes = () => {
  const { deviceCommandsTypes, loading, activeTerminalDevice, activeControllerDevice } = useDevicesStore(
    useShallow((state) => ({
      deviceCommandsTypes: state.deviceCommandsTypes,
      loading: state.loading,
      activeTerminalDevice: state.activeTerminalDevice,
      activeControllerDevice: state.activeControllerDevice,
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
    'updateControllerWifi',
    'rebootController',
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

          {activeCommand?.name === 'changeControllerLatchMode' ? (
            <ChangeControllerLatchMode
              activeCommand={activeCommand}
              activeTerminalDevice={activeTerminalDevice}
              loading={loading.sendCommand}
              setOpen={setOpen}
            />
          ) : activeCommand?.name === 'updateControllerWifi' ? (
            <ChangeControllerWiFi
              activeCommand={activeCommand}
              activeTerminalDevice={activeTerminalDevice}
              activeControllerDevice={activeControllerDevice}
              loading={loading.sendCommand}
              setOpen={setOpen}
            />
          ) : activeCommand?.name === 'updateControllerFirmware' ? (
            <ChangeControllerFirmware
              activeCommand={activeCommand}
              activeTerminalDevice={activeTerminalDevice}
              activeControllerDevice={activeControllerDevice}
              loading={loading.sendCommand}
              setOpen={setOpen}
            />
          ) : activeCommand?.name === 'getControllerLog' ? (
            <ControllerLogs
              activeCommand={activeCommand}
              activeTerminalDevice={activeTerminalDevice}
              activeControllerDevice={activeControllerDevice}
              loading={loading.sendCommand}
              setOpen={setOpen}
            />
          ) : (
            <GeneralForm
              activeCommand={activeCommand}
              activeTerminalDevice={activeTerminalDevice}
              loading={loading.sendCommand}
              setOpen={setOpen}
            />
          )}
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
};

export default DeviceCommandsTypes;
