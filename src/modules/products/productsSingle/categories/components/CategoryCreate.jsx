import React, { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';

import CategoryForm from './CategoryForm';
import { useCategoriesStore } from '../categories.store';

const CategoryCreate = () => {
  const [open, setOpen] = useState(false);
  const loading = useCategoriesStore((state) => state.loading);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          Добавить категорию
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Новая категория</DialogTitle>
          <DialogDescription>Заполните данные категории</DialogDescription>
        </DialogHeader>
        <CategoryForm loading={loading.create} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default CategoryCreate;
