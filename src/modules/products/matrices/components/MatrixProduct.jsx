import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/shared/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/shared/ui/select';

import { getProductsCatalog } from '../../productsCatalog/productsCatalog.processes';
import { useProductsCatalogStore } from '../../productsCatalog/productsCatalog.store';
import { useMatricesStore } from '../matrices.store';

const matrixProductSchema = z.object({
  productId: z.preprocess((val) => Number(val), z.number().min(1, { message: 'Выберите товар' })),
  productQuantity: z.preprocess((val) => Number(val), z.number().min(1, { message: 'Количество должно быть больше нуля' })),
});

const MatrixProduct = ({ open, setOpen, isUpdate }) => {
  const products = useProductsCatalogStore((state) => state.products);
  const { activeColumn, activeMatrixRows, setActiveMatrixRows, error, setError } = useMatricesStore(
    useShallow((state) => ({
      activeColumn: state.activeColumn,
      activeMatrixRows: state.activeMatrixRows,
      setActiveMatrixRows: state.setActiveMatrixRows,
      error: state.error,
      setError: state.setError,
    })),
  );
  const [searchProduct, setSearchProduct] = useState('');
  const [isShowBtnCleanData, setShowBtnCleanData] = useState(false);

  useEffect(() => {
    if (open) getProductsCatalog();
  }, [open]);

  useEffect(() => {
    setValue('productId', activeColumn?.productId ? activeColumn.productId : '');
    setValue('productQuantity', activeColumn?.productQuantity ? activeColumn?.productQuantity.toString() : '');

    setShowBtnCleanData(Boolean(activeColumn?.productId));
  }, [activeColumn]);

  const form = useForm({
    resolver: zodResolver(matrixProductSchema),
    defaultValues: {
      productId: '',
      productQuantity: '',
    },
  });

  const { setValue, getValues } = form;

  async function handleSearchProduct(value) {
    setSearchProduct(value);
    getProductsCatalog(`size=50&page=1&shortName=${value}`);
  }

  function addingProduct(data) {
    const updatedRows = activeMatrixRows.map((row) => {
      if (row.row !== activeColumn.rowId) return row;

      return {
        ...row,
        columns: row.columns.map((column) => {
          if (column.columnId !== activeColumn.columnId) return column;

          return {
            ...column,
            productId: data.productId.toString(),
            columnProductQuantity: data.productQuantity,
          };
        }),
      };
    });

    setActiveMatrixRows([...updatedRows]);
    if (error.emptyColumns) setError({ emptyColumns: false });
    setOpen(false);
  }

  function resetProduct() {
    const updatedRows = activeMatrixRows.map((row) => {
      if (row.row !== activeColumn.rowId) return row;

      return {
        ...row,
        columns: row.columns.map((column) => {
          if (column.columnId !== activeColumn.columnId) return column;

          return {
            ...column,
            productId: '',
            columnProductQuantity: 0,
          };
        }),
      };
    });

    setActiveMatrixRows([...updatedRows]);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>{`Редактирование ячейки ${activeColumn.rowId}:${activeColumn.columnId}`}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(addingProduct)} className="mt-5 flex flex-col gap-5">
            <FormField
              control={form.control}
              name="productId"
              render={({ field: { onChange, value } }) => (
                <FormItem className="min-w-[20%]">
                  <Select value={value || ''} onValueChange={onChange}>
                    <FormLabel className="gap-1">
                      Продукт<span className="text-destructive">*</span>
                    </FormLabel>
                    <SelectTrigger className="w-full truncate">
                      <SelectValue placeholder="Выберите товар" />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" align="start" className="max-h-96" sideOffset={5}>
                      <div className="bg-popover sticky top-0 z-10 border-b p-2">
                        <div className="relative h-10 w-full">
                          <Search className="absolute top-[25%] left-1 h-4 w-4" color="var(--color-muted-foreground)" />
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
                    {isUpdate ? (
                      <div className="mt-2 flex flex-row gap-2">
                        <Info size={30} color="var(--color-primary)" />
                        <p className="text-xs">
                          При смене продукта в колонке, балансы на устройствах не изменятся, однако их пополнение не будет
                          возможным
                        </p>
                      </div>
                    ) : null}
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productQuantity"
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel className="gap-1">
                    Максимальное количество<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Кол-во"
                      type="number"
                      max={999}
                      value={value}
                      onChange={({ target }) => onChange(target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-5 sm:justify-end">
              <DialogClose asChild>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  Отмена
                </Button>
              </DialogClose>
              {isShowBtnCleanData ? (
                <DialogClose asChild>
                  <Button variant="destructive" className="ml-5" onClick={resetProduct}>
                    Очистить
                  </Button>
                </DialogClose>
              ) : null}

              <Button type="submit" className="ml-5">
                Добавить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MatrixProduct;
