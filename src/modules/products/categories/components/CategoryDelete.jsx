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

import { deleteCategory } from '../categories.processes';
import { useCategoriesStore } from '../categories.store';

const CategoryDelete = ({ category }) => {
  const [open, setOpen] = useState(false);
  const loading = useCategoriesStore((state) => state.loading);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon" className="bg-destructive/60 h-8 w-8">
          <Trash2 className="size-4" color="white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Удалить категорию?</DialogTitle>
          <DialogDescription>
            {`Вы действительно хотите удалить категорию ${category.name}? Это действие нельзя отменить.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-5 sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Отмена
            </Button>
          </DialogClose>
          <Button variant="destructive" disabled={loading.delete} className="ml-auto" onClick={() => deleteCategory(category.id, setOpen)}>
            Удалить
            {loading.delete && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDelete;
