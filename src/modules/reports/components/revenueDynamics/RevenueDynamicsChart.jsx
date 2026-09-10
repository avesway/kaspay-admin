import React from 'react';
import { format } from 'date-fns';
import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts';

import { priceRoundedRubles } from '@/helpers/priceHelpers';
import { Card, CardContent } from '@/shared/ui/card';
import { ChartContainer, ChartTooltip } from '@/shared/ui/chart';

function formatBucketLabel(bucketFrom, bucketTo) {
  const from = format(bucketFrom, 'dd.MM');
  return bucketTo && bucketTo !== bucketFrom ? `${from}–${format(bucketTo, 'dd.MM')}` : from;
}

function RevenueTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const bucket = payload[0].payload;

  return (
    <div className="bg-popover text-popover-foreground grid min-w-40 gap-1 rounded-lg border px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold">{formatBucketLabel(bucket.bucketFrom, bucket.bucketTo)}</p>
      <p>
        Выручка: <span className="font-medium">{priceRoundedRubles(bucket.revenue).toLocaleString('ru-RU')} BYN</span>
      </p>
      <p className="text-muted-foreground">
        Чеки: {bucket.ordersQuantity} · Товары: {bucket.itemsQuantity}
      </p>
    </div>
  );
}

const RevenueDynamicsChart = ({ report }) => {
  const items = report?.items || [];
  const average = report?.averageRevenue || 0;

  const chartData = items.map((bucket) => ({
    ...bucket,
    revenueRub: priceRoundedRubles(bucket.revenue),
    label: formatBucketLabel(bucket.bucketFrom, bucket.bucketTo),
  }));

  return (
    <Card className="mt-5">
      <CardContent className="p-6">
        <h3 className="mb-6 text-lg font-semibold">Динамика выручки</h3>

        <ChartContainer config={{ revenueRub: { label: 'Выручка' } }} className="h-96 w-full">
          <BarChart data={chartData} margin={{ top: 12, right: 12, left: 12, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={24}
              tick={{ fontSize: 12 }}
            />
            <YAxis tickLine={false} axisLine={false} width={56} tick={{ fontSize: 12 }} tickFormatter={(v) => v.toLocaleString('ru-RU')} />
            <ChartTooltip cursor={{ fill: 'var(--color-muted)' }} content={<RevenueTooltip />} />
            <Bar dataKey="revenueRub" fill="var(--color-emerald-500, #10b981)" radius={[4, 4, 0, 0]} maxBarSize={56} />
            {average > 0 && (
              <ReferenceLine
                y={priceRoundedRubles(average)}
                stroke="#818cf8"
                strokeDasharray="6 6"
                strokeWidth={2}
              />
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueDynamicsChart;
