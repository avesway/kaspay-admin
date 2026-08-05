import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlert, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/shared/ui/button';
import { DialogClose, DialogFooter } from '@/shared/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

import { getDeviceControllerLatchModes, sendCommandDevice } from '../../device.processes';

const commandSchema = z.object({
  deviceId: z.string().min(1, 'Обязательно для заполнения'),
  description: z.string().min(1, 'Обязательно для заполнения'),
  type: z.string().min(1, 'Обязательно для заполнения'),
  latchMode: z.string().min(1, 'Обязательно для заполнения'),
});

import { useShallow } from 'zustand/react/shallow';

import { useDevicesStore } from '../../devices.store';

const ChangeControllerLatchMode = ({ activeCommand, activeTerminalDevice, loading, setOpen }) => {
  const { deviceControllerLatchModes, error } = useDevicesStore(
    useShallow((state) => ({
      deviceControllerLatchModes: state.deviceControllerLatchModes,
      loading: state.loading,
      error: state.error,
    })),
  );

  const form = useForm({
    resolver: zodResolver(commandSchema),
    defaultValues: {
      deviceId: activeTerminalDevice.id,
      description: activeCommand.description,
      type: activeCommand.name,
      latchMode: '',
    },
  });

  useEffect(() => {
    getDeviceControllerLatchModes();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => sendCommandDevice(data, setOpen))} className="mt-5 flex flex-col gap-5">
        {error.deviceControllerLatchMode ? (
          <div className="mt-10 flex justify-start gap-3">
            <CircleAlert color="var(--color-destructive)" />
            <p className="text-destructive">Ошибка получения типов</p>
          </div>
        ) : (
          <FormField
            control={form.control}
            name="latchMode"
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <Select value={value} onValueChange={onChange}>
                  <FormLabel className="gap-1">
                    Тип защелки<span className="text-destructive">*</span>
                  </FormLabel>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите тип">
                      {value && deviceControllerLatchModes.find((mode) => mode.id == value)?.description}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {deviceControllerLatchModes.map((mode) => (
                        <SelectItem key={mode.name} value={mode.name}>
                          {mode.description}
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

export default ChangeControllerLatchMode;
