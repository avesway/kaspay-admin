import React, { useState } from 'react';
import { Edit } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';

import CompositionForm from './CompositionForm';
import { useProductsCoffeeStore } from '../productsCoffee.store';

const CompositionUpdate = ({ composition }) => {
  const [open, setOpen] = useState(false);
  const loading = useProductsCoffeeStore((state) => state.loading);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Edit className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Редактировать напиток</DialogTitle>
          <DialogDescription>Внесите изменения в рецепт напитка</DialogDescription>
        </DialogHeader>
        <CompositionForm loading={loading.update} type="edit" composition={composition} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default CompositionUpdate;
