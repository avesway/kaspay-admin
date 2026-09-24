import React from 'react';

import { priceRoundedRubles } from '@/helpers/priceHelpers';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/shared/ui/card';

function formatMoney(kopecks) {
  return `${priceRoundedRubles(kopecks ?? 0).toLocaleString('ru-RU')} BYN`;
}

// workdayVsWeekendRate с сервера в промилле (‰): делим на 100 → проценты
function formatDeltaRate(rate) {
  if (rate === null || rate === undefined) return '—';
  return `${rate >= 0 ? '+' : '−'}${Math.abs(rate) / 100}%`;
}

const WeekdayRevenueCards = ({ report }) => {
  const best = report?.bestWeekday;
  const worst = report?.worstWeekday;

  return (
    <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
      <Card>
        <CardContent className="flex flex-col gap-1 p-5">
          <p className="text-muted-foreground text-sm">Лучший день</p>
          <p className="text-2xl font-bold">{best?.weekday?.description || '—'}</p>
          <p className="mt-2 text-xs text-emerald-600">{best ? `${formatMoney(best.averageRevenue)} avg` : ''}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-1 p-5">
          <p className="text-muted-foreground text-sm">Худший день</p>
          <p className="text-2xl font-bold">{worst?.weekday?.description || '—'}</p>
          <p className="mt-2 text-xs text-red-500">{worst ? `${formatMoney(worst.averageRevenue)} avg` : ''}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-1 p-5">
          <p className="text-muted-foreground text-sm">Будни vs выходные</p>
          <p
            className={cn(
              'text-2xl font-bold',
              report?.workdayVsWeekendRate !== null && report?.workdayVsWeekendRate < 0 && 'text-red-500',
            )}
          >
            {formatDeltaRate(report?.workdayVsWeekendRate)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeekdayRevenueCards;
