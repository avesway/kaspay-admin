import React, { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';

import CompositionForm from './CompositionForm';
import { useProductsCoffeeStore } from '../productsCoffee.store';

const CompositionCreate = () => {
  const [open, setOpen] = useState(false);
  const loading = useProductsCoffeeStore((state) => state.loading);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить напиток
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Добавить напиток</DialogTitle>
          <DialogDescription>Создайте рецепт напитка с указанием используемых ресурсов</DialogDescription>
        </DialogHeader>
        <CompositionForm loading={loading.create} type="create" setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default CompositionCreate;
