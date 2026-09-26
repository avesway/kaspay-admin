import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info, Loader2, Trash2, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/shared/ui/button';
import { DialogClose, DialogFooter } from '@/shared/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';

import useProductForm from '../hooks/useProductForm';
import { getCategories, getCountries } from '../productsCatalog.processes';
import { useProductsCatalogStore } from '../productsCatalog.store';

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
  const { categories, countries } = useProductsCatalogStore(
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-5 flex flex-col gap-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="gap-1">
                Полное название (как в накладной)<span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Coca-Cola Classic газированный напиток 0.5л" type="input" {...field} />
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
                  <Input placeholder="Coca-Cola 0.5л" type="input" {...field} />
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
                  <Input placeholder="4607065597771" type="input" {...field} />
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
                  <Input placeholder="500" type="number" {...field} />
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
                <Select value={value} onValueChange={onChange}>
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
          {['calories', 'proteins', 'fat', 'carbohydrates'].map((key, i) => (
            <FormField
              key={key}
              control={form.control}
              name={`macronutrients.${key}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{['Калории', 'Белки (г)', 'Жиры (г)', 'Углеводы (г)'][i]}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
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
                <Textarea placeholder="Вода, сахар, диоксид углерода..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Изображение товара</FormLabel>
          {!imagePreviewProduct && (
            <>
              <Input ref={fileInputRef} type="file" accept="image/*" onChange={updatePhoto} className="hidden" />
              <Button type="button" variant="outline" onClick={selectImage} className="w-full justify-start">
                <Upload className="mr-2 h-4 w-4" />
                {imageProduct?.name || 'Выберите изображение товара'}
              </Button>
              {imageError && <span className="text-destructive mt-3 text-[12px]">{imageError}</span>}
            </>
          )}
          <div className="mb-2 flex flex-row items-center gap-2">
            <Info size={20} color="var(--color-primary)" />
            <div>
              <p className="text-[12px]">максимальный размер загружаемого файла: 1 MB</p>
              <p className="text-[12px]">допустимый формат: jpeg, jpg, png</p>
            </div>
          </div>
        </FormItem>
        {imagePreviewProduct && (
          <div className="mt-2 flex gap-5">
            <img src={imagePreviewProduct} alt="Предпросмотр" className="h-32 w-32 rounded-md border object-cover" />
            <Button type="button" variant="ghost" size="icon" onClick={deletePhoto} className="text-destructive h-8 w-8">
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
