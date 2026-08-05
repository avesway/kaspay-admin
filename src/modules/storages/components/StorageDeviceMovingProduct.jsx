import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUpDown, CircleAlert, Info, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { getProductDeviceMatrixItems } from '@/modules/products/productsBalances/productsBalances.processes';
import { useProductsBalancesStore } from '@/modules/products/productsBalances/productsBalances.store';
import { getListSaleDevices, getListSalePoints } from '@/modules/salePoints/salePoints.processes';
import { useSalePointsStore } from '@/modules/salePoints/salePoints.store';
import { productsBalancesMovemenets } from '@/modules/storages/storages.processes';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';

const StorageDeviceMovingProduct = ({ product }) => {
  const [open, setOpen] = useState(false);
  const [activeTerminal, setActiveTerminal] = useState(null);
  const [isDeviceMatrix, setDeviceMatrix] = useState(false);
  const [matrixItemIds, setMatrixItemIds] = useState([]);
  const { salePoints, saleDevices } = useSalePointsStore(
    useShallow((state) => ({ salePoints: state.salePoints, saleDevices: state.saleDevices })),
  );
  const { loading, error, setLoading, setError } = useProductsBalancesStore(
    useShallow((state) => ({
      loading: state.loading,
      error: state.error,
      setLoading: state.setLoading,
      setError: state.setError,
    })),
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
    if (activeSalePoints) getListSaleDevices(activeSalePoints, 'deviceTypes=terminal');
  }, [form.watch('salePointId')]);

  useEffect(() => {
    const activeDevice = form.watch('deviceId');
    if (activeDevice) checkDeviceMatrix(activeDevice);
  }, [form.watch('deviceId')]);

  async function checkDeviceMatrix(deviceId) {
    const isDeviceMatrix = activeTerminal.slaveDevices.find((device) => device.id === deviceId)?.deviceProductMatrixPriceList;

    if (isDeviceMatrix) {
      const items = await getProductDeviceMatrixItems(`deviceId=${deviceId}&productId=${product.product.id}`);

      if (items) setMatrixItemIds(items);
      setDeviceMatrix(true);
      return;
    }

    setDeviceMatrix(false);
    setMatrixItemIds([]);
    setError({ productDeviceMatrixItems: false });
    setLoading({ productDeviceMatrixItems: false });
  }

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
              productsBalancesMovemenets(product.id, { quantity, deviceId, description, type, matrixItemIds }, form, setOpen),
            )}
            className="mt-5 flex flex-col gap-5"
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
                    <DropdownMenu>
                      <FormLabel className="gap-1">
                        Устройство<span className="text-destructive">*</span>
                      </FormLabel>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-start" disabled={!saleDevices.length}>
                          {value ? activeTerminal.slaveDevices.find((device) => device.id === value)?.name : 'Устройство'}
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DropdownMenuLabel>Терминалы</DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        {saleDevices.map((terminal) => (
                          <DropdownMenuSub key={terminal.id}>
                            <DropdownMenuSubTrigger>{terminal.name}</DropdownMenuSubTrigger>

                            <DropdownMenuSubContent>
                              {terminal.slaveDevices.map((device) => (
                                <DropdownMenuItem
                                  key={device.id}
                                  onClick={() => {
                                    setActiveTerminal(terminal);
                                    onChange(device.id);
                                  }}
                                >
                                  {device.name}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormItem>
                )}
              />
            </div>

            {loading.productDeviceMatrixItems ? (
              <div className="mt-5 flex justify-center">
                <Loader2 className="animate-spin" color="var(--color-primary)" />
              </div>
            ) : error.productDeviceMatrixItems ? (
              <div className="mt-5 flex justify-center gap-3">
                <CircleAlert color="var(--color-destructive)" />
                <p className="text-destructive">Ошибка </p>
              </div>
            ) : (
              <div>
                {isDeviceMatrix ? (
                  matrixItemIds.length ? (
                    <div>
                      <FormLabel className="gap-1">Продукт в матрице</FormLabel>
                      {matrixItemIds.map((item) => (
                        <div key={item.matrixItemId} className="mt-3 ml-3 flex flex-row items-center justify-between">
                          <p className="mr-2 font-mono text-xs font-bold">
                            {item.rowId}:{item.columnId}
                          </p>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info size={20} color="var(--color-primary)" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Позиция продукта в матрице:</p>
                              <p>
                                Ряд: {item.rowId}, Колонка: {item.columnId}
                              </p>
                            </TooltipContent>
                          </Tooltip>

                          <Input
                            placeholder="Введите количество"
                            className="mr-3 ml-auto w-20"
                            type="number"
                            max={item.columnProductQuantity}
                            value={item.actualQuantity.toString()}
                            onChange={({ target }) => {
                              setMatrixItemIds((prev) =>
                                prev.map((i) =>
                                  i.matrixItemId === item.matrixItemId ? { ...i, actualQuantity: target.value.toString() } : i,
                                ),
                              );

                              form.setValue('quantity', target.value.toString());
                            }}
                          />
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info size={20} color="var(--color-primary)" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Максимальное количество в ячейке матрицы: {item.columnProductQuantity}</p>
                              <p>Недостающее количество в ячейке: {item.missingQuantity - item.actualQuantity}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mb-2 flex flex-row items-center gap-2">
                      <Info size={20} color="var(--color-primary)" />
                      <div>
                        <p className="text-[12px]">Перемещение продукта, находящегося не в матрице невозможно</p>
                      </div>
                    </div>
                  )
                ) : (
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
                )}
                {/* {!matrixItemIds.length || !isDeviceMatrix ? (
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
                ) : (
                  <div>
                    <FormLabel className="gap-1">Продукт в матрице</FormLabel>
                    {matrixItemIds.map((item) => (
                      <div key={item.matrixItemId} className="mt-3 ml-3 flex flex-row items-center justify-between">
                        <p className="mr-2 font-mono text-xs font-bold">
                          {item.rowId}:{item.columnId}
                        </p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info size={20} color="var(--color-primary)" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Позиция продукта в матрице:</p>
                            <p>
                              Ряд: {item.rowId}, Колонка: {item.columnId}
                            </p>
                          </TooltipContent>
                        </Tooltip>

                        <Input
                          placeholder="Введите количество"
                          className="mr-3 ml-auto w-20"
                          type="number"
                          max={item.columnProductQuantity}
                          value={item.actualQuantity.toString()}
                          onChange={({ target }) => {
                            setMatrixItemIds((prev) =>
                              prev.map((i) =>
                                i.matrixItemId === item.matrixItemId ? { ...i, actualQuantity: target.value.toString() } : i,
                              ),
                            );

                            form.setValue('quantity', target.value.toString());
                          }}
                        />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info size={20} color="var(--color-primary)" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Максимальное количество в ячейке матрицы: {item.columnProductQuantity}</p>
                            <p>Недостающее количество в ячейке: {item.missingQuantity - item.actualQuantity}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                )} */}
              </div>
            )}

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
