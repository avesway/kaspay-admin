import React, { useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';

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

import { deleteComposition } from '../productsCoffee.processes';
import { useProductsCoffeeStore } from '../productsCoffee.store';

const CompositionDelete = ({ composition }) => {
  const [open, setOpen] = useState(false);
  const loading = useProductsCoffeeStore((state) => state.loading);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8">
          <Trash2 className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Удалить рецепт?</DialogTitle>
          <DialogDescription>
            {`Вы действительно хотите удалить рецепт напитка ${composition.name}? Это действие нельзя отменить.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-5 sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Отмена
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={loading.delete}
            className="ml-auto"
            onClick={() => deleteComposition(composition.id, setOpen)}
          >
            Удалить
            {loading.delete && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompositionDelete;
