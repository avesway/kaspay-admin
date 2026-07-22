import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import * as z from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

import { createMatrixTemplate, updateMatrixTemplate } from '../matrices.processes';
import { useMatricesStore } from '../matrices.store';

const templateSchema = z.object({
  name: z.string().min(1, 'Укажите название шаблона'),
  type: z.string().min(1, 'Укажите тип шаблона'),
});

const MatrixForm = ({ isUpdate, matrixId }) => {
  const navigate = useNavigate();
  const { typesMatrices, error, loading, activeMatrix } = useMatricesStore(
    useShallow((state) => ({
      typesMatrices: state.typesMatrices,
      error: state.error,
      loading: state.loading,
      activeMatrix: state.activeMatrix,
    })),
  );
  const form = useForm({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: activeMatrix?.name || '',
      type: activeMatrix?.type || '',
    },
  });

  useEffect(() => {
    form.reset({
      name: activeMatrix?.name || '',
      type: activeMatrix?.type || '',
    });
  }, [activeMatrix]);

  return (
    <Card>
      <CardContent className="">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              isUpdate ? updateMatrixTemplate(matrixId, data, navigate) : createMatrixTemplate(data, navigate);
            })}
            className=""
          >
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
                render={({ field: { onChange, value } }) => {
                  return (
                    <FormItem>
                      <Select value={value} onValueChange={onChange} disabled={Boolean(activeMatrix?.type)}>
                        <FormLabel className="gap-1">
                          Тип<span className="text-destructive">*</span>
                        </FormLabel>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                        <SelectContent>
                          {typesMatrices.map((t) => (
                            <SelectItem key={t.name} value={t.name}>
                              {t.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                        <FormMessage />
                      </Select>
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="mt-5 flex flex-col">
              <Button type="submit" className="ml-auto">
                {loading.create && <Loader2 className="animate-spin" />}
                {isUpdate ? 'Изменить шаблон' : 'Добавить шаблон'}
              </Button>
              {error.emptyColumns ? (
                <div className="mt-2 ml-auto flex flex-row items-center gap-2">
                  <Info size={16} color="var(--color-destructive)" />
                  <p className="text-destructive text-[14px]">Есть незаполненные ячейки</p>
                </div>
              ) : null}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MatrixForm;
