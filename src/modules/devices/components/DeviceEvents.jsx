import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { CircleAlert, ClipboardList, Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import AppTable from '@/shared/AppTable';
import Pagination from '@/shared/Pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

import DeviceEventsFilter from './DeviceEventsFilter';
import { getEventsDevice, updatePaginationEventsDevice } from '../device.processes';
import { useDevicesStore } from '../devices.store';

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
  const { activeTerminalDevice, deviceEvents, loading, error, paginationEvents } = useDevicesStore(
    useShallow((state) => ({
      activeTerminalDevice: state.activeTerminalDevice,
      deviceEvents: state.deviceEvents,
      loading: state.loading,
      error: state.error,
      paginationEvents: state.paginationEvents,
    })),
  );

  useEffect(() => {
    if (activeTerminalDevice) getEventsDevice();
  }, [activeTerminalDevice]);

  return (
    <>
      <DeviceEventsFilter />

      <Card className="mt-3">
        <CardHeader className="flex items-center gap-2 text-2xl">
          <ClipboardList className="text-primary h-6 w-6" />
          <CardTitle className="flex items-center gap-2 text-2xl">Последние события</CardTitle>
        </CardHeader>
        <CardContent>
          {loading.events ? (
            <div className="mt-5 flex justify-center">
              <Loader2 className="animate-spin" color="var(--color-primary)" />
            </div>
          ) : error.events ? (
            <div className="mt-5 flex justify-center gap-3">
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
