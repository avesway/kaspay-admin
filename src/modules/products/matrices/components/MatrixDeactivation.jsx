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

import { matricesAPI } from '../matrices.api';
import { getTemplatesMatrices } from '../matrices.processes';
import { useMatricesStore } from '../matrices.store';

const MatrixDeactivation = ({ matrixId, hasActivePriceLists, hasAttachedDevices }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const templates = useMatricesStore((state) => state.templates);

  async function deactivationMatrix() {
    try {
      setLoading(true);

      await matricesAPI.deactivation(matrixId);
      getTemplatesMatrices();
      toast.success('Матрица успешно деактивирована', { position: 'top-center' });
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
          <DialogTitle>Деактивация матрицы</DialogTitle>
          <DialogDescription>
            {hasActivePriceLists
              ? ''
              : `Вы действительно хотите деактивировать матрицу ${templates.find((i) => i.id === matrixId)?.name}?`}
          </DialogDescription>
        </DialogHeader>
        {hasActivePriceLists ? (
          <>
            <p>Данная матрица используется в прайс листе. Деактивация невозможна</p>
            <DialogFooter className="mt-5 sm:justify-end">
              <DialogClose asChild>
                <Button type="button">Понятно</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <DialogFooter className="mt-5 sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Отмена
              </Button>
            </DialogClose>
            <Button variant="destructive" disabled={loading} className="ml-auto" onClick={deactivationMatrix}>
              Деактивировать
              {loading && <Loader2 className="animate-spin" />}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MatrixDeactivation;
