import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ArrowDown, ArrowUp } from 'lucide-react';

import { priceRoundedRubles } from '@/helpers/priceHelpers';
import { cn } from '@/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';

function formatMoney(kopecks) {
  return `${priceRoundedRubles(kopecks ?? 0).toLocaleString('ru-RU')} BYN`;
}

function formatDateRange(from, to) {
  if (!from) return '';
  const fromText = format(from, 'dd.MM');
  return to && to !== from ? `${fromText} – ${format(to, 'dd.MM')}` : fromText;
}

function DeltaBadge({ rate, delta, previous, previousFrom, previousTo }) {
  if (rate === null || rate === undefined) {
    return (
      <Badge variant="secondary" className="mt-2 w-fit font-medium">
        —
      </Badge>
    );
  }

  const isGrowth = rate >= 0;
  const tooltip = [
    `Предыдущий период (${formatDateRange(previousFrom, previousTo)}): ${formatMoney(previous)}`,
    `Изменение: ${isGrowth ? '+' : '−'}${formatMoney(Math.abs(delta))}`,
  ].join('\n');

  return (
    <Badge
      title={tooltip}
      className={cn(
        'mt-2 w-fit cursor-default gap-1 bg-transparent px-0 hover:bg-transparent',
        isGrowth ? 'text-emerald-600' : 'text-red-500',
      )}
    >
      {isGrowth ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
      {Math.abs(rate)}%
    </Badge>
  );
}

const RevenueDynamicsStatCard = ({ label, value, valueKopecks, rate, delta, previous, previousFrom, previousTo, footer, className }) => {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col gap-1 p-5">
        <p className="text-muted-foreground text-sm">{label}</p>
        <p className="text-2xl font-bold">{value ?? formatMoney(valueKopecks)}</p>
        {rate !== undefined ? (
          <DeltaBadge rate={rate} delta={delta} previous={previous} previousFrom={previousFrom} previousTo={previousTo} />
        ) : (
          footer && <p className="text-muted-foreground mt-2 text-xs">{footer}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueDynamicsStatCard;
