import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { CircleAlert, ListCollapse, Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { cn } from '@/lib/utils';
import AppTable from '@/shared/AppTable';
import Pagination from '@/shared/Pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

import { getCommandsDevice, updatePaginationCommandsDevice } from '../device.processes';
import { useDevicesStore } from '../devices.store';

const columnsTableCommands = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'description',
    header: 'Команда',
  },
  {
    accessorKey: 'statusMessage',
    header: 'Описание',
  },
  {
    accessorKey: 'status',
    header: 'Статус',
    cell: ({ getValue }) => {
      const description = getValue().description;
      const status = getValue().name;

      function checkStatus(status) {
        switch (status) {
          case 'error':
            return 'text-destructive bg-red-50';
          case 'processing':
            return 'text-orange-400 bg-orange-50';
          default:
            return 'text-green-600 bg-green-50';
        }
      }

      return (
        <span
          className={cn(
            checkStatus(status),
            'border-border inline-flex items-center rounded-full border px-2.5 py-0.5 text-[14px] font-medium',
          )}
        >
          {description}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Создан',
    cell: ({ getValue }) => <span className="text-sm">{format(getValue(), 'dd.MM.yyyy HH:mm')}</span>,
  },
];

const DeviceCommands = () => {
  const { activeDevice, deviceCommands, loading, error, paginationCommands } = useDevicesStore(
    useShallow((state) => ({
      activeDevice: state.activeDevice,
      deviceCommands: state.deviceCommands,
      loading: state.loading,
      error: state.error,
      paginationCommands: state.paginationCommands,
    })),
  );

  useEffect(() => {
    if (activeDevice) getCommandsDevice();
  }, [activeDevice]);

  return (
    <Card className="mt-3 w-[49%] max-sm:w-full">
      <CardHeader className="flex items-center gap-2 text-2xl">
        <ListCollapse className="text-primary h-6 w-6" />
        <CardTitle className="flex items-center gap-2 text-2xl">Отправленные команды</CardTitle>
      </CardHeader>
      <CardContent>
        {loading.commands ? (
          <div className="mt-5 flex justify-center">
            <Loader2 className="animate-spin" color="var(--color-primary)" />
          </div>
        ) : error.commands ? (
          <div className="mt-5 flex justify-center gap-3">
            <CircleAlert color="var(--color-destructive)" />
            <p className="text-destructive">Ошибка получения команд</p>
          </div>
        ) : !deviceCommands.length ? (
          <div className="mt-5 flex justify-center">
            <p>Нет данных</p>
          </div>
        ) : (
          <>
            <AppTable data={deviceCommands} columns={columnsTableCommands} paginationRequest={paginationCommands} />
            <Pagination pagination={paginationCommands} setPagination={updatePaginationCommandsDevice} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceCommands;
