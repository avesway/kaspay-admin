import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftRight, ArrowRight, Info, Loader2, PackageMinus, PackagePlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { cn } from '@/lib/utils';
import { getPricesListsItems } from '@/modules/priceManagement/pricesLists/pricesLists.processes';
import { usePricesListsStore } from '@/modules/priceManagement/pricesLists/pricesLists.store';
import { getTemplatesMatrices } from '@/modules/products/matrices/matrices.processes';
import { useMatricesStore } from '@/modules/products/matrices/matrices.store';
import { getProductsSingle } from '@/modules/products/productsSingle/catalog/productsSingle.processes';
import { useProductsSingleStore } from '@/modules/products/productsSingle/catalog/productsSingle.store';
import { Badge } from '@/shared/ui/badge';
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
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

import {
  attachMatrixToDevice,
  detachMatrixFromDevice,
  getMatrixAttachPreview,
  getMatrixReplacementPreview,
  replaceMatrixOnDevice,
  updateDevicePriceList,
} from '../device.processes';
import { useDevicesStore } from '../devices.store';

const connectMatrixSchema = z.object({
  matrixId: z.string().min(1, 'Выберите матрицу'),
  priceListId: z.string().min(1, 'Укажите прайс лист'),
});

const PreviewSection = ({ icon: Icon, iconClassName, title, count, children }) => (
  <div className="overflow-hidden rounded-lg border">
    <div className="bg-muted/40 flex items-center gap-2 border-b px-3 py-2">
      <Icon className={`h-4 w-4 ${iconClassName}`} />
      <p className="text-sm font-semibold">{title}</p>
      <Badge variant="secondary" className="ml-auto">
        {count}
      </Badge>
    </div>
    <div className="divide-y">{children}</div>
  </div>
);

const DeviceConnectMatrix = () => {
  const templates = useMatricesStore((state) => state.templates);
  const pricesLists = usePricesListsStore((state) => state.pricesLists);
  const products = useProductsSingleStore((state) => state.products);
  const { activeTerminalDevice, activeControllerDevice, loading } = useDevicesStore(
    useShallow((state) => ({
      activeTerminalDevice: state.activeTerminalDevice,
      activeControllerDevice: state.activeControllerDevice,
      loading: state.loading,
    })),
  );

  const link = activeControllerDevice?.deviceProductMatrixPriceList;
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);

  const form = useForm({
    resolver: zodResolver(connectMatrixSchema),
    defaultValues: {
      matrixId: '',
      priceListId: '',
    },
  });

  const matrixId = form.watch('matrixId');
  const priceListId = form.watch('priceListId');

  const isMatrixChanged = Boolean(link?.id) && Boolean(matrixId) && matrixId !== link.matrixId;
  const isPriceListChanged = Boolean(link?.id) && Boolean(priceListId) && priceListId !== link.priceListId;
  const isNothingChanged = Boolean(link?.id) && !isMatrixChanged && !isPriceListChanged;

  const matrixPriceLists = pricesLists.filter((priceList) => priceList.isActive && priceList.matrixId === matrixId);

  useEffect(() => {
    if (!open) {
      setPreview(null);
      return;
    }

    getPricesListsItems();
    getTemplatesMatrices();
    getProductsSingle();

    form.reset({
      matrixId: link?.matrixId || '',
      priceListId: link?.priceListId || '',
    });
  }, [open]);

  const handleMatrixChange = (onChange) => (value) => {
    onChange(value);

    const lists = pricesLists.filter((priceList) => priceList.isActive && priceList.matrixId === value);
    const linkedPriceList = link?.matrixId === value && lists.some((priceList) => priceList.id === link.priceListId);

    form.setValue('priceListId', (linkedPriceList && link.priceListId) || lists[0]?.id || '');
  };

  async function handlePreview() {
    if (!link?.id) {
      const result = await getMatrixAttachPreview(activeControllerDevice.id, matrixId);

      if (result) setPreview({ kind: 'attach', ...result });
      return;
    }

    if (isMatrixChanged) {
      const result = await getMatrixReplacementPreview(link.id, matrixId);

      if (result) setPreview({ kind: 'replace', ...result });
      return;
    }

    const isSuccess = await updateDevicePriceList(link.id, priceListId);

    if (isSuccess) setOpen(false);
  }

  async function handleApplyPreview() {
    const { matrixId, priceListId } = form.getValues();
    let isSuccess = false;

    if (preview.kind === 'attach') {
      isSuccess = await attachMatrixToDevice({
        deviceId: activeControllerDevice.id,
        matrixId,
        priceListId,
      });
    } else {
      isSuccess = await replaceMatrixOnDevice(link.id, matrixId, priceListId !== link.priceListId ? priceListId : null);
    }

    if (isSuccess) {
      setPreview(null);
      setOpen(false);
    }
  }

  async function handleDetach() {
    const isSuccess = await detachMatrixFromDevice(link.id);

    if (isSuccess) {
      form.reset({ matrixId: '', priceListId: '' });
      setOpen(false);
    }
  }

  const getProductName = (productId) => products.find((product) => product.id === productId)?.name || productId;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto">Прайс листы и Матрицы</Button>
      </DialogTrigger>
      <DialogContent
        className={cn('max-h-[85vh] grid-rows-[auto_minmax(0,1fr)_auto]', preview ? 'sm:max-w-[680px]' : 'sm:max-w-[520px]')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle>Матрица и прайс-лист</DialogTitle>
          {preview ? <DialogDescription>Проверьте изменения перед применением</DialogDescription> : null}
        </DialogHeader>

        {preview ? (
          <div className="min-h-0 overflow-y-auto pr-1">
            <div className="flex flex-col gap-3">
              {preview.hasChanges ? (
                <>
                  {Boolean(preview.moves?.length) && (
                    <PreviewSection
                      icon={ArrowLeftRight}
                      iconClassName="text-primary"
                      title="Перемещение в новую матрицу"
                      count={preview.moves.length}
                    >
                      {preview.moves.map((row) => (
                        <div key={row.sourceMatrixItemId} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm">
                          <div className="flex flex-none items-center gap-1.5">
                            <Badge variant="outline" className="font-mono">
                              {row.sourceRowId}:{row.sourceColumnId}
                            </Badge>
                            <ArrowRight className="text-muted-foreground h-3.5 w-3.5" />
                            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary font-mono">
                              {row.targetRowId}:{row.targetColumnId}
                            </Badge>
                          </div>
                          <span className="min-w-0 flex-1 truncate text-left font-medium">{getProductName(row.productId)}</span>
                          <Badge variant="secondary" className="flex-none">
                            {row.quantity} шт
                          </Badge>
                        </div>
                      ))}
                    </PreviewSection>
                  )}

                  {Boolean(preview.surplus?.length) && (
                    <PreviewSection icon={PackageMinus} iconClassName="text-orange-500" title="Излишки — изъять на склад" count={preview.surplus.length}>
                      {preview.surplus.map((row) => (
                        <div key={row.sourceMatrixItemId} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm">
                          <Badge variant="outline" className="flex-none font-mono">
                            {row.sourceRowId}:{row.sourceColumnId}
                          </Badge>
                          <span className="min-w-0 flex-1 truncate text-left font-medium">{getProductName(row.productId)}</span>
                          <Badge variant="outline" className="border-orange-500 bg-orange-50 text-orange-500 flex-none">
                            изъять {row.quantity} шт
                          </Badge>
                        </div>
                      ))}
                    </PreviewSection>
                  )}

                  {Boolean(preview.missing?.length) && (
                    <PreviewSection icon={PackagePlus} iconClassName="text-green-600" title="Недостающее — догрузить" count={preview.missing.length}>
                      {preview.missing.map((row) => (
                        <div key={row.targetMatrixItemId} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm">
                          <Badge variant="outline" className="flex-none font-mono">
                            {row.targetRowId}:{row.targetColumnId}
                          </Badge>
                          <span className="min-w-0 flex-1 truncate text-left font-medium">{getProductName(row.productId)}</span>
                          <Badge variant="outline" className="border-green-600 bg-green-50 text-green-600 flex-none">
                            догрузить {row.quantity} шт
                          </Badge>
                        </div>
                      ))}
                    </PreviewSection>
                  )}
                </>
              ) : (
                <div className="bg-muted/40 flex items-center gap-2 rounded-lg border p-3">
                  <Info size={16} className="text-primary" />
                  <p className="text-sm">Изменений нет — выбранная матрица уже соответствует текущей</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="min-h-0 overflow-y-auto">
            <Form {...form}>
              <form id="connect-matrix-form" onSubmit={form.handleSubmit(handlePreview)} className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="matrixId"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <Select value={value} onValueChange={handleMatrixChange(onChange)}>
                        <FormLabel className="gap-1">
                          Матрица<span className="text-destructive">*</span>
                        </FormLabel>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Выберите матрицу" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {templates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
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
                  name="priceListId"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <Select value={value} onValueChange={onChange} disabled={!matrixId}>
                        <FormLabel className="gap-1">
                          Прайс-лист<span className="text-destructive">*</span>
                        </FormLabel>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={matrixId ? 'Выберите прайс-лист' : 'Сначала выберите матрицу'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {matrixPriceLists.map((priceList) => (
                              <SelectItem key={priceList.id} value={priceList.id}>
                                {priceList.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                        <FormMessage />
                      </Select>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        )}

        {preview ? (
          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => setPreview(null)} disabled={loading.matrixLink}>
              Назад
            </Button>
            <Button type="button" onClick={handleApplyPreview} disabled={!preview.hasChanges || loading.matrixLink}>
              {loading.matrixLink && <Loader2 className="animate-spin" />}
              {preview.kind === 'attach' ? 'Закрепить' : 'Заменить'}
            </Button>
          </DialogFooter>
        ) : (
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Отмена
              </Button>
            </DialogClose>
            {link?.id ? (
              <Button type="button" variant="destructive" className="ml-5" onClick={handleDetach} disabled={loading.matrixDetach}>
                {loading.matrixDetach && <Loader2 className="animate-spin" />}
                Открепить
              </Button>
            ) : null}
            <Button type="submit" form="connect-matrix-form" className="ml-5" disabled={loading.matrixPreview || isNothingChanged}>
              {loading.matrixPreview && <Loader2 className="animate-spin" />}
              {link?.id && !isMatrixChanged ? 'Сохранить' : 'Далее'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeviceConnectMatrix;
