import React from 'react';
import { format } from 'date-fns';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import { priceRoundedRubles } from '@/helpers/priceHelpers';
import { Card, CardContent } from '@/shared/ui/card';
import { ChartContainer } from '@/shared/ui/chart';

function AverageReceiptTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;

  return (
    <div className="bg-popover text-popover-foreground grid min-w-40 gap-1 rounded-lg border px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold">{format(item.date, 'dd.MM')}</p>
      <p>
        Средний чек: <span className="font-medium">{priceRoundedRubles(item.averageReceipt).toLocaleString('ru-RU')} BYN</span>
      </p>
      <p className="text-muted-foreground">Чеки: {item.ordersQuantity}</p>
    </div>
  );
}

const AVERAGE_RECEIPT_CHART_CONFIG = {
  averageReceiptRub: { label: 'Факт', color: '#3b82f6' },
};

const AverageReceiptChart = ({ report }) => {
  const items = report?.items || [];

  const chartData = items.map((item) => ({
    ...item,
    label: format(item.date, 'dd.MM'),
    averageReceiptRub: priceRoundedRubles(item.averageReceipt),
  }));

  return (
    <Card className="mt-5">
      <CardContent className="p-6">
        <h3 className="mb-6 text-lg font-semibold">Средний чек по дням</h3>

        <ChartContainer config={AVERAGE_RECEIPT_CHART_CONFIG} className="h-96 w-full">
          <LineChart data={chartData} margin={{ top: 12, right: 12, left: 12, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} minTickGap={24} />
            <YAxis tickLine={false} axisLine={false} width={56} tick={{ fontSize: 12 }} tickFormatter={(v) => v.toLocaleString('ru-RU')} />
            <Tooltip content={<AverageReceiptTooltip />} cursor={{ stroke: 'var(--color-border)' }} />
            <Line
              type="monotone"
              dataKey="averageReceiptRub"
              name="averageReceiptRub"
              stroke={AVERAGE_RECEIPT_CHART_CONFIG.averageReceiptRub.color}
              strokeWidth={2}
              dot={{ r: 4, fill: '#fff' }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AverageReceiptChart;
