import { CheckCircle, CircleX, Info } from 'lucide-react';

import { Badge } from '@/shared/ui/badge';

export function deviceStatusBadge(statusData) {
  const type = statusData?.name === 'active' ? 'success' : statusData?.name === 'delivery' ? 'warning' : 'error';

  if (type === 'success')
    return (
      <div>
        <span className="text-muted-foreground text-[14px]">Статус</span>
        <div className="mt-2 flex flex-row items-center gap-2">
          <div>
            <CheckCircle size={20} color="var(--color-green-500)" />
          </div>
          <Badge variant="outline" className="border-b-green-500 bg-green-50 text-green-500">
            {statusData.description}
          </Badge>
        </div>
      </div>
    );

  if (type === 'warning')
    return (
      <div>
        <span className="text-muted-foreground text-[14px]">Статус</span>
        <div className="mt-2 flex flex-row items-center gap-2">
          <div>
            <Info size={20} color="var(--color-orange-500)" />
          </div>
          <Badge variant="outline" className="border-b-orange-500 bg-orange-50 text-orange-500">
            {statusData.description}
          </Badge>
        </div>
      </div>
    );

  if (type === 'error')
    return (
      <div>
        <span className="text-muted-foreground text-[14px]">Статус</span>
        <div className="mt-2 flex flex-row items-center gap-2">
          <div>
            <CircleX size={20} color="var(--color-destructive)" />
          </div>
          <Badge variant="outline" className="border-b-destructive bg-destructive/10 text-destructive">
            {statusData.description}
          </Badge>
        </div>
      </div>
    );
}
