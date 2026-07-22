import React, { useEffect, useState } from 'react';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Grid3X3, Loader2, Plus } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

import MatrixGridRow from './MatrixGridRow';
import MatrixProduct from './MatrixProduct';
import { useProductsCatalogStore } from '../../productsCatalog/productsCatalog.store';
import { useMatricesStore } from '../matrices.store';

const MatrixGrid = ({ isUpdate }) => {
  const { activeMatrixRows, setActiveMatrixRows, setActiveColumn } = useMatricesStore(
    useShallow((state) => ({
      activeMatrixRows: state.activeMatrixRows,
      setActiveMatrixRows: state.setActiveMatrixRows,
      setActiveColumn: state.setActiveColumn,
    })),
  );
  const products = useProductsCatalogStore((state) => state.products);
  const [isOpenDialogProduct, setOpenDialogProduct] = useState(false);

  function addRow() {
    activeMatrixRows.push({
      row: activeMatrixRows.length + 1,
      columns: Array.from({ length: 1 }, (_, i) => {
        return {
          productId: '',
          rowId: activeMatrixRows.length + 1,
          columnId: i + 1,
          columnProductQuantity: 0,
        };
      }),
    });
    setActiveMatrixRows([...activeMatrixRows]);
  }

  function handleDragEndRows({ active, over }) {
    if (!over) return;
    if (active.id === over.id) return;

    const oldIndex = activeMatrixRows.findIndex((row) => row.row === active.id);
    const newIndex = activeMatrixRows.findIndex((row) => row.row === over.id);

    const arrayMoving = arrayMove(activeMatrixRows, oldIndex, newIndex);

    setActiveMatrixRows(arrayMoving);

    setTimeout(() => {
      setActiveMatrixRows(
        arrayMoving.map((i, index) => ({ columns: i.columns.map((col) => ({ ...col, rowId: index + 1 })), row: index + 1 })),
      );
    }, 100);
  }

  console.log('activeMatrixRows GRID', activeMatrixRows);

  return (
    <>
      <Card className="w-[80%]">
        <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
          <div className="flex items-center gap-3">
            <Grid3X3 />
            <CardTitle className="text-2xl">Сетка матрицы</CardTitle>
          </div>
          <Button onClick={addRow} disabled={activeMatrixRows.length === 20}>
            <Plus /> Добавить ряд
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {!activeMatrixRows.length ? (
            <div className="mt-10 flex justify-center">
              <Loader2 className="animate-spin" color="var(--color-primary)" />
            </div>
          ) : (
            <DndContext modifiers={[restrictToVerticalAxis]} collisionDetection={closestCenter} onDragEnd={handleDragEndRows}>
              <SortableContext items={activeMatrixRows.map((row) => row.row)} strategy={verticalListSortingStrategy}>
                {activeMatrixRows.map((row) => (
                  <MatrixGridRow
                    key={row.row}
                    row={row}
                    products={products}
                    activeMatrixRows={activeMatrixRows}
                    setActiveMatrixRows={setActiveMatrixRows}
                    setActiveColumn={setActiveColumn}
                    setOpenDialogProduct={setOpenDialogProduct}
                  />
                ))}
              </SortableContext>
            </DndContext>
            // <DragDropProvider>
            //   {activeMatrixRows.map((row) => (
            //     <div key={row.row} className="mb-5">
            //       <div className="flex items-center">
            //         <span className="text-sm">Ряд {row.row}</span>
            //         <div className="ml-10 flex flex-row items-center gap-2">
            //           <Button
            //             variant="outline"
            //             className="h-7 w-7"
            //             disabled={row.columns.length === 1}
            //             onClick={() => removeColumn(row.row)}
            //           >
            //             <Minus />
            //           </Button>
            //           <Input type="number" value={row?.columns?.length} onChange={() => {}} className="h-7 w-14" />
            //           <Button
            //             variant="outline"
            //             className="h-7 w-7"
            //             disabled={row.columns.length === 20}
            //             onClick={() => addColumn(row.row)}
            //           >
            //             <Plus />
            //           </Button>
            //           <span className="text-xs">столбцов</span>
            //         </div>
            //         <Button
            //           variant="destructive"
            //           disabled={activeMatrixRows.length === 1}
            //           onClick={removeRow}
            //           size="icon"
            //           className="bg-destructive/60 ml-auto h-6 w-6"
            //         >
            //           <Trash2 className="size-4" color="white" />
            //         </Button>
            //       </div>
            //       <div
            //         className={cn(
            //           row.columns.length < 6 ? 'place-items-center' : '',
            //           'bg-muted/50 space- mt-3 grid gap-1 rounded-lg p-2',
            //         )}
            //         style={{
            //           gridTemplateColumns: `repeat(${row.columns.length}, minmax(0, 1fr ))`,
            //         }}
            //       >
            //         {row.columns.map((col) => (
            //           <button
            //             key={col.columnId}
            //             className={cn(
            //               row.columns.length < 6 ? 'h-48 w-48 max-w-48' : 'aspect-square',
            //               'border-border bg-background hover:bg-accent hover:border-primary flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-2 text-center transition-all',
            //             )}
            //             onClick={() => selectProductColumn(row.row, col)}
            //             // className={cn(
            //             //   'border-border bg-background hover:bg-accent hover:border-primary flex h-48 max-w-48 min-w-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-2 text-center transition-all',
            //             // )}
            //           >
            //             {col.productId ? (
            //               <div className="flex w-full flex-col items-center justify-center gap-2">
            //                 <ProductImageCell
            //                   imagePath={products.find((i) => i.id === col.productId)?.imagePath}
            //                   alt={products.find((i) => i.id === col.productId)?.shortName}
            //                 />
            //                 <p className="line-clamp-4 w-[95%] text-[10px] leading-tight font-medium whitespace-normal">
            //                   {products.find((i) => i.id === col.productId)?.name}
            //                 </p>
            //                 <span className="text-muted-foreground text-[9px]">макс: {col.columnProductQuantity}</span>
            //               </div>
            //             ) : (
            //               <Plus className="text-muted-foreground h-4 w-4" />
            //             )}
            //           </button>
            //         ))}
            //       </div>
            //     </div>
            //   ))}
            // </DragDropProvider>
          )}
        </CardContent>
      </Card>

      <MatrixProduct open={isOpenDialogProduct} setOpen={setOpenDialogProduct} isUpdate={isUpdate} />
    </>
  );
};

export default MatrixGrid;
