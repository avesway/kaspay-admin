import { CheckCircle, Info } from 'lucide-react';

import { Badge } from '@/shared/ui/badge';

export function devicePriceListBadge(priceListId, priceListName) {
  const type = priceListId ? 'success' : 'warning';

  if (type === 'success')
    return (
      <div>
        <span className="text-muted-foreground text-[14px]">Прайс лист</span>
        <div className="mt-2 flex flex-row items-center gap-2">
          <div>
            <CheckCircle size={20} color="var(--color-green-500)" />
          </div>
          <Badge variant="outline" className="border-b-green-500 bg-green-50 text-green-500">
            {priceListName}
          </Badge>
        </div>
      </div>
    );

  if (type === 'warning')
    return (
      <div>
        <span className="text-muted-foreground text-[14px]">Прайс лист</span>
        <div className="mt-2 flex flex-row items-center gap-2">
          <div>
            <Info size={20} color="var(--color-orange-500)" />
          </div>
          <Badge variant="outline" className="border-b-orange-500 bg-orange-50 text-orange-500">
            Не подключен
          </Badge>
        </div>
      </div>
    );
}
