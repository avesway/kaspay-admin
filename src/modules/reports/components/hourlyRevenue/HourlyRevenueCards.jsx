import React from 'react';

import { Card, CardContent } from '@/shared/ui/card';

const HOUR_DAY_PARTS = [
  { key: 'morning', label: 'Утро' },
  { key: 'lunch', label: 'Обед' },
  { key: 'evening', label: 'Вечер' },
];

function formatHour(hour) {
  return `${hour}:00`;
}

// revenueRate с сервера приходит в промилле (‰): null → 0, значение делим на 100 → проценты
function formatRate(rate) {
  if (rate === null || rate === undefined) return '0%';
  return `${rate / 100}%`;
}

const HourlyRevenueCards = ({ report }) => {
  const peak = report?.peakBucket;

  return (
    <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
      <Card>
        <CardContent className="flex flex-col gap-1 p-5">
          <p className="text-muted-foreground text-sm">Пик трафика</p>
          <p className="text-2xl font-bold">{peak ? formatHour(peak.hour) : '—'}</p>
          <p className="text-muted-foreground mt-2 text-xs">{peak ? `${peak.ordersQuantity} чеков` : ''}</p>
        </CardContent>
      </Card>

      {HOUR_DAY_PARTS.map(({ key, label }) => {
        const part = report?.[key];
        return (
          <Card key={key}>
            <CardContent className="flex flex-col gap-1 p-5">
              <p className="text-muted-foreground text-sm">
                {label} {part ? `${part.fromHour}–${part.toHour}` : ''}
              </p>
              <p className="text-2xl font-bold">{part ? formatRate(part.revenueRate) : '—'}</p>
              <p className="text-muted-foreground mt-2 text-xs">{part ? 'выручки' : ''}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default HourlyRevenueCards;
