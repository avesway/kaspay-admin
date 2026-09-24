import React from 'react';

import { priceRoundedRubles } from '@/helpers/priceHelpers';
import { Card, CardContent } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

import { HEATMAP_INTENSITY_CLASSES, shortWeekday, WEEKDAY_SHORT } from '../../helpers/weekdayConfig';

const WeekdayHeatmap = ({ report }) => {
  const heatmap = report?.heatmap || [];

  // Колонки — дни недели в порядке ответа первой строки
  const weekdays = heatmap[0]?.cells?.map((cell) => cell.weekday) || [];

  return (
    <Card className="mt-5">
      <CardContent className="p-6">
        <h3 className="mb-6 text-lg font-semibold">Тепловая карта (час × день)</h3>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Час</TableHead>
              {weekdays.map((weekday) => (
                <TableHead key={weekday?.name} className="text-center">
                  {shortWeekday(weekday)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {heatmap.map((row) => (
              <TableRow key={row.hour}>
                <TableCell className="font-medium">{`${row.hour}:00`}</TableCell>
                {row.cells.map((cell) => (
                  <TableCell key={cell.weekday?.name} className="px-1">
                    <div
                      title={`${shortWeekday(cell.weekday)}, ${row.hour}:00 — ${priceRoundedRubles(cell.averageRevenue).toLocaleString('ru-RU')} BYN`}
                      className={`rounded-md py-2 text-center text-xs ${HEATMAP_INTENSITY_CLASSES[cell.intensity] || HEATMAP_INTENSITY_CLASSES[1]}`}
                    >
                      {cell.intensity}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!heatmap.length && <p className="text-muted-foreground text-center text-sm">Нет данных за период</p>}
      </CardContent>
    </Card>
  );
};

export default WeekdayHeatmap;
