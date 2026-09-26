import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/shared/ui/button';
import { DialogClose, DialogFooter } from '@/shared/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

import { getProductUnitType, getUnitShort } from '../helpers/units';
import useDrinkForm from '../hooks/useDrinkForm';
import { getIngredientProducts } from '../productsCoffee.processes';
import { useProductsCoffeeStore } from '../productsCoffee.store';

const drinkSchema = z
  .object({
    name: z.string().min(1, 'Обязательно для заполнения').max(512, 'Максимум 512 символов'),
    shortName: z.string().min(1, 'Обязательно для заполнения'),
    items: z
      .array(
        z.object({
          productId: z.string().min(1, 'Выберите ресурс'),
          unitAmount: z.preprocess((val) => Number(val), z.number().int('Только целое число').min(1, 'Минимум 1')),
        }),
      )
      .min(1, 'Добавьте хотя бы один ресурс'),
  })
  .superRefine((data, ctx) => {
    const seen = new Set();
    data.items.forEach((item, index) => {
      if (!item.productId) return;
      if (seen.has(item.productId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [`items.${index}.productId`],
          message: 'Этот ресурс уже добавлен',
        });
      }
      seen.add(item.productId);
    });
  });

const ITEM_GRID = 'grid grid-cols-[minmax(0,1fr)_150px_36px] items-start gap-3';

const DrinkForm = ({ loading, type, drink, setOpen }) => {
  const form = useForm({
    resolver: zodResolver(drinkSchema),
    defaultValues: {
      name: drink?.name || '',
      shortName: drink?.shortName || '',
      items: drink?.composition?.items?.length
        ? drink.composition.items.map((item) => ({
            productId: item.product?.id?.toString() || '',
            unitAmount: item.unitAmount,
          }))
        : [{ productId: '', unitAmount: 1 }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'items' });
  const { handleSubmit } = useDrinkForm(drink, type, setOpen);

  const { ingredientProducts } = useProductsCoffeeStore(
    useShallow((state) => ({
      ingredientProducts: state.ingredientProducts,
    })),
  );
  const watchedItems = form.watch('items');

  useEffect(() => {
    getIngredientProducts();
  }, []);

  const getRowUnitShort = (productId) => {
    const product = ingredientProducts.find((item) => item.id == productId);
    return getUnitShort(getProductUnitType(product));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-5 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gap-1">
                  Название<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Капучино" type="input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shortName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gap-1">
                  Короткое название (отображение на терминале)<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Капучино" type="input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-3">
          <FormLabel className="gap-1">
            Состав<span className="text-destructive">*</span>
          </FormLabel>
          <div className={`${ITEM_GRID} text-muted-foreground px-1 text-xs`}>
            <span>Ресурс</span>
            <span>Кол-во</span>
            <span />
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className={ITEM_GRID}>
              <FormField
                control={form.control}
                name={`items.${index}.productId`}
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <Select value={value} onValueChange={onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Выберите ресурс">
                            {value && ingredientProducts.find((product) => product.id == value)?.name}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {ingredientProducts.map((product) => (
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
              <FormField
                control={form.control}
                name={`items.${index}.unitAmount`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input placeholder="1" type="number" min={1} step={1} {...field} />
                        <span className="text-muted-foreground w-7 shrink-0 text-xs">
                          {getRowUnitShort(watchedItems[index]?.productId)}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive h-9 w-9"
                disabled={fields.length === 1}
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" className="self-start" onClick={() => append({ productId: '', unitAmount: 1 })}>
            <Plus className="h-4 w-4" />
            Добавить ресурс
          </Button>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Отмена
            </Button>
          </DialogClose>
          <Button type="submit" disabled={loading}>
            {type === 'create' ? 'Добавить напиток' : 'Сохранить изменения'}
            {loading && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default DrinkForm;
