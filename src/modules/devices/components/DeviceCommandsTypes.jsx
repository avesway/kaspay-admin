import React, { useEffect, useState } from 'react';
import { CircleAlert, Loader2, Terminal } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';

import { getCommandsTypesDevice, sendCommandDevice } from '../device.processes';
import { useDevicesStore } from '../devices.store';

const DeviceCommandsTypes = () => {
  const { deviceCommandsTypes, loading, error, activeDevice } = useDevicesStore(
    useShallow((state) => ({
      deviceCommandsTypes: state.deviceCommandsTypes,
      loading: state.loading,
      error: state.error,
      activeDevice: state.activeDevice,
    })),
  );

  const [open, setOpen] = useState('');
  const [comm, setComm] = useState('');
  const [activeCommand, setActiveCommand] = useState(null);

  useEffect(() => {
    getCommandsTypesDevice();
  }, []);

  return (
    <Card className="mt-3 w-[49%] max-sm:w-full">
      <CardHeader className="flex items-center gap-2 text-2xl">
        <Terminal className="text-primary h-6 w-6" />
        <CardTitle className="flex items-center gap-2 text-2xl">Команды на устройство</CardTitle>
      </CardHeader>
      <CardContent>
        {loading.commandsTypes ? (
          <div className="mt-5 flex justify-center">
            <Loader2 className="animate-spin" color="var(--color-primary)" />
          </div>
        ) : error.commandsTypes ? (
          <div className="mt-5 flex justify-center gap-3">
            <CircleAlert color="var(--color-destructive)" />
            <p className="text-destructive">Ошибка получения команд</p>
          </div>
        ) : !deviceCommandsTypes.length ? (
          <div className="mt-5 flex justify-center">
            <p>Нет данных</p>
          </div>
        ) : (
          <div className="flex flex-row flex-wrap gap-3">
            {deviceCommandsTypes
              .filter((i) => i.name != 'checkDoor' && i.name != 'openDoor' && i.name != 'closeDoor')
              .map((item) => (
                <Button
                  key={item.name}
                  // onClick={() => sendCommandDevice({ deviceId: activeDevice.id, description: item.description, type: item.name })}
                  onClick={() => {
                    setOpen(true);
                    setComm(item.description);
                    setActiveCommand(item);
                  }}
                  disabled={loading.sendCommand}
                >
                  {item.description}
                  {/* {loading.sendCommand && <Loader2 className="animate-spin" />} */}
                </Button>
              ))}
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Команда на устройство</DialogTitle>
            <DialogDescription>
              Вы действительно хотите отправить на устройство команду "<span className="text-foreground font-bold">{comm}</span>"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-5 sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Отмена
              </Button>
            </DialogClose>
            <Button
              disabled={loading.sendCommand}
              className="ml-auto"
              onClick={() =>
                sendCommandDevice(
                  {
                    deviceId: activeDevice.id,
                    description: activeCommand?.description,
                    type: activeCommand?.name,
                    ...(activeCommand?.name === 'executeWsRequest'
                      ? {
                          requestBody: {
                            type: 'productDeliveryRequest',
                            productPositionId: 101,
                            deliveryLine: 1,
                            controllerId: 1,
                          },
                        }
                      : {}),
                  },
                  setOpen,
                )
              }
            >
              Отправить
              {loading.sendCommand && <Loader2 className="animate-spin" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DeviceCommandsTypes;
