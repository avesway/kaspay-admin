import React, { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { usePriceListsStore } from '../../store';
import PriceListForm from './PriceListForm';

const PriceListUpdate = ({ priceList }) => {
  const [open, setOpen] = useState(false);
  const loading = usePriceListsStore((state) => state.loading);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Edit className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Редактировать прайс лист</DialogTitle>
          <DialogDescription>Внесите изменения в прайс лист</DialogDescription>
        </DialogHeader>
        <PriceListForm type="edit" priceList={priceList} loading={loading.update} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default PriceListUpdate;
