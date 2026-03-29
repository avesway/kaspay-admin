import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import * as z from 'zod';
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
import { Button } from '@/shared/ui/button';
import { FileText, Plus, Trash2, CalendarIcon, Search } from 'lucide-react';
import { Calendar } from '@/shared/ui/calendar';
import { ru } from 'date-fns/locale';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/shared/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Input } from '@/shared/ui/input';
import { Separator } from '@/shared/ui/separator';
import { useProductsStore, useStoragesStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { getProducts } from '@/actions/products.actions';
import { getListSuppliers, registerProducStorage } from '@/actions/storages.actions';
import { storagesAPI } from '@/api/storages.api';
import { priceRoundedKopecks, priceRoundedRubles } from '@/helpers/priceHelpers';

//.min(1, 'Укажите дату производства')
//.min(1, 'Укажите время производства')
//.min(1, { message: 'Срок годности должен быть больше нуля' })

const productItemSchema = z.object({
  productId: z.preprocess((val) => Number(val), z.number().min(1, { message: 'Выберите товар' })),
  quantity: z.preprocess((val) => Number(val), z.number().min(1, { message: 'Количество должно быть больше нуля' })),
  productionAttributes: z
    .object({
      producedAt: z.string().optional(),
      timeProduced: z.string().optional(),
      expirationPeriod: z.preprocess((val) => Number(val), z.number().optional()),
    })
    .superRefine((data, ctx) => {
      const hasAnyField = Boolean(
        data.producedAt || data.timeProduced || (data.expirationPeriod !== undefined && data.expirationPeriod !== 0),
      );

      if (hasAnyField) {
        if (!data.producedAt) {
          ctx.addIssue({
            message: 'Дата производства обязательна',
            path: ['producedAt'],
          });
        }

        if (!data.timeProduced) {
          ctx.addIssue({
            message: 'Время производства обязательно',
            path: ['timeProduced'],
          });
        }

        if (!data.expirationPeriod || data.expirationPeriod <= 0) {
          ctx.addIssue({
            message: 'Срок годности обязателен и должен быть больше 0',
            path: ['expirationPeriod'],
          });
        }
      }
    }),
  priceAttributes: z.object({
    costPrice: z.preprocess((val) => Number(val), z.number().positive({ message: 'Цена должна быть больше нуля' })),
    totalCostPrice: z.preprocess((val) => Number(val), z.number()),
    totalVat: z.preprocess((val) => Number(val), z.number()),
    vatRate: z.preprocess((val) => Number(val), z.number()),
    totalPrice: z.preprocess((val) => Number(val), z.number()),
    currencyCode: z.string(),
  }),
});

const storageRegisterSchema = z.object({
  waybillNumber: z.string().min(1, 'Укажите номер накладной'),
  deliveryDate: z.string().min(1, 'Укажите дату накладной'),
  supplierId: z.preprocess((val) => Number(val), z.number().min(1, { message: 'Укажите поставщика' })),
  storageId: z.preprocess((val) => Number(val), z.number().min(1, { message: 'Укажите склад' })),
  products: z.array(productItemSchema).default([]),
});

const StorageRegisterProduct = () => {
  const [open, setOpen] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openDateProduction, setOpenDateProduction] = useState({});
  const [searchProduct, setSearchProduct] = useState('');
  const products = useProductsStore((state) => state.products);
  const { suppliers, storages } = useStoragesStore(
    useShallow((state) => ({ suppliers: state.suppliers, storages: state.storages })),
  );

  const form = useForm({
    resolver: zodResolver(storageRegisterSchema),
    defaultValues: {
      waybillNumber: '',
      deliveryDate: '',
      supplierId: '',
      storageId: '',
      products: [],
    },
  });

  const { setValue, getValues } = form;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'products',
  });

  useEffect(() => {
    if (open) {
      getListSuppliers();
      getProducts('size=50&page=1');
      if (!fields.length) handleAddRow();
    }
  }, [open]);

  const handleAddRow = () => {
    append({
      productId: '',
      quantity: '',
      productionAttributes: {
        producedAt: '',
        timeProduced: '',
        expirationPeriod: '',
      },
      priceAttributes: {
        totalCostPrice: 0, //стоимость общая
        costPrice: '', //цена за штуку
        totalVat: 0, // сумма НДС
        vatRate: '20', // 20 * 100
        totalPrice: 0, // сумма c НДС
        currencyCode: 'BYN',
      },
    });
  };

  const handleSearchProduct = async (value) => {
    setSearchProduct(value);
    getProducts(`size=50&page=1&shortName=${value}`);
  };

  const handlePriceChange = async (index) => {
    const quantity = Number(getValues(`products.${index}.quantity`));
    const costPrice = priceRoundedKopecks(Number(getValues(`products.${index}.priceAttributes.costPrice`)));
    const vatRate = priceRoundedKopecks(Number(getValues(`products.${index}.priceAttributes.vatRate`)));

    await storagesAPI
      .calculationsDeliveryPrice({ quantity, costPrice, vatRate })
      .then((res) => {
        setValue(`products.${index}.priceAttributes.totalCostPrice`, priceRoundedRubles(res.totalCostPrice));
        setValue(`products.${index}.priceAttributes.totalVat`, priceRoundedRubles(res.totalVat));
        setValue(`products.${index}.priceAttributes.totalPrice`, priceRoundedRubles(res.totalPrice));
      })
      .catch((err) => console.log('Error storagesAPI.calculationsDeliveryPrice', err));
  };

  const itemsVatRate = [
    { value: '0', name: '0%' },
    { value: '10', name: '10%' },
    { value: '20', name: '20%' },
  ];

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button className="">
            <FileText className="h-4 w-4" />
            Оприходование товара
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[80%] min-w-[80%] p-4">
          <SheetHeader>
            <SheetTitle>Оприходование товара</SheetTitle>
            <SheetDescription>Заполните данные накладной для оприходования товара</SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => registerProducStorage(data, form, setOpen))}
              className="flex flex-col gap-5 mt-5 overflow-y-auto"
            >
              <div className="grid grid-cols-4 gap-5">
                <FormField
                  control={form.control}
                  name="waybillNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="gap-1">
                        Номер накладной<span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Введите номер накладной" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryDate"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel className="gap-1">
                        Дата накладной<span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Popover open={openDate} onOpenChange={setOpenDate}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" id="date" className="w-full justify-start">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {value ? `${format(value, 'dd MMMM, y', { locale: ru })}` : 'Выберите дату'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                              mode="single"
                              locale={ru}
                              disabled={{ after: new Date() }}
                              onSelect={(date) => {
                                setOpenDate(false);
                                onChange(format(date, 'yyyy-MM-dd'));
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
                  name="supplierId"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <Select value={value} onValueChange={onChange}>
                        <FormLabel className="gap-1">
                          Поставщик<span className="text-destructive">*</span>
                        </FormLabel>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Выберите поставщика">
                            {value && suppliers.find((sup) => sup.id == value)?.name}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {suppliers.map((supplier) => (
                              <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                {supplier.name}
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
                  name="storageId"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <Select value={value} onValueChange={onChange}>
                        <FormLabel className="gap-1">
                          Склад<span className="text-destructive">*</span>
                        </FormLabel>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Выберите склад">
                            {value && storages.find((war) => war.id == value)?.name}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {storages
                              .filter((item) => item.type?.name === 'warehouse')
                              .map((warehouse) => (
                                <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                  {warehouse.name}
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

              <Separator className="my-1" />

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Товары</h3>
                </div>

                {fields.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Нажмите "Добавить товар" для добавления товара</p>
                )}

                {fields.map((field, index) => (
                  <div key={field.id} className="border border-border rounded-lg p-4 space-y-4 bg-card">
                    <div className="flex flex-row flex-wrap gap-8">
                      <FormField
                        control={form.control}
                        name={`products.${index}.productId`}
                        render={({ field: { onChange, value } }) => (
                          <FormItem className="min-w-[20%]">
                            <Select value={value || ''} onValueChange={onChange}>
                              <FormLabel className="gap-1">
                                Наименование товара<span className="text-destructive">*</span>
                              </FormLabel>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Выберите товар" />
                              </SelectTrigger>
                              <SelectContent position="popper" side="bottom" align="start" className="max-h-96" sideOffset={5}>
                                <div className="sticky top-0 bg-popover z-10 p-2 border-b">
                                  <div className="w-full h-10 relative">
                                    <Search className="w-4 h-4 absolute top-[25%] left-1" color="var(--color-muted-foreground)" />
                                    <Input
                                      placeholder="Введите название товара"
                                      type="text"
                                      className="pl-7"
                                      value={searchProduct}
                                      onChange={({ target }) => handleSearchProduct(target.value)}
                                    />
                                  </div>
                                </div>

                                <SelectSeparator />
                                <SelectGroup>
                                  {products.map((product) => (
                                    <SelectItem key={product.id} value={product.id.toString()}>
                                      {product.name}
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
                        name={`products.${index}.productionAttributes.producedAt`}
                        render={({ field: { onChange, value } }) => (
                          <FormItem>
                            <FormLabel className="gap-1">Дата производства</FormLabel>
                            <FormControl>
                              <Popover
                                open={openDateProduction[index + 1] ? openDateProduction[index + 1] : false}
                                onOpenChange={(v) => setOpenDateProduction((prev) => ({ ...prev, [index + 1]: v }))}
                              >
                                <PopoverTrigger asChild>
                                  <Button variant="outline" id="date" className="w-full justify-start">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {value ? `${format(value, 'dd MMMM, y', { locale: ru })}` : 'Выберите дату'}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    locale={ru}
                                    disabled={{ after: new Date() }}
                                    onSelect={(date) => {
                                      setOpenDateProduction((prev) => ({ ...prev, [index + 1]: false }));
                                      onChange(format(date, "yyyy-MM-dd'T'HH:mm:ssXX"));
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
                        name={`products.${index}.productionAttributes.timeProduced`}
                        render={({ field }) => (
                          <FormItem className="w-36">
                            <FormLabel className="gap-1">Время производства</FormLabel>
                            <FormControl>
                              {/* <Input step="1" type="time" defaultValue="10:30" {...field} /> */}

                              <TimePicker
                                format="HH:mm"
                                disableClock={true}
                                className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                                {...field}
                                style={{ border: 'none' }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`products.${index}.productionAttributes.expirationPeriod`}
                        render={({ field }) => (
                          <FormItem className="min-w-[7%] max-w-[10%]">
                            <FormLabel className="gap-1">Срок год. (ч)</FormLabel>
                            <FormControl>
                              <Input placeholder="Часы" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center ml-auto">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={fields.length < 2}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-row flex-wrap gap-8 mt-8">
                      <FormField
                        control={form.control}
                        name={`products.${index}.quantity`}
                        render={({ field: { onChange, value } }) => (
                          <FormItem className="min-w-[7%] max-w-[10%]">
                            <FormLabel className="gap-1">
                              Кол-во<span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Кол-во"
                                type="number"
                                value={value}
                                onChange={({ target }) => {
                                  onChange(target.value);
                                  handlePriceChange(index);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`products.${index}.priceAttributes.costPrice`}
                        render={({ field: { onChange, value } }) => (
                          <FormItem className="min-w-[8%] max-w-[10%]">
                            <FormLabel className="gap-1">
                              Цена (шт)<span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Цена"
                                type="number"
                                value={value}
                                onChange={({ target }) => {
                                  onChange(target.value);
                                  handlePriceChange(index);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`products.${index}.priceAttributes.vatRate`}
                        render={({ field: { onChange, value } }) => (
                          <FormItem className="min-w-[8%] max-w-[10%]">
                            <Select
                              value={value || ''}
                              onValueChange={(v) => {
                                onChange(v);
                                handlePriceChange(index);
                              }}
                            >
                              <FormLabel>Ставка НДС</FormLabel>
                              <SelectTrigger>
                                <SelectValue placeholder="Ставка">
                                  {value && itemsVatRate.find((sup) => sup.value == value)?.name}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {itemsVatRate?.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                      {item.name}
                                    </SelectItem>
                                  ))}
                                  {/* <SelectItem value={value}>0%</SelectItem>
                                  <SelectItem value={value}>10%</SelectItem>
                                  <SelectItem value={value}>20%</SelectItem> */}
                                </SelectGroup>
                              </SelectContent>
                              <FormMessage />
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`products.${index}.priceAttributes.totalCostPrice`}
                        render={({ field: { value } }) => (
                          <FormItem className="w-36">
                            <FormLabel className="gap-1">Стоимость (общая)</FormLabel>
                            <FormControl>
                              <span className="text-sm h-9">{value} BYN</span>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`products.${index}.priceAttributes.totalVat`}
                        render={({ field: { value } }) => (
                          <FormItem className="w-36">
                            <FormLabel className="gap-1">Сумма НДС (общая)</FormLabel>
                            <FormControl>
                              {/* <Input placeholder="Сумма НДС" type="number" {...field} /> */}
                              <span className="text-sm h-9">{value} BYN</span>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`products.${index}.priceAttributes.totalPrice`}
                        render={({ field: { value } }) => (
                          <FormItem className="w-36">
                            <FormLabel className="gap-1">Стоим. с НДС (общая)</FormLabel>
                            <FormControl>
                              {/* <Input placeholder="Стоим. с НДС" type="number" {...field} /> */}
                              <span className="text-sm h-9">{value} BYN</span>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={handleAddRow} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Добавить товар
                </Button>
              </div>

              <DialogFooter className="sm:justify-start mt-5">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      form.reset();
                      setOpen(false);
                    }}
                  >
                    Отмена
                  </Button>
                </DialogClose>

                <Button type="submit" className="ml-auto">
                  Оприходовать
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
      {/* 
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="">
            <FileText className="h-4 w-4" />
            Оприходование товара
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[98%] max-h-[95vh] top-[30%] translate-y-[-30%]">
          <DialogHeader>
            <DialogTitle>Оприходование товара</DialogTitle>
            <DialogDescription>Заполните данные накладной для оприходования товара</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => registerProducStorage(data, form, setOpen))}
              className="flex flex-col gap-5 mt-5 overflow-y-auto max-h-[calc(90vh-200px)]"
            >
              <div className="grid grid-cols-4 gap-5">
                <FormField
                  control={form.control}
                  name="waybillNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="gap-1">
                        Номер накладной<span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Введите номер накладной" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryDate"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel className="gap-1">
                        Дата накладной<span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Popover open={openDate} onOpenChange={setOpenDate}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" id="date" className="w-full justify-start">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {value ? `${format(value, 'dd MMMM, y', { locale: ru })}` : 'Выберите дату'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                              mode="single"
                              locale={ru}
                              disabled={{ after: new Date() }}
                              onSelect={(date) => {
                                setOpenDate(false);
                                onChange(format(date, 'yyyy-MM-dd'));
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
                  name="supplierId"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <Select value={value} onValueChange={onChange}>
                        <FormLabel className="gap-1">
                          Поставщик<span className="text-destructive">*</span>
                        </FormLabel>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Выберите поставщика">
                            {value && suppliers.find((sup) => sup.id == value)?.name}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {suppliers.map((supplier) => (
                              <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                {supplier.name}
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
                  name="storageId"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <Select value={value} onValueChange={onChange}>
                        <FormLabel className="gap-1">
                          Склад<span className="text-destructive">*</span>
                        </FormLabel>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Выберите склад">
                            {value && storages.find((war) => war.id == value)?.name}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {storages
                              .filter((item) => item.type?.name === 'warehouse')
                              .map((warehouse) => (
                                <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                  {warehouse.name}
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

              <Separator className="my-1" />

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Товары</h3>
                </div>

                {fields.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Нажмите "Добавить товар" для добавления товара</p>
                )}

                {fields.map((field, index) => (
                  <div key={field.id} className="border border-border rounded-lg p-4 space-y-4 bg-card">
                    <div className="flex items-center justify-end mb-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length < 2}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-row flex-wrap gap-5">
                      <FormField
                        control={form.control}
                        name={`products.${index}.productId`}
                        render={({ field: { onChange, value } }) => (
                          <FormItem className="min-w-[20%]">
                            <Select value={value || ''} onValueChange={onChange}>
                              <FormLabel className="gap-1">
                                Наименование товара<span className="text-destructive">*</span>
                              </FormLabel>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Выберите товар" />
                              </SelectTrigger>
                              <SelectContent position="popper" side="bottom" align="start" className="max-h-96" sideOffset={5}>
                                <div className="sticky top-0 bg-popover z-10 p-2 border-b">
                                  <div className="w-full h-10 relative">
                                    <Search className="w-4 h-4 absolute top-[25%] left-1" color="var(--color-muted-foreground)" />
                                    <Input
                                      placeholder="Введите название товара"
                                      type="text"
                                      className="pl-7"
                                      value={searchProduct}
                                      onChange={({ target }) => handleSearchProduct(target.value)}
                                    />
                                  </div>
                                </div>

                                <SelectSeparator />
                                <SelectGroup>
                                  {products.map((product) => (
                                    <SelectItem key={product.id} value={product.id.toString()}>
                                      {product.name}
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
                        name={`products.${index}.quantity`}
                        render={({ field: { onChange, value } }) => (
                          <FormItem className="min-w-[5%] max-w-[8%]">
                            <FormLabel className="gap-1">
                              Кол-во<span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Кол-во"
                                type="number"
                                value={value}
                                onChange={({ target }) => {
                                  onChange(target.value);
                                  handlePriceChange(index);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`products.${index}.priceAttributes.costPrice`}
                        render={({ field: { onChange, value } }) => (
                          <FormItem className="min-w-[5%] max-w-[7%]">
                            <FormLabel className="gap-1">
                              Цена (шт)<span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Цена"
                                type="number"
                                value={value}
                                onChange={({ target }) => {
                                  onChange(target.value);
                                  handlePriceChange(index);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`products.${index}.priceAttributes.vatRate`}
                        render={({ field: { onChange, value } }) => (
                          <FormItem className="min-w-[5%] max-w-[8%]">
                            <Select
                              value={value || ''}
                              onValueChange={(v) => {
                                onChange(v);
                                handlePriceChange(index);
                              }}
                            >
                              <FormLabel>Ставка НДС</FormLabel>
                              <SelectTrigger>
                                <SelectValue placeholder="Ставка">20%</SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value={value}>20%</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                              <FormMessage />
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`products.${index}.priceAttributes.totalCostPrice`}
                        render={({ field: { value } }) => (
                          <FormItem className="min-w-[5%] max-w-[7%]">
                            <FormLabel className="gap-1">Стоимость (общая)</FormLabel>
                            <FormControl>
                              <span className="text-sm h-9">{value} BYN</span>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`products.${index}.priceAttributes.totalVat`}
                        render={({ field: { value } }) => (
                          <FormItem className="min-w-[5%] max-w-[7%]">
                            <FormLabel className="gap-1">Сумма НДС (общая)</FormLabel>
                            <FormControl>
                              <span className="text-sm h-9">{value} BYN</span>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`products.${index}.priceAttributes.totalPrice`}
                        render={({ field: { value } }) => (
                          <FormItem className="min-w-[5%] max-w-[8%]">
                            <FormLabel className="gap-1">Стоим. с НДС (общая)</FormLabel>
                            <FormControl>
                              <span className="text-sm h-9">{value} BYN</span>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`products.${index}.productionAttributes.producedAt`}
                        render={({ field: { onChange, value } }) => (
                          <FormItem>
                            <FormLabel className="gap-1">Дата производства</FormLabel>
                            <FormControl>
                              <Popover
                                open={openDateProduction[index + 1] ? openDateProduction[index + 1] : false}
                                onOpenChange={(v) => setOpenDateProduction((prev) => ({ ...prev, [index + 1]: v }))}
                              >
                                <PopoverTrigger asChild>
                                  <Button variant="outline" id="date" className="w-full justify-start">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {value ? `${format(value, 'dd MMMM, y', { locale: ru })}` : 'Выберите дату'}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    locale={ru}
                                    disabled={{ after: new Date() }}
                                    onSelect={(date) => {
                                      setOpenDateProduction((prev) => ({ ...prev, [index + 1]: false }));
                                      onChange(format(date, "yyyy-MM-dd'T'HH:mm:ssXX"));
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
                        name={`products.${index}.productionAttributes.timeProduced`}
                        render={({ field }) => (
                          <FormItem className="min-w-[5%] max-w-[8%]">
                            <FormLabel className="gap-1">Время производства</FormLabel>
                            <FormControl>
                              <TimePicker
                                format="HH:mm"
                                disableClock={true}
                                className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                                {...field}
                                style={{ border: 'none' }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`products.${index}.productionAttributes.expirationPeriod`}
                        render={({ field }) => (
                          <FormItem className="min-w-[5%] max-w-[8%]">
                            <FormLabel className="gap-1">Срок год. (ч)</FormLabel>
                            <FormControl>
                              <Input placeholder="Часы" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={handleAddRow} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Добавить товар
                </Button>
              </div>

              <DialogFooter className="sm:justify-start mt-5">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      form.reset();
                      setOpen(false);
                    }}
                  >
                    Отмена
                  </Button>
                </DialogClose>

                <Button type="submit" className="ml-auto">
                  Оприходовать
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog> */}
    </>
  );
};

export default StorageRegisterProduct;
