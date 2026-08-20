import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/shared/ui/button';
import { DialogClose, DialogFooter } from '@/shared/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

import { sendCommandDevice } from '../../device.processes';

const commandSchema = z.object({
  deviceId: z.string().min(1, 'Обязательно для заполнения'),
  controllerId: z.string().min(1, 'Обязательно для заполнения'),
  description: z.string().min(1, 'Обязательно для заполнения'),
  type: z.string().min(1, 'Обязательно для заполнения'),
  ssid: z.string().min(1, 'Обязательно для заполнения'),
  password: z.string().min(1, 'Обязательно для заполнения'),
  ip: z.string().min(1, 'Обязательно для заполнения'),
});

const ChangeControllerWiFi = ({ activeCommand, activeTerminalDevice, activeControllerDevice, loading, setOpen }) => {
  const form = useForm({
    resolver: zodResolver(commandSchema),
    defaultValues: {
      deviceId: activeTerminalDevice.id,
      controllerId: activeControllerDevice.id,
      description: activeCommand.description,
      type: activeCommand.name,
      ssid: '',
      password: '',
      ip: '',
    },
  });

  console.log('activeTerminalDevice', activeTerminalDevice);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => sendCommandDevice(data, setOpen))} className="mt-5 flex flex-col gap-5">
        <FormField
          control={form.control}
          name="ssid"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="gap-1">
                SSID<span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Введите SSID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="gap-1">
                Пароль<span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Введите пароль" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ip"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="gap-1">
                IP<span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Введите IP" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

export default ChangeControllerWiFi;
