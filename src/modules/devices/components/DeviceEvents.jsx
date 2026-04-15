import { Loader2, CircleAlert, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { format } from 'date-fns';
import { useDevicesStore } from '@/store';
import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Pagination from '@/shared/Pagination';
import AppTable from '@/shared/AppTable';
import { getEventsDevice, updatePaginationEventsDevice } from '@/actions/devices.actions';
import DeviceEventsFilter from './DeviceEventsFilter';

const columnsTableEvents = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'eventAt',
    header: 'Создан',
    cell: ({ getValue }) => <span className="text-sm">{format(getValue(), 'dd.MM.yyyy HH:mm')}</span>,
  },
  {
    accessorKey: 'eventMessage',
    header: 'Событие',
  },
  {
    accessorKey: 'type.description',
    header: 'Тип события',
  },
];

const DeviceEvents = () => {
  const { activeDevice, deviceEvents, loading, error, paginationEvents } = useDevicesStore(
    useShallow((state) => ({
      activeDevice: state.activeDevice,
      deviceEvents: state.deviceEvents,
      loading: state.loading,
      error: state.error,
      paginationEvents: state.paginationEvents,
    })),
  );

  useEffect(() => {
    if (activeDevice) getEventsDevice();
  }, [activeDevice]);

  return (
    <>
      <DeviceEventsFilter />

      <Card className="mt-3">
        <CardHeader className="flex items-center gap-2 text-2xl">
          <ClipboardList className="h-6 w-6 text-primary" />
          <CardTitle className="flex items-center gap-2 text-2xl">Последние события</CardTitle>
        </CardHeader>
        <CardContent>
          {loading.events ? (
            <div className="mt-5 flex justify-center">
              <Loader2 className="animate-spin" color="var(--color-primary)" />
            </div>
          ) : error.events ? (
            <div className="mt-5 flex gap-3 justify-center">
              <CircleAlert color="var(--color-destructive)" />
              <p className="text-destructive">Ошибка получения событий</p>
            </div>
          ) : !deviceEvents.length ? (
            <div className="mt-5 flex justify-center">
              <p>Нет данных</p>
            </div>
          ) : (
            <>
              <AppTable data={deviceEvents} columns={columnsTableEvents} paginationRequest={paginationEvents} />
              <Pagination pagination={paginationEvents} setPagination={updatePaginationEventsDevice} />
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default DeviceEvents;
