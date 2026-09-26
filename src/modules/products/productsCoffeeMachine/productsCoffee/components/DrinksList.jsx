import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import AppTable from '@/shared/AppTable';
import { Card, CardContent } from '@/shared/ui/card';

import DrinkDelete from './DrinkDelete';
import DrinkUpdate from './DrinkUpdate';
import { getUnitShort } from '../helpers/units';
import { getDrinks } from '../productsCoffee.processes';
import { useProductsCoffeeStore } from '../productsCoffee.store';

const DrinksList = () => {
  const { drinks, loading } = useProductsCoffeeStore(
    useShallow((state) => ({
      drinks: state.drinks,
      loading: state.loading,
    })),
  );

  useEffect(() => {
    getDrinks();
  }, []);

  const columns = [
    {
      accessorKey: 'name',
      header: 'Название',
      cell: ({ row }) => (
        <div>
          <span className="text-sm font-medium">{row.original.name}</span>
          {row.original.shortName && <p className="text-muted-foreground text-xs">{row.original.shortName}</p>}
        </div>
      ),
    },
    {
      id: 'composition',
      header: 'Состав',
      cell: ({ row }) => {
        const items = row.original.composition?.items;
        if (!items?.length) return <span className="text-muted-foreground text-sm">—</span>;
        return (
          <div className="flex flex-col gap-0.5">
            {items.map((item, index) => (
              <span key={`${item.product?.id}-${index}`} className="text-sm">
                {`${item.product?.shortName || item.product?.name || '—'} ${item.unitAmount} ${getUnitShort(item.product?.unitType?.name)}`}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <DrinkUpdate drink={row.original} />
          <DrinkDelete drink={row.original} />
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardContent>
        {loading.list ? (
          <div className="flex justify-center p-10">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <AppTable data={drinks} columns={columns} />
        )}
      </CardContent>
    </Card>
  );
};

export default DrinksList;
