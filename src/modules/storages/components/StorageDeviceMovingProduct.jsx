import React, { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/shared/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { ArrowUpDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { useSalePointsStore } from '@/store';
import { productsBalancesMovemenets } from '@/actions/storages.actions';
import { Textarea } from '@/shared/ui/textarea';
import { getListSaleDevices, getListSalePoints } from '@/actions/salePoints.actions';
import { useShallow } from 'zustand/react/shallow';

const StorageDeviceMovingProduct = ({ product }) => {
  const [open, setOpen] = useState(false);
  const { salePoints, saleDevices } = useSalePointsStore(
    useShallow((state) => ({ salePoints: state.salePoints, saleDevices: state.saleDevices })),
  );
  const productSchema = z.object({
    quantity: z.preprocess(
      (val) => Number(val),
      z
        .number()
        .min(1, 'Укажите количество')
        .max(product.storageAmount.quantity, `Максимальное количество: ${product.storageAmount.quantity}`),
    ),
    salePointId: z.preprocess((val) => Number(val), z.number().min(1, 'Укажите точку продажи')),
    deviceId: z.preprocess((val) => Number(val), z.number().min(1, 'Укажите устройство')),
    description: z.string().optional(),
    type: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.product.name,
      invoiceNumber: product.delivery.waybillNumber,
      invoiceDate: product.delivery.deliveryDate,
      quantity: '',
      storageId: product?.storageAmount?.storage?.id.toString() || '',
      salePointId: '',
      deviceId: '',
      description: '',
      type: 'device',
    },
  });

  useEffect(() => {
    if (open) getListSalePoints();
  }, [open]);

  useEffect(() => {
    const activeSalePoints = form.watch('salePointId');
    if (activeSalePoints) getListSaleDevices(activeSalePoints);
  }, [form.watch('salePointId')]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="">
          <ArrowUpDown className="h-4 w-4" />
          Перемещение на устройство
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Перемещение товара на устройство</DialogTitle>
          <DialogDescription>Укажите устройство и количество для перемещения</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(({ quantity, deviceId, description, type }) =>
              productsBalancesMovemenets(product.id, { quantity, deviceId, description, type }, form, setOpen),
            )}
            className="flex flex-col gap-5 mt-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Полное название</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Coca-Cola Classic газированный напиток 0.5л"
                      disabled={true}
                      type="input"
                      {...field}
                      className=""
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Накладная</FormLabel>
                    <FormControl>
                      <Input placeholder="Накладная" type="input" {...field} className="" disabled={true} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="invoiceDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дата накладной</FormLabel>
                    <FormControl>
                      <Input placeholder="Дата накладной" type="input" {...field} className="" disabled={true} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="gap-1">
                    Количество для перемещения<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Введите количество" type="number" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="salePointId"
                render={({ field: { onChange, value } }) => (
                  <FormItem className="w-full">
                    <Select value={value} onValueChange={onChange}>
                      <FormLabel className="gap-1">
                        Точка продаж <span className="text-destructive">*</span>
                      </FormLabel>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Укажите точку продажи">
                          {value && salePoints.find((salePoint) => salePoint.id == value)?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {salePoints.map((salePoint) => (
                            <SelectItem key={salePoint.id} value={salePoint.id.toString()}>
                              {salePoint.name}
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
                name="deviceId"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <Select value={value} onValueChange={onChange} disabled={!saleDevices.length}>
                      <FormLabel className="gap-1">
                        Устройство<span className="text-destructive">*</span>
                      </FormLabel>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Укажите устройство">
                          {value && saleDevices.find((device) => device.id == value)?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {saleDevices.map((device) => (
                            <SelectItem key={device.id} value={device.id.toString()}>
                              {device.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                      <FormMessage />
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-1">Описание</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Описание перемещения" {...field} className="" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Отмена
                </Button>
              </DialogClose>
              <Button type="submit">Переместить</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StorageDeviceMovingProduct;
