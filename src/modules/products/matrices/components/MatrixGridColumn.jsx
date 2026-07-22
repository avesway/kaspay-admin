import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

import ProductImageCell from '../../productsCatalog/components/ProductImageCell';

const MatrixGridColumn = ({
  col,
  row,
  products,
  setActiveColumn,
  setOpenDialogProduct,
  setActiveMatrixRows,
  activeMatrixRows,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: col.columnId,
  });

  function selectProductColumn(rowId, column) {
    setActiveColumn({
      rowId,
      columnId: column.columnId,
      productId: column.productId,
      productQuantity: column.columnProductQuantity,
    });
    setOpenDialogProduct(true);
  }

  function removeColumn() {
    const formattedArr = activeMatrixRows.map((i) => {
      if (i.row === row.row) {
        return {
          ...i,
          columns: i.columns.filter((i) => i.columnId != col.columnId).map((i, index) => ({ ...i, columnId: index + 1 })),
        };
      }

      return i;
    });

    setActiveMatrixRows(formattedArr);
  }

  return (
    <div
      className="border-border rounded-lg border p-2"
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="mb-2 flex flex-row gap-3">
        <Button {...attributes} {...listeners} className="mr-auto h-6 w-5 gap-0 rounded-full p-0 py-0">
          <GripVertical />
        </Button>
        <Button
          variant="destructive"
          onClick={removeColumn}
          size="icon"
          disabled={row.columns.length <= 1}
          className="bg-destructive/60 ml-auto h-6 w-6"
        >
          <Trash2 className="size-4" color="white" />
        </Button>
      </div>

      <div
        className={cn(
          row.columns.length < 6 ? 'h-48 w-48 max-w-48' : 'aspect-square',
          'border-border bg-background hover:bg-accent hover:border-primary flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-2 text-center transition-all',
        )}
        onClick={() => selectProductColumn(row.row, col)}
      >
        {col.productId ? (
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <ProductImageCell
              imagePath={products.find((i) => i.id === col.productId)?.imagePath}
              alt={products.find((i) => i.id === col.productId)?.shortName}
            />
            <p className="line-clamp-4 w-[95%] text-[10px] leading-tight font-medium whitespace-normal">
              {products.find((i) => i.id === col.productId)?.name}
            </p>
            <span className="text-muted-foreground text-[9px]">макс: {col.columnProductQuantity}</span>
          </div>
        ) : (
          <Plus className="text-muted-foreground h-4 w-4" />
        )}
      </div>
    </div>
  );
};

export default MatrixGridColumn;
