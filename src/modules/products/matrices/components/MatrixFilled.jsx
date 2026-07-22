import React, { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

import { filledCells } from '../matrices.processes';
import { useMatricesStore } from '../matrices.store';

const MatrixFilled = () => {
  const activeMatrixRows = useMatricesStore((state) => state.activeMatrixRows);
  const [dataFilledCells, setDataFilledCells] = useState([]);

  useEffect(() => {
    const data = filledCells();
    setDataFilledCells(data);
  }, [activeMatrixRows]);

  return (
    <Card className="w-[20%]">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl whitespace-normal">Заполненная матрица</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {dataFilledCells.length < 1 ? (
          <p className="text-muted-foreground py-3 text-center text-sm">Нет заполненных ячеек</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Поз.</TableHead>
                <TableHead>Товар</TableHead>
                <TableHead>Макс.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataFilledCells.map((item) => (
                <TableRow key={item.position}>
                  <TableCell className="font-mono text-xs">{item.position}</TableCell>
                  <TableCell className="text-xs font-medium whitespace-normal">{item.product}</TableCell>
                  <TableCell className="text-xs">{item.columnProductQuantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default MatrixFilled;
