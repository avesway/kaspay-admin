import React from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import ProductMatrixCellEditDialog from './ProductMatrixCellEditDialog';
import ProductMatrixNewProductDialog from './ProductMatrixNewProductDialog';
import ProductMatrixLoadTemplateDialog from './ProductMatrixLoadTemplateDialog';

const ProductMatrixEditor = ({ editor, templateType }) => {
  const {
    rowColumns,
    matrixData,
    totalCells,
    filledCells,
    handleCellClick,
    handleAddRow,
    handleRemoveRow,
    handleRowColumnsChange,
    setIsTemplateDialogOpen,
  } = editor;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Настройка строк</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="link"
                size="sm"
                className="text-primary px-0"
                onClick={() => setIsTemplateDialogOpen(true)}
              >
                Загрузить из шаблона
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleAddRow} className="gap-1">
                <Plus className="h-4 w-4" />
                Добавить строку
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {rowColumns.map((cols, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-20 shrink-0">Строка {rowIndex + 1}</span>
              <Input
                type="number"
                min="1"
                max="10"
                value={cols}
                onChange={(e) => handleRowColumnsChange(rowIndex, parseInt(e.target.value) || 1)}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">столбцов</span>
              {rowColumns.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveRow(rowIndex)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <p className="text-xs text-muted-foreground mt-1">
            Заполнено: {filledCells} из {totalCells} ячеек
          </p>
        </CardContent>
      </Card>

      <div className='flex flex-row gap-4'>

        <div className="flex flex-col gap-2 w-[70%]">
          <Label>Матрица (нажмите на ячейку для редактирования)</Label>
          <div className="flex flex-col gap-1.5 p-3 bg-muted/30 rounded-lg border">
            {rowColumns.map((cols, rowIndex) => (
              <div
                key={rowIndex}
                className="grid gap-1.5"
                style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: cols }, (_, colIndex) => {
                  const position = `${rowIndex + 1}-${colIndex + 1}`;
                  const cellData = matrixData[position];

                  return (
                    <button
                      key={position}
                      type="button"
                      onClick={() => handleCellClick(position)}
                      className={`aspect-square border-2 rounded-lg p-1 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[60px] ${
                        cellData
                          ? 'bg-primary/10 border-primary hover:bg-primary/20'
                          : 'bg-background border-border hover:bg-muted'
                      }`}
                    >
                      <span className="text-[10px] font-semibold text-muted-foreground">{position}</span>
                      {cellData && (
                        <>
                        <span className="text-[9px] text-muted-foreground line-clamp-2 leading-tight mt-0.5">
                          {cellData.product}
                        </span>
                          <span className="text-[10px] font-bold text-primary mt-0.5">{cellData.price}</span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {filledCells > 0 && (
          <div className="flex flex-col gap-2 w-[28%]">
            <Label>Заполненная матрица ({filledCells})</Label>
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                <tr>
                  <th className="text-left px-3 py-2 font-medium w-16">Поз.</th>
                  <th className="text-left px-3 py-2 font-medium">Товар</th>
                  <th className="text-left px-3 py-2 font-medium w-20">Макс.</th>
                </tr>
                </thead>
                <tbody>
                {Object.entries(matrixData)
                  .sort(([a], [b]) => {
                    const [aR, aC] = a.split('-').map(Number);
                    const [bR, bC] = b.split('-').map(Number);
                    return aR !== bR ? aR - bR : aC - bC;
                  })
                  .map(([position, data]) => {
                    const [row, col] = position.split('-').map(Number);
                    return (
                      <tr key={position} className="border-t">
                        <td className="px-3 py-2 font-mono text-muted-foreground">{`${row - 1}:${col}`}</td>
                        <td className="px-3 py-2">{data.product}</td>
                        <td className="px-3 py-2">{data.maxQuantity || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>


      <ProductMatrixCellEditDialog editor={editor} />
      <ProductMatrixNewProductDialog editor={editor} />
      <ProductMatrixLoadTemplateDialog editor={editor} templateType={templateType} />
    </div>
  );
};

export default ProductMatrixEditor;
