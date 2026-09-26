import React, { useState } from 'react';
import { Edit } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';

import CategoryForm from './CategoryForm';
import { useCategoriesStore } from '../categories.store';

const CategoryUpdate = ({ category }) => {
  const [open, setOpen] = useState(false);
  const loading = useCategoriesStore((state) => state.loading);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Edit className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Редактировать категорию</DialogTitle>
          <DialogDescription>Внесите изменения в категорию</DialogDescription>
        </DialogHeader>
        <CategoryForm category={category} loading={loading.update} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default CategoryUpdate;
