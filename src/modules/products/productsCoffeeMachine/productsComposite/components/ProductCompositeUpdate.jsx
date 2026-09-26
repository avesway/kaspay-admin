import React, { useState } from 'react';
import { Edit } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';

import ProductCompositeForm from './ProductCompositeForm';
import { useProductsCompositeStore } from '../productsComposite.store';

const ProductCompositeUpdate = ({ product }) => {
  const [open, setOpen] = useState(false);
  const loading = useProductsCompositeStore((state) => state.loading);

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
        <ProductCompositeForm type="edit" product={product} loading={loading.update} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductCompositeUpdate;
