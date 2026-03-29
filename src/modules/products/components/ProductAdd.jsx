import React, { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import ProductForm from './ProductForm';
import { useProductsStore } from '@/store';

const ProductAdd = () => {
  const [open, setOpen] = useState(false);
  const loading = useProductsStore((state) => state.loading);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить товар
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Добавить товар</DialogTitle>
          <DialogDescription>Заполните форму для добавления нового товара в каталог</DialogDescription>
        </DialogHeader>

        <ProductForm loading={loading.create} type="create" setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductAdd;
