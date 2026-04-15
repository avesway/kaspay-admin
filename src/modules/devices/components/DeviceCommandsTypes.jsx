import React, { useEffect, useState } from 'react';
import { Loader2, CircleAlert, Terminal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { useDevicesStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { getCommandsTypesDevice, sendCommandDevice } from '@/actions/devices.actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';

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
    <Card className="mt-3 w-[49%]">
      <CardHeader className="flex items-center gap-2 text-2xl">
        <Terminal className="h-6 w-6 text-primary" />
        <CardTitle className="flex items-center gap-2 text-2xl">Команды на устройство</CardTitle>
      </CardHeader>
      <CardContent>
        {loading.commandsTypes ? (
          <div className="mt-5 flex justify-center">
            <Loader2 className="animate-spin" color="var(--color-primary)" />
          </div>
        ) : error.commandsTypes ? (
          <div className="mt-5 flex gap-3 justify-center">
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
              Вы действительно хотите отправить на устройство команду "<span className="font-bold text-foreground">{comm}</span>"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start mt-5">
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
