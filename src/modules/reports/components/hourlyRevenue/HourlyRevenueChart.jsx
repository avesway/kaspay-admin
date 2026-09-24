import React from 'react';
import { Bar, CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis } from 'recharts';

import { priceRoundedRubles } from '@/helpers/priceHelpers';
import { Card, CardContent } from '@/shared/ui/card';
import { ChartContainer } from '@/shared/ui/chart';

function formatHour(hour) {
  return `${hour}:00`;
}

function HourlyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const bucket = payload[0]?.payload;

  return (
    <div className="bg-popover text-popover-foreground grid min-w-40 gap-1 rounded-lg border px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold">{formatHour(label)}</p>
      <p>
        Выручка: <span className="font-medium">{priceRoundedRubles(bucket.revenue).toLocaleString('ru-RU')} BYN</span>
      </p>
      <p className="text-muted-foreground">Транзакции: {bucket.ordersQuantity}</p>
    </div>
  );
}

const HOURLY_CHART_CONFIG = {
  revenueRub: { label: 'Выручка, BYN', color: '#3b82f6' },
  ordersQuantity: { label: 'Транзакции', color: '#10b981' },
};

const HourlyRevenueChart = ({ report }) => {
  const items = report?.items || [];

  const chartData = items.map((bucket) => ({
    ...bucket,
    revenueRub: priceRoundedRubles(bucket.revenue),
  }));

  return (
    <Card className="mt-5">
      <CardContent className="p-6">
        <h3 className="mb-6 text-lg font-semibold">Выручка и транзакции по часам</h3>

        <ChartContainer config={HOURLY_CHART_CONFIG} className="h-96 w-full">
          <ComposedChart data={chartData} margin={{ top: 12, right: 12, left: 12, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis dataKey="hour" tickFormatter={formatHour} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <YAxis
              yAxisId="revenue"
              orientation="left"
              tickLine={false}
              axisLine={false}
              width={56}
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => v.toLocaleString('ru-RU')}
            />
            <YAxis yAxisId="orders" orientation="right" tickLine={false} axisLine={false} width={40} tick={{ fontSize: 12 }} />
            <Tooltip content={<HourlyTooltip />} cursor={{ fill: 'var(--color-muted)' }} />
            <Legend
              iconType="circle"
              formatter={(value) => <span className="text-muted-foreground text-sm">{HOURLY_CHART_CONFIG[value]?.label}</span>}
            />
            <Bar
              yAxisId="revenue"
              dataKey="revenueRub"
              name="revenueRub"
              fill={HOURLY_CHART_CONFIG.revenueRub.color}
              radius={[4, 4, 0, 0]}
              maxBarSize={56}
            />
            <Line
              yAxisId="orders"
              type="monotone"
              dataKey="ordersQuantity"
              name="ordersQuantity"
              stroke={HOURLY_CHART_CONFIG.ordersQuantity.color}
              strokeWidth={2}
              dot={{ r: 4, fill: '#fff' }}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default HourlyRevenueChart;
