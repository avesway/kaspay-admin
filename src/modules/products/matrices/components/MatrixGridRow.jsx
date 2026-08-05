import React from 'react';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { useSortable } from '@dnd-kit/sortable';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripHorizontal, Plus, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

import MatrixGridColumn from './MatrixGridColumn';

const MatrixGridRow = ({ row, products, activeMatrixRows, setActiveMatrixRows, setActiveColumn, setOpenDialogProduct }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: row.row,
  });

  function removeRow() {
    setActiveMatrixRows(
      activeMatrixRows
        .filter((i) => i.row != row.row)
        .map((i, index) => ({ columns: i.columns.map((col) => ({ ...col, rowId: index + 1 })), row: index + 1 })),
    );
  }

  function addColumn(rowId) {
    activeMatrixRows.reduce((acc, obj) => {
      const currentRow = obj.row === rowId;

      if (currentRow)
        obj.columns.push({
          productId: '',
          rowId: rowId,
          columnId: obj.columns.length + 1,
          columnProductQuantity: 0,
        });

      acc.push(obj);

      return acc;
    }, []);

    setActiveMatrixRows([...activeMatrixRows]);
  }

  function handleDragEndColumns({ active, over }) {
    if (!over) return;
    if (active.id === over.id) return;

    const oldIndex = row.columns.findIndex((col) => col.columnId === active.id);
    const newIndex = row.columns.findIndex((col) => col.columnId === over.id);

    const arrayMoving = arrayMove(row.columns, oldIndex, newIndex);

    setActiveMatrixRows(
      activeMatrixRows.map((i) => {
        if (i.row === row.row) {
          return { ...i, columns: arrayMoving };
        }

        return i;
      }),
    );

    setTimeout(() => {
      setActiveMatrixRows(
        activeMatrixRows.map((i) => {
          if (i.row === row.row) {
            return { ...i, columns: arrayMoving.map((i, index) => ({ ...i, columnId: index + 1 })) };
          }

          return i;
        }),
      );
    }, 100);
  }

  return (
    <div
      className="bg-muted/50 mb-5 p-3"
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="flex items-center">
        <Button {...attributes} {...listeners} className="mr-5 gap-0 rounded-full p-0 py-0">
          <GripHorizontal />
        </Button>
        <span className="text-sm">Ряд {row.row}</span>
        <div className="ml-10 flex flex-row items-center gap-2">
          <Input type="number" value={row?.columns?.length} onChange={() => {}} max={20} disabled className="h-7 w-14" />
          <Button variant="outline" className="h-7 w-7" disabled={row.columns.length === 20} onClick={() => addColumn(row.row)}>
            <Plus />
          </Button>
          <span className="text-xs">столбцов</span>
        </div>
        <Button
          variant="destructive"
          disabled={activeMatrixRows.length === 1}
          onClick={removeRow}
          size="icon"
          className="bg-destructive/60 ml-auto h-6 w-6"
        >
          <Trash2 className="size-4" color="white" />
        </Button>
      </div>
      <div
        className={cn(row.columns.length < 6 ? 'place-items-center' : '', 'space- mt-3 grid gap-1 rounded-lg p-2')}
        style={{
          gridTemplateColumns: `repeat(${row.columns.length}, minmax(0, 1fr ))`,
        }}
      >
        <DndContext modifiers={[restrictToHorizontalAxis]} collisionDetection={closestCenter} onDragEnd={handleDragEndColumns}>
          <SortableContext items={row.columns.map((row) => row.columnId)} strategy={horizontalListSortingStrategy}>
            {row.columns.map((col) => (
              <MatrixGridColumn
                key={col.columnId}
                col={col}
                row={row}
                products={products}
                setActiveColumn={setActiveColumn}
                setOpenDialogProduct={setOpenDialogProduct}
                setActiveMatrixRows={setActiveMatrixRows}
                activeMatrixRows={activeMatrixRows}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default MatrixGridRow;
