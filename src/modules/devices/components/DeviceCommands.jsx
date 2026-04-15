import React, { useEffect } from 'react';
import { Loader2, CircleAlert, ListCollapse } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { useDevicesStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import AppTable from '@/shared/AppTable';
import Pagination from '@/shared/Pagination';
import { getCommandsDevice, updatePaginationCommandsDevice } from '@/actions/devices.actions';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-[14px] font-medium  border border-border',
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
    <Card className="mt-3 w-[49%]">
      <CardHeader className="flex items-center gap-2 text-2xl">
        <ListCollapse className="h-6 w-6 text-primary" />
        <CardTitle className="flex items-center gap-2 text-2xl">Отправленные команды</CardTitle>
      </CardHeader>
      <CardContent>
        {loading.commands ? (
          <div className="mt-5 flex justify-center">
            <Loader2 className="animate-spin" color="var(--color-primary)" />
          </div>
        ) : error.commands ? (
          <div className="mt-5 flex gap-3 justify-center">
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
