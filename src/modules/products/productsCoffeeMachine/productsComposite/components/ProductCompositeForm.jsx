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

import { getCategories } from '../../../productsSingle/catalog/productsSingle.processes';
import { useProductsSingleStore } from '../../../productsSingle/catalog/productsSingle.store';
import useProductCompositeForm from '../hooks/useProductCompositeForm';
import { getUnitTypes } from '../productsComposite.processes';
import { useProductsCompositeStore } from '../productsComposite.store';

const productSchema = z.object({
  shortName: z.string().min(1, 'Обязательно для заполнения'),
  barcode: z.string().min(1, 'Обязательно для заполнения'),
  name: z.string().min(1, 'Обязательно для заполнения'),
  categoryId: z.preprocess((val) => Number(val), z.number().min(1, 'Укажите категорию')),
  quantity: z.preprocess((val) => Number(val), z.number().min(1, 'Количество должно быть минимум 1')),
  unitType: z.string().min(1, 'Укажите единицу измерения'),
});

const ProductCompositeForm = ({ loading, type, product, setOpen }) => {
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      shortName: product?.shortName || '',
      barcode: product?.barcode || '',
      name: product?.name || '',
      categoryId: product?.category?.id.toString() || '',
      quantity: product?.quantity || '',
      unitType: product?.unitType?.name || '',
    },
  });

  const { imagePreviewProduct, imageProduct, imageError, fileInputRef, updatePhoto, deletePhoto, selectImage, handleSubmit } =
    useProductCompositeForm(product, type, setOpen);
  const { categories } = useProductsSingleStore(
    useShallow((state) => ({
      categories: state.categories,
    })),
  );
  const { unitTypes } = useProductsCompositeStore(
    useShallow((state) => ({
      unitTypes: state.unitTypes,
    })),
  );

  useEffect(() => {
    getCategories();
    getUnitTypes();
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
                Название (как в накладной)<span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Молоко 3.2% простоквашино 1л" type="input" {...field} />
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
                  <Input placeholder="Молоко 3.2%" type="input" {...field} />
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
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gap-1">
                  Количество<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="200" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unitType"
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <Select value={value} onValueChange={onChange}>
                  <FormLabel className="gap-1">
                    Единица измерения<span className="text-destructive">*</span>
                  </FormLabel>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите единицу измерения">
                      {value && unitTypes.find((unit) => unit.name === value)?.description}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {unitTypes.map((unit) => (
                        <SelectItem key={unit.name} value={unit.name}>
                          {unit.description}
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

export default ProductCompositeForm;
