import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/shared/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Loader2 } from 'lucide-react';
import { TEMPLATE_TYPES } from './constants';
import { createMatrixTemplate, updateMatrixTemplate } from '../../actions/matrixTemplates';
import useMatrixEditor from '../../hooks/useMatrixEditor';
import ProductMatrixEditor from './ProductMatrixEditor';

const templateSchema = z.object({
  name: z.string().min(1, 'Обязательно для заполнения'),
  type: z.string().min(1, 'Укажите тип шаблона'),
});

const ProductMatrixTemplateForm = ({ loading, type, template, setOpen }) => {
  const form = useForm({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: template?.name || '',
      type: template?.type || 'coffee',
    },
  });

  const watchedType = form.watch('type');
  const editor = useMatrixEditor(template);

  const handleSubmit = (values) => {
    const data = {
      name: values.name,
      type: values.type,
      ...editor.getEditorData(),
    };

    if (type === 'create') {
      createMatrixTemplate(data, setOpen);
    } else {
      updateMatrixTemplate(template.id, data, setOpen);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5">
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
                  <Input placeholder="Шаблон кофейного автомата" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <Select value={value} onValueChange={onChange}>
                  <FormLabel className="gap-1">
                    Тип<span className="text-destructive">*</span>
                  </FormLabel>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATE_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                  <FormMessage />
                </Select>
              </FormItem>
            )}
          />
        </div>

        <ProductMatrixEditor editor={editor} templateType={watchedType} />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button type="submit" disabled={loading}>
            {type === 'create' ? 'Добавить шаблон' : 'Сохранить изменения'}
            {loading && <Loader2 className="animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductMatrixTemplateForm;
