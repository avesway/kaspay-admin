import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/shared/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { DialogFooter, DialogClose } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Button } from '@/shared/ui/button';
import { useShallow } from 'zustand/react/shallow';
import { Info, Loader2, Trash2, Upload } from 'lucide-react';
import { useProductsCatalogStore } from '@/modules/products/store';
import { getCategories, getCountries } from '../../actions/catalog';
import useProductCoffeeMachineForm from '../../hooks/useProductCoffeeMachineForm';

const productSchema = z.object({
  shortName: z.string().min(1, 'Обязательно для заполнения'),
  barcode: z.string().min(1, 'Обязательно для заполнения'),
  name: z.string().min(1, 'Обязательно для заполнения'),
  categoryId: z.preprocess((val) => Number(val), z.number().min(1, 'Укажите категорию')),
  weight: z.preprocess((val) => Number(val), z.number().min(1, { message: 'Вес должен быть минимум 1' })),
});

const ProductCaffeeMachineForm = ({ loading, type, product, setOpen }) => {
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      shortName: product?.shortName || '',
      barcode: product?.barcode || '',
      name: product?.name || '',
      categoryId: product?.category?.id.toString() || '',
      weight: product?.weight || '',
    },
  });

  const { imagePreviewProduct, imageProduct, imageError, fileInputRef, updatePhoto, deletePhoto, selectImage, handleSubmit } =
    useProductCoffeeMachineForm(product, type, setOpen);
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
        </div>
        <FormItem>
          <FormLabel>Изображение товара</FormLabel>
          {!imagePreviewProduct && (
            <>
              <Input ref={fileInputRef} type="file" accept="image/*" onChange={updatePhoto} className="hidden" />
              <Button type="button" variant="outline" onClick={selectImage} className="w-full justify-start">
                <Upload className="mr-2 h-4 w-4" />
                {imageProduct?.name || 'Выберите изображение товара'}
              </Button>
              {imageError && <span className="mt-3 text-[12px] text-destructive">{imageError}</span>}
            </>
          )}
          <div className="flex flex-row items-center gap-2 mb-2">
            <Info size={20} color="var(--color-primary)" />
            <div>
              <p className="text-[12px]">максимальный размер загружаемого файла: 1 MB</p>
              <p className="text-[12px]">допустимый формат: jpeg, jpg, png</p>
            </div>
          </div>
        </FormItem>
        {imagePreviewProduct && (
          <div className="mt-2 flex gap-5">
            <img src={imagePreviewProduct} alt="Предпросмотр" className="h-32 w-32 object-cover rounded-md border" />
            <Button type="button" variant="ghost" size="icon" onClick={deletePhoto} className="h-8 w-8 text-destructive">
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

export default ProductCaffeeMachineForm;
