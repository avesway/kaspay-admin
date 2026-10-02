import React from 'react';

import AppTable from '@/shared/AppTable';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

const getAddressText = (terminal) => {
  const location = terminal.address?.locationAddress || terminal.salePoint?.address?.locationAddress;

  if (!location) return null;

  return [location.country, location.city && `г. ${location.city}`, location.street, location.building]
    .filter(Boolean)
    .join(', ');
};

const getUniqueSlaveValues = (terminal, pick) => [
  ...new Set((terminal.slaveDevices || []).map((device) => pick(device)).filter(Boolean)),
];

const columnsTerminals = (onDetails) => [
  {
    id: 'salePointName',
    header: 'Название',
    cell: ({ row }) => <span className="font-medium">{row.original.salePoint?.name || row.original.name}</span>,
  },
  {
    id: 'address',
    header: 'Адрес',
    cell: ({ row }) => {
      const address = getAddressText(row.original);

      return address ? <span>{address}</span> : <span className="text-muted-foreground">—</span>;
    },
  },
  {
    id: 'terminalName',
    header: 'Терминал',
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    id: 'types',
    header: 'Тип',
    cell: ({ row }) => {
      const types = getUniqueSlaveValues(row.original, (device) => device.type?.description);

      return types.length ? (
        <div className="flex flex-wrap gap-1">
          {types.map((type) => (
            <Badge key={type} variant="secondary">
              {type}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    id: 'matrix',
    header: 'Матрица',
    cell: ({ row }) => {
      const matrixNames = getUniqueSlaveValues(
        row.original,
        (device) => device.deviceProductMatrixPriceList?.matrixName,
      );

      return matrixNames.length ? (
        <div className="flex flex-wrap gap-1">
          {matrixNames.map((matrixName) => (
            <Badge key={matrixName} variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              {matrixName}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    id: 'priceList',
    header: 'Прайс-лист',
    cell: ({ row }) => {
      const priceListNames = getUniqueSlaveValues(
        row.original,
        (device) => device.deviceProductMatrixPriceList?.priceListName,
      );

      return priceListNames.length ? (
        <div className="flex flex-wrap gap-1">
          {priceListNames.map((priceListName) => (
            <Badge key={priceListName} variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              {priceListName}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    id: 'status',
    header: 'Статус',
    cell: ({ row }) => {
      const status = row.original.statusType;

      if (!status?.description) return <span className="text-muted-foreground">—</span>;

      if (status.name === 'active') {
        return (
          <Badge variant="outline" className="border-green-500 bg-green-50 text-green-500">
            {status.description}
          </Badge>
        );
      }

      if (status.name === 'inactive') {
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            {status.description}
          </Badge>
        );
      }

      return (
        <Badge variant="outline" className="border-orange-500 bg-orange-50 text-orange-500">
          {status.description}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Действия',
    cell: ({ row }) => (
      <Button variant="outline" size="sm" onClick={() => onDetails?.(row.original)}>
        Подробнее
      </Button>
    ),
  },
];

const TerminalsTable = ({ data = [], onDetails }) => {
  const columns = columnsTerminals(onDetails);

  return <AppTable data={data} columns={columns} />;
};

export default TerminalsTable;
