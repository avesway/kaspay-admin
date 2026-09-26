import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/shared/ui/button';
import { DialogClose, DialogFooter } from '@/shared/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Switch } from '@/shared/ui/switch';
import { Textarea } from '@/shared/ui/textarea';

import { createCategory, updateCategory } from '../categories.processes';

const categorySchema = z.object({
  name: z.string().min(1, 'Обязательно для заполнения'),
  description: z.string().min(1, 'Обязательно для заполнения'),
  isActive: z.boolean(),
});

const CategoryForm = ({ category, loading, setOpen }) => {
  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      isActive: category?.isActive ?? true,
    },
  });

  const onSubmit = (data) => {
    if (category) {
      updateCategory(category.id, data, setOpen);
    } else {
      createCategory(data, setOpen);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="gap-1">
                Название<span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Введите название категории" type="text" {...field} />
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
              <FormLabel className="gap-1">
                Описание<span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Введите описание категории" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Активна</FormLabel>
              <FormControl>
                <Switch checked={value} onCheckedChange={onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Отмена
            </Button>
          </DialogClose>
          <Button type="submit" disabled={loading}>
            {category ? 'Сохранить' : 'Добавить'}
            {loading && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CategoryForm;
