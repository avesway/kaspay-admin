import React, { useState } from 'react';
import { AlertTriangle, ArrowUpDown, Package, PackageX, Store, TrendingDown, Warehouse } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';

import StorageBalanceMovingTask from './StorageBalanceMovingTask';

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

const StorageBalanceMovingProduct = ({ balance, product, storageTab, deviceId, sourceName }) => {
  const movingTargets = getMovingTargets(storageTab);
  const [movingTarget, setMovingTarget] = useState(null);

  if (!movingTargets.length) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="">
            <ArrowUpDown className="h-4 w-4" />
            Перемещение
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {movingTargets.map((target) => (
            <DropdownMenuItem key={target.type} onClick={() => setMovingTarget(target)}>
              <target.icon className={`h-4 w-4 ${target.iconClassName}`} />
              {target.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {movingTarget ? (
        <StorageBalanceMovingTask
          open
          onClose={() => setMovingTarget(null)}
          balance={balance}
          product={product}
          target={movingTarget}
          storageTab={storageTab}
          deviceId={deviceId}
          sourceName={sourceName}
        />
      ) : null}
    </>
  );
};

export default StorageBalanceMovingProduct;
