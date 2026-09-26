import React, { useState } from 'react';
import { Edit } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';

import DrinkForm from './DrinkForm';
import { useProductsCoffeeStore } from '../productsCoffee.store';

const DrinkUpdate = ({ drink }) => {
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
          <DialogDescription>Внесите изменения в напиток и его состав</DialogDescription>
        </DialogHeader>
        <DrinkForm loading={loading.update} type="edit" drink={drink} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default DrinkUpdate;
