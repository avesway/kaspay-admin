import React from 'react';
import { AlertTriangle, ArrowUpDown, Package, PackageX, Store, TrendingDown, Warehouse } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';

const movingTargetsByStorage = {
  warehouse: [
    { type: 'salePoint', name: 'Мини-склад', icon: Store, iconClassName: 'text-primary' },
    { type: 'device', name: 'Точка продажи', icon: Package, iconClassName: 'text-primary' },
    { type: 'expiration', name: 'На склад просрочки', icon: TrendingDown, iconClassName: 'text-orange-500' },
    { type: 'theft', name: 'Воровство', icon: AlertTriangle, iconClassName: 'text-destructive' },
    { type: 'damage', name: 'Испорченная упаковка', icon: PackageX, iconClassName: 'text-orange-500' },
  ],
  salePoint: [
    { type: 'warehouse', name: 'Возврат на основной склад', icon: Warehouse, iconClassName: 'text-primary' },
    { type: 'device', name: 'Точка продажи', icon: Package, iconClassName: 'text-primary' },
    { type: 'expiration', name: 'На склад просрочки', icon: TrendingDown, iconClassName: 'text-orange-500' },
    { type: 'theft', name: 'Воровство', icon: AlertTriangle, iconClassName: 'text-destructive' },
    { type: 'damage', name: 'Испорченная упаковка', icon: PackageX, iconClassName: 'text-orange-500' },
  ],
  device: [
    { type: 'warehouse', name: 'Возврат на основной склад', icon: Warehouse, iconClassName: 'text-primary' },
    { type: 'device', name: 'Точка продажи', icon: Package, iconClassName: 'text-primary' },
    { type: 'expiration', name: 'На склад просрочки', icon: TrendingDown, iconClassName: 'text-orange-500' },
    { type: 'theft', name: 'Воровство', icon: AlertTriangle, iconClassName: 'text-destructive' },
    { type: 'damage', name: 'Испорченная упаковка', icon: PackageX, iconClassName: 'text-orange-500' },
  ],
  expiration: [],
  theft: [],
  damage: [],
};

export function getMovingTargets(storageTab) {
  return movingTargetsByStorage[storageTab] ?? [];
}

const StorageBalanceMovingProduct = ({ balance, storageTab }) => {
  const movingTargets = getMovingTargets(storageTab);

  const onMoving = (target) => {
    // Логика перемещения баланса будет подключена отдельной задачей
  };

  if (!movingTargets.length) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="">
          <ArrowUpDown className="h-4 w-4" />
          Перемещение
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {movingTargets.map((target) => (
          <DropdownMenuItem key={target.type} onClick={() => onMoving(target)}>
            <target.icon className={`h-4 w-4 ${target.iconClassName}`} />
            {target.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StorageBalanceMovingProduct;
