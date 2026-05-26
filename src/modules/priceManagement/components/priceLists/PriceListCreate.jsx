import React, { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { usePriceListsStore } from '../../store';
import PriceListForm from './PriceListForm';

const PriceListCreate = () => {
  const [open, setOpen] = useState(false);
  const loading = usePriceListsStore((state) => state.loading);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить прайс лист
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Добавить прайс лист</DialogTitle>
          <DialogDescription>Заполните форму для добавления нового прайс листа</DialogDescription>
        </DialogHeader>
        <PriceListForm loading={loading.create} type="create" setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default PriceListCreate;
