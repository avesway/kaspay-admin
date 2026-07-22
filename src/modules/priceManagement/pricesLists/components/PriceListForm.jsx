import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlert, Loader2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { priceRoundedKopecks, priceRoundedRubles } from '@/helpers/priceHelpers';
import { getTemplatesMatrices } from '@/modules/products/matrices/matrices.processes';
import { useMatricesStore } from '@/modules/products/matrices/matrices.store';
import { getProductsCatalog } from '@/modules/products/productsCatalog/productsCatalog.processes';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

import { pricesListsAPI } from '../pricesLists.api';
import { createPriceList, getProductsPriceList, updatePriceList } from '../pricesLists.processes';
import { usePricesListsStore } from '../pricesLists.store';

const productItemSchema = z.object({
  salePrice: z.preprocess((val) => priceRoundedKopecks(Number(val)), z.number().min(0.01, { message: 'Укажите стоимость' })),
  productId: z.string(),
});

const priceListSchema = z.object({
  name: z.string().min(1, 'Укажите название прайс листа'),
  matrixId: z.string().min(1, 'Выберите шаблон матрицы'),
  currencyCode: z.string(),
  items: z.array(productItemSchema).default([]),
});

const PriceListForm = ({ openForm, setOpenForm }) => {
  const templates = useMatricesStore((state) => state.templates);
  const { loading, error, activePriceList, productsPriceList, setActivePriceList, setProductsPriceList, setError } =
    usePricesListsStore(
      useShallow((state) => ({
        loading: state.loading,
        error: state.error,
        activePriceList: state.activePriceList,
        productsPriceList: state.productsPriceList,
        setActivePriceList: state.setActivePriceList,
        setProductsPriceList: state.setProductsPriceList,
        setError: state.setError,
      })),
    );

  const form = useForm({
    resolver: zodResolver(priceListSchema),
    defaultValues: {
      name: '',
      matrixId: '',
      currencyCode: 'BYN',
      items: [],
    },
  });

  useEffect(() => {
    getTemplatesMatrices();
    getProductsCatalog();
  }, []);

  useEffect(() => {
    const matrixId = form.watch('matrixId');

    if (matrixId) handleGetProductsPriceList(matrixId, activePriceList?.id);
  }, [form.watch('matrixId')]);

  useEffect(() => {
    if (!openForm) {
      setActivePriceList(null);
      setProductsPriceList([]);
      form.reset({
        name: '',
        matrixId: '',
        currencyCode: 'BYN',
        items: [],
      });
      setError({ productsPriceList: false });
    }
  }, [openForm]);

  useEffect(() => {
    if (activePriceList) {
      form.reset({
        ...form.getValues(),
        name: activePriceList.name,
        matrixId: activePriceList.matrixId,
        currencyCode: activePriceList.currencyCode,
        // items: activePriceList.items.map((i) => ({ ...i, salePrice: priceRoundedRubles(i.salePrice) })),
      });
    }
  }, [activePriceList]);

  async function handleGetProductsPriceList(matrixId, priceListId) {
    const products = await getProductsPriceList(matrixId, priceListId);

    if (products.length) {
      form.reset({
        ...form.getValues(),
        items: products.map((i) => ({
          productId: i.productId,
          salePrice: i.salePrice ? priceRoundedRubles(i.salePrice) : priceRoundedRubles(i.balanceSalePrice),
        })),
      });
    }
  }

  async function calculationProductSalePrice(data) {
    const response = await pricesListsAPI.calculationProductPrice(data);

    setProductsPriceList(
      productsPriceList.map((i) => {
        if (i.productBalanceId === response.productBalanceId)
          return { ...i, marginRate: response.marginRate, margin: response.margin };

        return i;
      }),
    );
  }

  return (
    <Sheet open={openForm} onOpenChange={setOpenForm}>
      <SheetTrigger asChild>
        <Button className="">
          <Plus className="h-4 w-4" />
          Создать прайс лист
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[50%] min-w-[50%] overflow-y-auto p-4">
        <SheetHeader>
          <SheetTitle>{activePriceList ? 'Изменение прайс листа' : 'Создание прайс листа'}</SheetTitle>
          <SheetDescription>{activePriceList ? '' : 'Выберите шаблон матрицы для создания прайс листа'}</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              (data) => {
                activePriceList ? updatePriceList(activePriceList.id, data, setOpenForm) : createPriceList(data, setOpenForm);
              },
              (errors) => {
                console.log(errors);
              },
            )}
            className="mt-5 grow"
          >
            <div className="flex flex-row gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-[50%]">
                    <FormLabel className="gap-1">
                      Название прайс листа<span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Введите название прайс листа" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="matrixId"
                render={({ field: { onChange, value } }) => (
                  <FormItem className="w-[50%]">
                    <Select value={value} onValueChange={onChange}>
                      <FormLabel className="gap-1">
                        Шаблон матрицы<span className="text-destructive">*</span>
                      </FormLabel>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите шаблон" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                      <FormMessage />
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-3" />

            {loading.productsPriceList ? (
              <div className="mt-10 flex justify-center">
                <Loader2 className="animate-spin" color="var(--color-primary)" />
              </div>
            ) : null}

            {error.productsPriceList ? (
              <div className="mt-10 flex justify-center gap-5">
                <CircleAlert color="var(--color-destructive)" />
                <p className="text-destructive">Ошибка получения продуктов матрицы</p>
              </div>
            ) : null}

            {productsPriceList.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Поз.</TableHead>
                    <TableHead>Продукт</TableHead>
                    <TableHead>Стоимость</TableHead>
                    <TableHead>Маржа, %</TableHead>
                    <TableHead>Маржа, BYN</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsPriceList.map((item, index) => (
                    <TableRow key={`${item.rowId}:${item.columnId}`}>
                      <TableCell className="font-mono text-xs">
                        {item.rowId}:{item.columnId}
                      </TableCell>
                      <TableCell className="text-xs font-medium whitespace-normal">{item.productName}</TableCell>
                      <TableCell className="flex flex-row items-center gap-2 text-xs font-medium whitespace-normal">
                        <FormField
                          control={form.control}
                          name={`items.${index}.salePrice`}
                          render={({ field: { onChange, value } }) => (
                            <FormItem className="w-20">
                              <FormControl>
                                <Input
                                  placeholder=""
                                  type="number"
                                  value={value}
                                  onChange={({ target }) => {
                                    onChange(target.value);
                                    calculationProductSalePrice({
                                      productId: item.productId,
                                      matrixColumnId: item.matrixColumnId,
                                      productBalanceId: item.productBalanceId,
                                      salePrice: priceRoundedKopecks(target.value),
                                    });
                                  }}
                                />
                              </FormControl>
                              {value != priceRoundedRubles(item.balanceSalePrice) ? (
                                <span className="mt-1 text-[12px]">
                                  Актуальная цена : {priceRoundedRubles(item.balanceSalePrice)}
                                </span>
                              ) : null}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <span>BYN</span>
                      </TableCell>
                      <TableCell className="bg-secondary border-border rounded-full border text-xs font-medium whitespace-normal">
                        {priceRoundedRubles(item.marginRate)} %
                      </TableCell>
                      <TableCell className="text-xs font-medium whitespace-normal">
                        {priceRoundedRubles(item.margin)} BYN
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}

            <SheetFooter className="mt-10">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Отмена
                </Button>
              </SheetClose>
              <Button type="submit" disabled={loading.create || loading.update}>
                {activePriceList ? 'Изменить' : 'Создать'}
                {(activePriceList ? loading.update : loading.create) && <Loader2 className="animate-spin" />}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default PriceListForm;
