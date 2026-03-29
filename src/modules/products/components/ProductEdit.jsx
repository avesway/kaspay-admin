import React, { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import ProductForm from './ProductForm';
import { useProductsStore } from '@/store';

const ProductEdit = ({ product }) => {
  const [open, setOpen] = useState(false);
  const loading = useProductsStore((state) => state.loading);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Edit className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Редактировать товар</DialogTitle>
          <DialogDescription>Внесите изменения в карточку товара</DialogDescription>
        </DialogHeader>

        <ProductForm type="edit" product={product} loading={loading.update} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductEdit;
