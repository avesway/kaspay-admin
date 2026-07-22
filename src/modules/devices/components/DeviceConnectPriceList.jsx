import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { devicesAPI } from '@/modules/devices/devices.api';
import { getPricesListsItems } from '@/modules/priceManagement/pricesLists/pricesLists.processes';
import { usePricesListsStore } from '@/modules/priceManagement/pricesLists/pricesLists.store';
import { getTemplatesMatrices } from '@/modules/products/matrices/matrices.processes';
import { useMatricesStore } from '@/modules/products/matrices/matrices.store';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

import { getListDevices } from '../device.processes';
import { useDevicesStore } from '../devices.store';

const connectPriceListSchema = z.object({
  priceListId: z.string().min(1, 'Укажите прайс лист'),
  matrixId: z.string(),
});

const DeviceConnectPriceList = () => {
  const pricesLists = usePricesListsStore((state) => state.pricesLists);
  const templates = useMatricesStore((state) => state.templates);
  const activeDevice = useDevicesStore((state) => state.activeDevice);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState({ create: false, delete: false });

  const form = useForm({
    resolver: zodResolver(connectPriceListSchema),
    defaultValues: {
      priceListId: '',
      matrixId: '',
    },
  });

  const { setValue } = form;

  useEffect(() => {
    const priceListId = form.watch('priceListId');

    if (priceListId) setValue('matrixId', pricesLists.find((i) => i.id === priceListId)?.matrixId || '');
  }, [form.watch('priceListId')]);

  useEffect(() => {
    if (activeDevice)
      form.reset({
        priceListId: activeDevice?.deviceProductMatrixPriceList?.priceListId || '',
        matrixId: activeDevice?.deviceProductMatrixPriceList?.matrixId || '',
      });
  }, [activeDevice]);

  useEffect(() => {
    getPricesListsItems();
    getTemplatesMatrices();
  }, []);

  async function connectPriceList(data) {
    try {
      setLoading((prev) => ({ ...prev, create: true }));
      const selectedPriceList = pricesLists.find((i) => i.id === data.priceListId);
      const selectMatrix = templates.find((i) => i.id === selectedPriceList.matrixId);

      const payload = {
        ...data,
        deviceId: activeDevice.id,
        type: selectMatrix.type,
      };

      await devicesAPI.connectPriceList(payload);
      await getListDevices(activeDevice.id);

      setOpen(false);
      toast.success('Прайс лист успешно подключен', { position: 'top-center' });
    } catch (error) {
      toast.error('Ошибка подключения', { position: 'top-center' });
    } finally {
      setLoading((prev) => ({ ...prev, create: false }));
    }
  }

  async function removePriceList() {
    try {
      setLoading((prev) => ({ ...prev, delete: true }));

      await devicesAPI.removePriceList(activeDevice?.deviceProductMatrixPriceList?.id);
      await getListDevices(activeDevice.id);

      setOpen(false);
      form.reset({ priceListId: '', matrixId: '' });
      toast.success('Прайс лист успешно удален', { position: 'top-center' });
    } catch (error) {
      toast.error('Ошибка удаления', { position: 'top-center' });
    } finally {
      setLoading((prev) => ({ ...prev, delete: true }));
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto">Прайс листы и Матрицы</Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Подключение Прайс листа и Матрицы</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(connectPriceList)} className="mt-5 flex flex-col gap-5">
            <FormField
              control={form.control}
              name="priceListId"
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <Select value={value} onValueChange={onChange}>
                    <FormLabel className="gap-1">
                      Прайс-лист<span className="text-destructive">*</span>
                    </FormLabel>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Выберите Прайс-лист">
                        {value && pricesLists.find((i) => i.id == value)?.name}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {pricesLists
                          .filter((i) => i.isActive)
                          .map((i) => (
                            <SelectItem key={i.id} value={i.id}>
                              {i.name}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                    <FormMessage />
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="matrixId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-1">Шаблон матрицы</FormLabel>
                  <FormControl>
                    <Input value={templates.find((i) => i.id === field.value)?.name} disabled={true} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-5 sm:justify-end">
              <DialogClose asChild>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  Отмена
                </Button>
              </DialogClose>
              {activeDevice?.deviceProductMatrixPriceList?.id ? (
                <DialogClose asChild>
                  <Button variant="destructive" className="ml-5" onClick={removePriceList} disabled={loading.delete}>
                    Удалить
                    {loading.delete && <Loader2 className="animate-spin" />}
                  </Button>
                </DialogClose>
              ) : null}
              <Button type="submit" className="ml-5" disabled={loading.create || activeDevice?.deviceProductMatrixPriceList?.id}>
                Добавить
                {loading.create && <Loader2 className="animate-spin" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DeviceConnectPriceList;
