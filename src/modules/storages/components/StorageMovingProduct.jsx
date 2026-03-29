import React, { useState } from 'react';
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
import { useStoragesStore } from '@/store';
import { productsBalancesMovemenets } from '@/actions/storages.actions';
import { Textarea } from '@/shared/ui/textarea';

const StorageMovingProduct = ({ product }) => {
  const [open, setOpen] = useState(false);
  const storages = useStoragesStore((state) => state.storages);

  const productSchema = z.object({
    quantity: z.preprocess(
      (val) => Number(val),
      z
        .number()
        .min(1, 'Укажите количество')
        .max(product.storageAmount.quantity, `Максимальное количество: ${product.storageAmount.quantity}`),
    ),
    storageId: z.preprocess((val) => Number(val), z.number().min(1, 'Укажите склад')),
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
      description: '',
      type: 'storage',
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="">
          <ArrowUpDown className="h-4 w-4" />
          Перемещение
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Перемещение товара</DialogTitle>
          <DialogDescription>Укажите количество и склад для перемещения</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(({ description, type, storageId, quantity }) =>
              productsBalancesMovemenets(product.id, { description, type, storageId, quantity }, form, setOpen),
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

            <div className="grid grid-cols-2 gap-5">
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
              <FormField
                control={form.control}
                name="storageId"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <Select value={value} onValueChange={onChange}>
                      <FormLabel className="gap-1">
                        Перемещение на склад <span className="text-destructive">*</span>
                      </FormLabel>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Укажите склад">
                          {value && storages.find((war) => war.id == value)?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {storages
                            .filter((storage) => storage.type.name === 'warehouse' || storage.type.name === 'salePoint')
                            .map((storage) => (
                              <SelectItem key={storage.id} value={storage.id.toString()}>
                                {storage.name}
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

export default StorageMovingProduct;
