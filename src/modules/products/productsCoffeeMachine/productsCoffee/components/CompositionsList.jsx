import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import AppTable from '@/shared/AppTable';
import { Card, CardContent } from '@/shared/ui/card';

import CompositionDelete from './CompositionDelete';
import CompositionUpdate from './CompositionUpdate';
import { getUnitShort } from '../helpers/units';
import { getCompositions } from '../productsCoffee.processes';
import { useProductsCoffeeStore } from '../productsCoffee.store';

const CompositionsList = () => {
  const { compositions, loading } = useProductsCoffeeStore(
    useShallow((state) => ({
      compositions: state.compositions,
      loading: state.loading,
    })),
  );

  useEffect(() => {
    getCompositions();
  }, []);

  const columns = [
    {
      accessorKey: 'name',
      header: 'Название',
      cell: ({ row }) => (
        <div>
          <span className="text-sm font-medium">{row.original.name}</span>
          {row.original.description && (
            <p className="text-muted-foreground text-xs">{row.original.description}</p>
          )}
        </div>
      ),
    },
    {
      id: 'type',
      header: 'Тип',
      cell: ({ row }) => <span className="text-sm">{row.original.product?.purposeType?.description || '—'}</span>,
    },
    {
      id: 'items',
      header: 'Ресурсы',
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          {row.original.items?.map((item, index) => (
            <span key={`${item.productId}-${index}`} className="text-sm">
              {`${item.product?.shortName || item.product?.name || '—'} ${item.unitAmount} ${getUnitShort(item.unitType?.name)}`}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <CompositionUpdate composition={row.original} />
          <CompositionDelete composition={row.original} />
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
          <AppTable data={compositions} columns={columns} />
        )}
      </CardContent>
    </Card>
  );
};

export default CompositionsList;
