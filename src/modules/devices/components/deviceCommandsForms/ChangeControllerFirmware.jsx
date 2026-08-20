import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlert, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/shared/ui/button';
import { DialogClose, DialogFooter } from '@/shared/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

import { getDeviceControllerFirmwares, sendCommandDevice } from '../../device.processes';
import { useDevicesStore } from '../../devices.store';

const commandSchema = z.object({
  deviceId: z.string().min(1, 'Обязательно для заполнения'),
  controllerId: z.string().min(1, 'Обязательно для заполнения'),
  description: z.string().min(1, 'Обязательно для заполнения'),
  type: z.string().min(1, 'Обязательно для заполнения'),
  firmware: z.string().min(1, 'Обязательно для заполнения'),
});

const ChangeControllerFirmware = ({ activeCommand, activeTerminalDevice, activeControllerDevice, loading, setOpen }) => {
  const { deviceControllerFirmwares, error } = useDevicesStore(
    useShallow((state) => ({
      deviceControllerFirmwares: state.deviceControllerFirmwares,
      error: state.error,
    })),
  );

  const form = useForm({
    resolver: zodResolver(commandSchema),
    defaultValues: {
      deviceId: activeTerminalDevice.id,
      controllerId: activeControllerDevice.id,
      description: activeCommand.description,
      type: activeCommand.name,
      firmware: '',
    },
  });

  useEffect(() => {
    getDeviceControllerFirmwares();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => sendCommandDevice(data, setOpen))} className="mt-5 flex flex-col gap-5">
        {error.deviceControllerFirmware ? (
          <div className="mt-10 flex justify-start gap-3">
            <CircleAlert color="var(--color-destructive)" />
            <p className="text-destructive">Ошибка получения типов прошивок</p>
          </div>
        ) : (
          <FormField
            control={form.control}
            name="firmware"
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <Select value={value} onValueChange={onChange}>
                  <FormLabel className="gap-1">
                    Прошивка<span className="text-destructive">*</span>
                  </FormLabel>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите прошивку">
                      {value && deviceControllerFirmwares.find((firmware) => firmware.id == value)?.description}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {deviceControllerFirmwares.map((firmware) => (
                        <SelectItem key={firmware.name} value={firmware.name}>
                          {firmware.description}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                  <FormMessage />
                </Select>
              </FormItem>
            )}
          />
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Отмена
            </Button>
          </DialogClose>
          <Button type="submit" disabled={loading}>
            Отправить команду
            {loading && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ChangeControllerFirmware;
