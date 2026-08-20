import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { DialogClose, DialogFooter } from '@/shared/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

import { sendCommandDevice } from '../../device.processes';

const commandSchema = z.object({
  deviceId: z.string().min(1, 'Обязательно для заполнения'),
  controllerId: z.string().min(1, 'Обязательно для заполнения'),
  description: z.string().min(1, 'Обязательно для заполнения'),
  type: z.string().min(1, 'Обязательно для заполнения'),
  limit: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().min(1, 'Значение от 1 до 100').max(100, 'Значение от 1 до 100').optional(),
  ),
  offset: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().int('Должно быть целым числом').min(0, 'Значение от 0').optional(),
  ),
  name: z.string().max(64, 'Максимум 64 символа').optional(),
  fromTime: z.string().optional(),
  toTime: z.string().optional(),
});

const ControllerLogs = ({ activeCommand, activeTerminalDevice, activeControllerDevice, loading, setOpen }) => {
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  const form = useForm({
    resolver: zodResolver(commandSchema),
    defaultValues: {
      deviceId: activeTerminalDevice.id,
      controllerId: activeControllerDevice.id,
      description: activeCommand.description,
      type: activeCommand.name,
      limit: 10,
      offset: 0,
      name: '',
      fromTime: format(new Date(), "yyyy-MM-dd'T'00:00:00"),
      toTime: format(new Date(), "yyyy-MM-dd'T'23:59:59"),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => sendCommandDevice(data, setOpen))} className="mt-5 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gap-1">Limit</FormLabel>
                <FormControl>
                  <Input placeholder="Количество записей (1-100)" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="offset"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gap-1">Offset</FormLabel>
                <FormControl>
                  <Input placeholder="Смещение от самого нового результата" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="gap-1">Name</FormLabel>
              <FormControl>
                <Input placeholder="Точное совпадение имени" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="fromTime"
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <FormLabel className="gap-1">From (включительно)</FormLabel>
                <FormControl>
                  <Popover open={openFrom} onOpenChange={setOpenFrom}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" id="date" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value ? `${format(value, 'dd MMMM, y HH:mm:ss', { locale: ru })}` : 'Выберите дату'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        locale={ru}
                        disabled={{ after: new Date() }}
                        onSelect={(date) => {
                          setOpenFrom(false);
                          onChange(format(date, "yyyy-MM-dd'T'HH:mm:ss"));
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="toTime"
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <FormLabel className="gap-1">To (включительно)</FormLabel>
                <FormControl>
                  <Popover open={openTo} onOpenChange={setOpenTo}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" id="date" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value ? `${format(value, 'dd MMMM, y HH:mm:ss', { locale: ru })}` : 'Выберите дату'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        locale={ru}
                        disabled={{ after: new Date() }}
                        onSelect={(date) => {
                          setOpenTo(false);
                          onChange(format(date, "yyyy-MM-dd'T'HH:mm:ss"));
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

export default ControllerLogs;
