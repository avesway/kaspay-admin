import React from 'react';
import { format } from 'date-fns';
import { CircleAlert, ClipboardList, Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import AppTable from '@/shared/AppTable';
import Pagination from '@/shared/Pagination';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

import { updatePaginationMovementTasks } from '../movementTasks.processes';
import { useMovementTasksStore } from '../movementTasks.store';

const STATUS_BADGE_CLASS_BY_NAME = {
  new: 'border-primary/30 bg-primary/10 text-primary',
  processing: 'border-orange-500 bg-orange-50 text-orange-500',
  completed: 'border-green-500 bg-green-50 text-green-500',
  cancelled: 'border-destructive bg-destructive/10 text-destructive',
};

const columnsMovementTasks = (onDetails) => [
  {
    id: 'id',
    header: '№ заказа',
    cell: ({ row }) => <span className="font-medium">{row.original.id}</span>,
  },
  {
    id: 'status',
    header: 'Статус',
    cell: ({ row }) => {
      const status = row.original.status;

      if (!status?.description) return <span className="text-muted-foreground">—</span>;

      return (
        <Badge variant="outline" className={STATUS_BADGE_CLASS_BY_NAME[status.name] ?? 'bg-muted text-muted-foreground'}>
          {status.description}
        </Badge>
      );
    },
  },
  {
    id: 'createdAt',
    header: 'Создано',
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {row.original.createdAt ? format(new Date(row.original.createdAt), 'dd.MM.yyyy HH:mm') : '—'}
      </span>
    ),
  },
  {
    id: 'actions',
    header: 'Действия',
    cell: ({ row }) => (
      <Button variant="outline" size="sm" onClick={() => onDetails?.(row.original)}>
        Детали
      </Button>
    ),
  },
];

const MovementTasksList = ({ onDetails }) => {
  const columns = columnsMovementTasks(onDetails);
  const { movementTasks, pagination, loading, error } = useMovementTasksStore(
    useShallow((state) => ({
      movementTasks: state.movementTasks,
      pagination: state.pagination,
      loading: state.loading,
      error: state.error,
    })),
  );

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <ClipboardList className="h-6 w-6 text-primary" />
          Список заданий
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading.list ? (
          <div className="mt-5 flex justify-center">
            <Loader2 className="animate-spin" color="var(--color-primary)" />
          </div>
        ) : error.list ? (
          <div className="mt-5 flex justify-center gap-3">
            <CircleAlert color="var(--color-destructive)" />
            <p className="text-destructive">Ошибка получения заданий</p>
          </div>
        ) : (
          <>
            <AppTable data={movementTasks} columns={columns} />
            <Pagination pagination={pagination} setPagination={updatePaginationMovementTasks} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MovementTasksList;
