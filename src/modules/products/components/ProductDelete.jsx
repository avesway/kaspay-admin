import React, { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/shared/ui/dialog';
import { deleteProduct } from '@/actions/products.actions';
import { useProductsStore } from '@/store';

const ProductDelete = ({ product }) => {
  const [open, setOpen] = useState(false);
  const loading = useProductsStore((state) => state.loading);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon" className="h-8 w-8 bg-destructive/60">
          <Trash2 className="size-4" color="white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Удалить товар?</DialogTitle>
          <DialogDescription>
            {`Вы действительно хотите удалить товар ${product.name}? Это действие нельзя отменить.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-start mt-5">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Отмена
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            disabled={loading.delete}
            className="ml-auto"
            onClick={() => deleteProduct(product.id, setOpen)}
          >
            Удалить
            {loading.delete && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDelete;
