import React, { useState } from 'react';
import { differenceInCalendarDays, format } from 'date-fns';
import { ChevronDown, ChevronRight, CornerDownRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import StorageBalanceMovingProduct, { getMovingTargets } from '@/modules/storages/components/StorageBalanceMovingProduct';
import { Badge } from '@/shared/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

function deliveriesPlural(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return 'накладная';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'накладные';
  return 'накладных';
}

const BalanceExpirationCell = ({ balance }) => {
  if (!balance.expiredAt) return '-';

  const expiredDays = differenceInCalendarDays(new Date(), new Date(balance.expiredAt));

  return (
    <div className="whitespace-nowrap">
      <p className={cn(balance.expired && 'text-destructive')}>{format(new Date(balance.expiredAt), 'dd.MM.yyyy HH:mm')}</p>
      {balance.expired && <p className="text-destructive text-xs">просрочено {expiredDays} дн. назад</p>}
    </div>
  );
};

const ProductsBalancesTable = ({ data = [], storageTab, deviceId, sourceName }) => {
  const [expandedIds, setExpandedIds] = useState([]);
  const hasActions = getMovingTargets(storageTab).length > 0;

  const toggleExpanded = (productId) =>
    setExpandedIds((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));

  return (
    <Table className="border-muted border">
      <TableHeader>
        <TableRow>
          <TableHead className="h-8">Наименование товара</TableHead>
          <TableHead className="h-8">Накладная</TableHead>
          <TableHead className="h-8">Дата накладной</TableHead>
          <TableHead className="h-8 text-right">Кол-во</TableHead>
          <TableHead className="h-8">Окончание срока годности</TableHead>
          <TableHead className="h-8">Статус годности</TableHead>
          {hasActions && <TableHead className="h-8">Действия</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length ? (
          data.map(({ product, balances = [], actualQuantity, expiredQuantity, totalQuantity, totalDeliveries }) => (
            <React.Fragment key={product.id}>
              <TableRow className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleExpanded(product.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {expandedIds.includes(product.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    <span className="font-semibold">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell />
                <TableCell />
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Badge className="bg-green-50 text-green-600">{actualQuantity} годен</Badge>
                    {expiredQuantity > 0 && <Badge variant="destructive">{expiredQuantity} просрочен</Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  Всего: {totalQuantity} шт ({totalDeliveries} {deliveriesPlural(totalDeliveries)})
                </TableCell>
                <TableCell />
                {hasActions && <TableCell />}
              </TableRow>

              {expandedIds.includes(product.id) &&
                balances.map((balance) => (
                  <TableRow
                    key={balance.id}
                    className={cn('hover:bg-muted/30', balance.expired && 'bg-destructive/5 hover:bg-destructive/10')}
                  >
                    <TableCell>
                      <CornerDownRight className="text-muted-foreground h-4 w-4" />
                    </TableCell>
                    <TableCell className="font-medium">{balance.delivery?.waybillNumber || '-'}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {balance.delivery?.deliveryDate ? format(new Date(balance.delivery.deliveryDate), 'dd.MM.yyyy') : '-'}
                    </TableCell>
                    <TableCell className="text-right font-semibold">{balance.quantity} шт</TableCell>
                    <TableCell>
                      <BalanceExpirationCell balance={balance} />
                    </TableCell>
                    <TableCell>
                      {balance.expired ? (
                        <Badge variant="destructive">Просрочена</Badge>
                      ) : (
                        <Badge className="bg-green-50 text-green-600">Годен</Badge>
                      )}
                    </TableCell>
                    {hasActions && (
                      <TableCell>
                        <StorageBalanceMovingProduct
                          balance={balance}
                          product={product}
                          storageTab={storageTab}
                          deviceId={deviceId}
                          sourceName={sourceName}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
            </React.Fragment>
          ))
        ) : (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={hasActions ? 7 : 6} className="text-text-60 h-24 text-center">
              Нет данных.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ProductsBalancesTable;
