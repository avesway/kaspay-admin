import React, { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';

import ProductCaffeeMachineForm from './ProductCoffeeMachineForm';
import { useProductsCoffeeMachineStore } from '../productsCoffeeMachine.store';

const ProductCoffeeMachineCreate = () => {
  const [open, setOpen] = useState(false);
  const loading = useProductsCoffeeMachineStore((state) => state.loading);

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
          <DialogDescription>Создайте новую карточку товара</DialogDescription>
        </DialogHeader>
        <ProductCaffeeMachineForm loading={loading.create} type="create" setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductCoffeeMachineCreate;
