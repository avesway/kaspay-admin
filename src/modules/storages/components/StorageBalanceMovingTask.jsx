import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ArrowRight, Info, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { createMovementTaskManual } from '@/modules/movementTasks/movementTasks.processes';
import { getProductDeviceMatrixItems } from '@/modules/products/productsBalances/productsBalances.processes';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';

import { getListMovingStorages } from '../storages.processes';
import { useStoragesStore } from '../storages.store';

const DISPOSITION_TYPES = ['expiration', 'theft', 'damage'];
const SOURCE_LABELS_BY_TAB = {
  warehouse: 'Основной склад',
  salePoint: 'Мини-склад',
  device: 'Точка продаж',
};
const SOURCE_TYPE_BY_TAB = {
  warehouse: 'warehouse',
  salePoint: 'salePoint',
  device: 'device',
};
const ALL_MOVING_STORAGE_TYPES = 'storageTypes=warehouse&storageTypes=salePoint&storageTypes=device';

const StorageBalanceMovingTask = ({ open, onClose, balance, product, target, storageTab, deviceId, sourceName }) => {
  const isDisposition = DISPOSITION_TYPES.includes(target?.type);
  const maxQuantity = balance?.quantity ?? 0;

  const { movingStorages, loading, error } = useStoragesStore(
    useShallow((state) => ({
      movingStorages: state.movingStorages,
      loading: state.loading,
      error: state.error,
    })),
  );
  const [sourceMatrixItem, setSourceMatrixItem] = useState(null);
  const [targetMatrixItem, setTargetMatrixItem] = useState(null);

  const balanceStorageId = balance?.storageId ?? balance?.storageAmount?.storage?.id;
  const sourceStorages = movingStorages.filter((storage) => storage.type?.name === SOURCE_TYPE_BY_TAB[storageTab]);
  const destinationStorages = movingStorages.filter((storage) => storage.type?.name === target?.type);
  const needsSourceSelect = !balanceStorageId && sourceStorages.length > 1;

  const movingSchema = z.object({
    quantity: z.preprocess(
      (val) => Number(val),
      z.number().min(1, 'Укажите количество').max(maxQuantity, `Максимальное количество: ${maxQuantity}`),
    ),
    ...(needsSourceSelect ? { sourceStorageId: z.preprocess((val) => Number(val), z.number().min(1, 'Укажите склад')) } : {}),
    ...(isDisposition ? {} : { targetStorageId: z.preprocess((val) => Number(val), z.number().min(1, 'Укажите склад')) }),
    description: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(movingSchema),
    defaultValues: {
      name: product?.name || '',
      invoiceNumber: balance?.delivery?.waybillNumber || '',
      invoiceDate: balance?.delivery?.deliveryDate ? format(new Date(balance.delivery.deliveryDate), 'dd.MM.yyyy') : '',
      quantity: '',
      ...(needsSourceSelect ? { sourceStorageId: '' } : {}),
      ...(isDisposition ? {} : { targetStorageId: '' }),
      description: '',
    },
  });

  const targetStorageId = form.watch('targetStorageId');
  const sourceStorageId = form.watch('sourceStorageId');
  const selectedSourceStorage = sourceStorages.find((storage) => storage.id == sourceStorageId);
  const selectedStorage = destinationStorages.find((storage) => storage.id == targetStorageId);
  const resolvedSourceLabel =
    selectedSourceStorage?.name ||
    (sourceStorages.length === 1 ? sourceStorages[0].name : null) ||
    sourceName ||
    SOURCE_LABELS_BY_TAB[storageTab];

  useEffect(() => {
    getListMovingStorages(ALL_MOVING_STORAGE_TYPES);
  }, []);

  useEffect(() => {
    if (storageTab !== 'device' || !deviceId || !product?.id) return;

    async function loadSourceMatrixItems() {
      const items = await getProductDeviceMatrixItems(`deviceId=${deviceId}&productId=${product.id}`);

      if (items?.length) setSourceMatrixItem(items[0]);
    }

    loadSourceMatrixItems();
  }, [deviceId, product?.id, storageTab]);

  useEffect(() => {
    setTargetMatrixItem(null);

    if (!targetStorageId) return;

    const destDeviceId = selectedStorage?.deviceId ?? selectedStorage?.device?.id;

    if (!destDeviceId || !product?.id) return;

    async function loadTargetMatrixItems() {
      const items = await getProductDeviceMatrixItems(`deviceId=${destDeviceId}&productId=${product.id}`);

      if (items?.length) setTargetMatrixItem(items[0]);
    }

    loadTargetMatrixItems();
  }, [targetStorageId, movingStorages]);

  function onSubmit({ quantity, targetStorageId, sourceStorageId, description }) {
    const resolvedSourceStorageId = balanceStorageId ?? sourceStorageId ?? sourceStorages[0]?.id;

    if (!resolvedSourceStorageId) {
      toast.error('Не удалось определить склад источника', { position: 'top-center' });
      return;
    }

    const productId = String(product.id);
    const quantityValue = Number(quantity);

    const positions = isDisposition
      ? [{ type: 'unload', productId, quantity: quantityValue, dispositionType: target.type }]
      : [
          {
            type: 'load',
            productId,
            quantity: quantityValue,
            ...(targetMatrixItem ? { targetMatrixItemId: String(targetMatrixItem.matrixItemId) } : {}),
          },
          {
            type: 'unload',
            productId,
            quantity: quantityValue,
            ...(sourceMatrixItem ? { sourceMatrixItemId: String(sourceMatrixItem.matrixItemId) } : {}),
          },
        ];

    createMovementTaskManual(
      {
        positions,
        loadStorageId: String(isDisposition ? resolvedSourceStorageId : targetStorageId),
        unloadStorageId: String(resolvedSourceStorageId),
        ...(storageTab === 'device' && deviceId ? { deviceId: String(deviceId) } : {}),
        ...(description ? { description } : {}),
      },
      form,
      onClose,
    );
  }

  return (
    <Dialog open={open} onOpenChange={(state) => !state && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Перемещение товара</DialogTitle>
          <DialogDescription>Укажите количество для перемещения.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-5">
            <div className="bg-muted/40 flex items-center gap-4 rounded-lg border p-3">
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs">Откуда</p>
                <p className="truncate text-sm font-medium">{resolvedSourceLabel}</p>
              </div>
              <ArrowRight className="text-muted-foreground h-4 w-4 flex-none" />
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs">Куда</p>
                <p className="truncate text-sm font-medium">
                  {isDisposition ? target.name : selectedStorage ? selectedStorage.name : '—'}
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Полное название</FormLabel>
                  <FormControl>
                    <Input placeholder="Полное название" disabled={true} type="input" {...field} />
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

            {needsSourceSelect && (
              <FormField
                control={form.control}
                name="sourceStorageId"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <Select value={value} onValueChange={onChange}>
                      <FormLabel className="gap-1">
                        Откуда переместить<span className="text-destructive">*</span>
                      </FormLabel>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Укажите склад" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {sourceStorages.map((storage) => (
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
            )}

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
                      <Input placeholder="Введите количество" type="number" max={maxQuantity} {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isDisposition && (
                <FormField
                  control={form.control}
                  name="targetStorageId"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <Select value={value} onValueChange={onChange}>
                        <FormLabel className="gap-1">
                          Куда переместить<span className="text-destructive">*</span>
                        </FormLabel>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Укажите склад" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {loading.movingStorages ? (
                              <div className="flex justify-center p-2">
                                <Loader2 className="animate-spin" />
                              </div>
                            ) : error.movingStorages ? (
                              <p className="text-destructive p-2 text-sm">Ошибка загрузки складов</p>
                            ) : (
                              destinationStorages.map((storage) => (
                                <SelectItem key={storage.id} value={storage.id.toString()}>
                                  {storage.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectGroup>
                        </SelectContent>
                        <FormMessage />
                      </Select>
                    </FormItem>
                  )}
                />
              )}
            </div>

            {(sourceMatrixItem || targetMatrixItem) && (
              <div className="flex items-center gap-2">
                <Info size={16} className="text-primary" />
                <p className="text-muted-foreground text-xs">
                  {sourceMatrixItem && `Позиция в матрице: ${sourceMatrixItem.rowId}:${sourceMatrixItem.columnId}`}
                  {sourceMatrixItem && targetMatrixItem && ' · '}
                  {targetMatrixItem && `Позиция в матрице назначения: ${targetMatrixItem.rowId}:${targetMatrixItem.columnId}`}
                </p>
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
              <Button type="submit">
                {loading.manual && <Loader2 className="animate-spin" />}
                Переместить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StorageBalanceMovingTask;
