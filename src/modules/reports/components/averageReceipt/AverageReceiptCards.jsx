import React from 'react';
import { format } from 'date-fns';
import { ArrowDown, ArrowUp } from 'lucide-react';

import { priceRoundedRubles } from '@/helpers/priceHelpers';
import { cn } from '@/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';

function formatMoney(kopecks) {
  return `${priceRoundedRubles(kopecks ?? 0).toLocaleString('ru-RU')} BYN`;
}

// averageReceiptDeltaRate с сервера в промилле (‰): null → «—», иначе делим на 100 → проценты
function DeltaBadge({ rate }) {
  if (rate === null || rate === undefined) {
    return (
      <Badge variant="secondary" className="mt-2 w-fit font-medium">
        —
      </Badge>
    );
  }

  const isGrowth = rate >= 0;

  return (
    <Badge
      className={cn(
        'mt-2 w-fit cursor-default gap-1 bg-transparent px-0 hover:bg-transparent',
        isGrowth ? 'text-emerald-600' : 'text-red-500',
      )}
    >
      {isGrowth ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
      {Math.abs(rate) / 100}%
    </Badge>
  );
}

const AverageReceiptCards = ({ report }) => {
  const max = report?.maxAverageReceipt;
  const min = report?.minAverageReceipt;

  return (
    <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
      <Card>
        <CardContent className="flex flex-col gap-1 p-5">
          <p className="text-muted-foreground text-sm">Общий ср. чек</p>
          <p className="text-2xl font-bold">{formatMoney(report?.averageReceipt)}</p>
          <DeltaBadge rate={report?.averageReceiptDeltaRate} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-1 p-5">
          <p className="text-muted-foreground text-sm">Макс. чек</p>
          <p className="text-2xl font-bold">{formatMoney(max?.averageReceipt)}</p>
          <p className="text-muted-foreground mt-2 text-xs">{max?.salePointName || ''}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-1 p-5">
          <p className="text-muted-foreground text-sm">Мин. чек</p>
          <p className="text-2xl font-bold">{formatMoney(min?.averageReceipt)}</p>
          <p className="text-muted-foreground mt-2 text-xs">{min?.salePointName || ''}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AverageReceiptCards;
