import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/shared/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { DialogFooter, DialogClose } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Button } from '@/shared/ui/button';
import { useProductsStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { Info, Loader2, Trash2, Upload } from 'lucide-react';
import { getCategories, getCountries } from '@/actions/products.actions';
import useProductForm from '../hooks/useProductForm';

const productSchema = z.object({
  shortName: z.string().min(1, 'Обязательно для заполнения'),
  barcode: z.string().min(1, 'Обязательно для заполнения'),
  name: z.string().min(1, 'Обязательно для заполнения'),
  categoryId: z.preprocess((val) => Number(val), z.number().min(1, 'Укажите категорию')),
  weight: z.preprocess((val) => Number(val), z.number().min(1, { message: 'Вес должен быть минимум 1' })),
  countryCode: z.string().min(1, 'Укажите страну'),
  ingredients: z.string().min(1, 'Обязательно для заполнения'),
  macronutrients: z.object({
    calories: z.preprocess((val) => Number(val), z.number().min(0, { message: 'Число должно быть положительным или нулем' })),
    proteins: z.preprocess((val) => Number(val), z.number().min(0, { message: 'Число должно быть положительным или нулем' })),
    fat: z.preprocess((val) => Number(val), z.number().min(0, { message: 'Число должно быть положительным или нулем' })),
    carbohydrates: z.preprocess(
      (val) => Number(val),
      z.number().min(0, { message: 'Число должно быть положительным или нулем' }),
    ),
  }),
});

const ProductForm = ({ loading, type, product, setOpen }) => {
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      shortName: product?.shortName || '',
      barcode: product?.barcode || '',
      name: product?.name || '',
      categoryId: product?.category?.id.toString() || '',
      weight: product?.weight || '',
      countryCode: product?.country?.code || 'BLR',
      ingredients: product?.ingredients || '',
      macronutrients: {
        calories: product?.macronutrients?.calories || '',
        proteins: product?.macronutrients?.proteins || '',
        fat: product?.macronutrients?.fat || '',
        carbohydrates: product?.macronutrients?.carbohydrates || '',
      },
    },
  });

  const { imagePreviewProduct, imageProduct, imageError, fileInputRef, updatePhoto, deletePhoto, selectImage, handleSubmit } =
    useProductForm(product, type, setOpen);
  const { categories, countries } = useProductsStore(
    useShallow((state) => ({
      categories: state.categories,
      countries: state.countries,
    })),
  );

  useEffect(() => {
    getCategories();
    getCountries();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5 mt-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="gap-1">
                Полное название (как в накладной)<span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Coca-Cola Classic газированный напиток 0.5л" type="input" {...field} className="" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="shortName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gap-1">
                  Короткое название (отображение на терминале)<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Coca-Cola 0.5л" type="input" {...field} className="" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gap-1">
                  Штрихкод<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="4607065597771" type="input" {...field} className="" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-5">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <Select value={value} onValueChange={onChange}>
                  <FormLabel className="gap-1">
                    Категория <span className="text-destructive">*</span>
                  </FormLabel>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите категорию">
                      {value && categories.find((cat) => cat.id == value)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
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
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gap-1">
                  Вес (гр)<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="500" type="number" {...field} className="" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="countryCode"
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <Select value={value} defaultValues="Беларусь" onValueChange={onChange}>
                  <FormLabel className="gap-1">
                    Страна<span className="text-destructive">*</span>
                  </FormLabel>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите страну">
                      {countries.length ? (
                        countries.find((countr) => countr.code === value)?.name
                      ) : (
                        <Loader2 className="animate-spin" />
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
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

        <div className="grid grid-cols-4 gap-5">
          <FormField
            control={form.control}
            name="macronutrients.calories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Калории</FormLabel>
                <FormControl>
                  <Input placeholder="42" type="number" {...field} className="" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="macronutrients.proteins"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Белки (г)</FormLabel>
                <FormControl>
                  <Input placeholder="0" type="number" {...field} className="" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="macronutrients.fat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Жиры (г)</FormLabel>
                <FormControl>
                  <Input placeholder="0" type="number" {...field} className="" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="macronutrients.carbohydrates"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Углеводы (г)</FormLabel>
                <FormControl>
                  <Input placeholder="10.6" type="number" {...field} className="" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="ingredients"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="gap-1">
                Состав <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Вода, сахар, диоксид углерода..." {...field} className="" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Изображение товара</FormLabel>
          <div className="flex flex-row gap-1 mb-2">
            <Info size={15} color="var(--color-primary)" />
            <div>
              <p className="text-[12px]">максимальный размер загружаемого файла: 1 MB</p>
              <p className="text-[12px]">допустимый формат загружаемого файла: jpeg, jpg, png</p>
            </div>
          </div>

          {!imagePreviewProduct && (
            <>
              <Input
                ref={fileInputRef}
                placeholder="Выберите изображение товара"
                type="file"
                accept="image/*"
                onChange={updatePhoto}
                className="cursor-pointer hidden"
              />

              <Button type="button" variant="outline" onClick={selectImage} className="w-full justify-start cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                {imageProduct?.name || 'Выберите изображение товара'}
              </Button>

              {imageError && <span className="mt-3 text-[12px] text-destructive">{imageError}</span>}
            </>
          )}
        </FormItem>
        {imagePreviewProduct && (
          <div className="mt-2 flex gap-5">
            <img src={imagePreviewProduct} alt="Предпросмотр" className="h-32 w-32 object-cover rounded-md border" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={deletePhoto}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Отмена
            </Button>
          </DialogClose>
          <Button type="submit" disabled={loading}>
            {type === 'create' ? 'Добавить товар' : 'Сохранить изменения'}
            {loading && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ProductForm;
