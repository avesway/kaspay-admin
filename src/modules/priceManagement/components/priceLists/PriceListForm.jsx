import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/shared/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { DialogFooter, DialogClose } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Button } from '@/shared/ui/button';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useProductsCatalogStore } from '@/modules/products/store';
import { getProductsCatalog } from '@/modules/products/actions/catalog';
import { useShallow } from 'zustand/react/shallow';
import { createPriceList, updatePriceList } from '../../actions/priceLists';

const priceListSchema = z.object({
  name: z.string().min(1, 'Обязательно для заполнения'),
  description: z.string().optional(),
  currencyCode: z.string().min(1, 'Укажите основную валюту'),
  products: z.array(z.object({ productId: z.string().min(1, 'Выберите продукт') })).min(1, 'Добавьте продукт'),
});

const currencies = ['BYN', 'RUB', 'USD', 'EUR'];

const PriceListForm = ({ loading, type, priceList, setOpen }) => {
  const form = useForm({
    resolver: zodResolver(priceListSchema),
    defaultValues: {
      name: priceList?.name || '',
      description: priceList?.description || '',
      currencyCode: priceList?.currencyCode || priceList?.baseCurrency || 'BYN',
      products: priceList?.products?.length
        ? priceList.products.map((product) => ({ productId: (product.productId || product.id).toString() }))
        : [{ productId: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'products' });
  const { products, productsLoading } = useProductsCatalogStore(
    useShallow((state) => ({ products: state.products, productsLoading: state.loading.list })),
  );

  useEffect(() => {
    getProductsCatalog();
  }, []);

  const selectedProducts = form.watch('products');

  const handleSubmit = (values) => {
    const data = {
      name: values.name,
      description: values.description || '',
      currencyCode: values.currencyCode,
      productIds: values.products.map((product) => Number(product.productId)),
    };

    if (type === 'create') {
      createPriceList(data, setOpen);
      return;
    }

    updatePriceList(priceList.id, data, setOpen);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5 mt-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="gap-1">
                Имя<span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Основной прайс лист" type="input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea placeholder="Описание прайс листа" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currencyCode"
          render={({ field: { onChange, value } }) => (
            <FormItem>
              <Select value={value} onValueChange={onChange}>
                <FormLabel className="gap-1">
                  Основная валюта<span className="text-destructive">*</span>
                </FormLabel>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите валюту" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
                <FormMessage />
              </Select>
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-3">
          <FormLabel className="gap-1">
            Продукты<span className="text-destructive">*</span>
          </FormLabel>
          {fields.map((field, index) => {
            const selectedProductIds = selectedProducts.map((product, productIndex) =>
              productIndex === index ? null : product.productId,
            );

            return (
              <div key={field.id} className="flex items-start gap-2">
                <FormField
                  control={form.control}
                  name={`products.${index}.productId`}
                  render={({ field: productField }) => (
                    <FormItem className="w-full">
                      <Select value={productField.value} onValueChange={productField.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={productsLoading ? 'Загрузка продуктов...' : 'Выберите продукт'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {products
                              .filter((product) => !selectedProductIds.includes(product.id.toString()))
                              .map((product) => (
                                <SelectItem key={product.id} value={product.id.toString()}>
                                  {product.name}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {fields.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
          <Button type="button" variant="outline" className="w-fit gap-2" onClick={() => append({ productId: '' })}>
            <Plus className="h-4 w-4" />
            Добавить еще один продукт
          </Button>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Отмена
            </Button>
          </DialogClose>
          <Button type="submit" disabled={loading}>
            {type === 'create' ? 'Добавить прайс лист' : 'Сохранить изменения'}
            {loading && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default PriceListForm;
