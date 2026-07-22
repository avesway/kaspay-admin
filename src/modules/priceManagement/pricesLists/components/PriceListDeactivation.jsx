import React, { useState } from 'react';
import { FileXCorner, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';

import { pricesListsAPI } from '../pricesLists.api';
import { getPricesListsItems } from '../pricesLists.processes';
import { usePricesListsStore } from '../pricesLists.store';

const PriceListDeactivation = ({ priceListId }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const pricesLists = usePricesListsStore((state) => state.pricesLists);

  async function deactivationPriceList() {
    try {
      setLoading(true);

      await pricesListsAPI.deactivation(priceListId);
      getPricesListsItems();
      toast.success('Прайс лист успешно деактивирован', { position: 'top-center' });
      setOpen(false);
    } catch (error) {
      toast.error('Ошибка деактивации', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon" className="bg-destructive/60 h-8 w-8">
          <FileXCorner className="size-4" color="white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Деактивация прайс листа</DialogTitle>
          <DialogDescription>
            {`Вы действительно хотите деактивировать прайс лист ${pricesLists.find((i) => i.id === priceListId)?.name}?`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-5 sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Отмена
            </Button>
          </DialogClose>
          <Button variant="destructive" disabled={loading} className="ml-auto" onClick={deactivationPriceList}>
            Деактивировать
            {loading && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PriceListDeactivation;
