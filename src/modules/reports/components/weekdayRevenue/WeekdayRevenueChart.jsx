import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from 'recharts';

import { priceRoundedRubles } from '@/helpers/priceHelpers';
import { Card, CardContent } from '@/shared/ui/card';
import { ChartContainer } from '@/shared/ui/chart';

import { shortWeekday, WEEKDAY_BAR_COLORS } from '../../helpers/weekdayConfig';

function WeekdayTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;

  return (
    <div className="bg-popover text-popover-foreground grid min-w-40 gap-1 rounded-lg border px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold">{item.weekday?.description}</p>
      <p>
        Средняя выручка: <span className="font-medium">{priceRoundedRubles(item.averageRevenue).toLocaleString('ru-RU')} BYN</span>
      </p>
      <p className="text-muted-foreground">
        Дней с продажами: {item.salesDaysQuantity} из {item.daysQuantity}
      </p>
    </div>
  );
}

const WeekdayRevenueChart = ({ report }) => {
  const items = report?.items || [];

  const chartData = items.map((item) => ({
    ...item,
    label: shortWeekday(item.weekday),
    averageRevenueRub: priceRoundedRubles(item.averageRevenue),
  }));

  return (
    <Card className="mt-5">
      <CardContent className="p-6">
        <h3 className="mb-6 text-lg font-semibold">Средняя выручка по дням недели</h3>

        <ChartContainer config={{ averageRevenueRub: { label: 'Средняя выручка' } }} className="h-96 w-full">
          <BarChart data={chartData} margin={{ top: 12, right: 12, left: 12, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} width={56} tick={{ fontSize: 12 }} tickFormatter={(v) => v.toLocaleString('ru-RU')} />
            <Tooltip content={<WeekdayTooltip />} cursor={{ fill: 'var(--color-muted)' }} />
            <Bar dataKey="averageRevenueRub" radius={[4, 4, 0, 0]} maxBarSize={64}>
              {chartData.map((item) => (
                <Cell key={item.weekday?.name} fill={item.isWeekend ? WEEKDAY_BAR_COLORS.weekend : WEEKDAY_BAR_COLORS.workday} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default WeekdayRevenueChart;
