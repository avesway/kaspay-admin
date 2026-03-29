import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { useReactTable, flexRender, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { cn } from '@/lib/utils';

const AppTable = ({ data = [], columns = [], paginationRequest, onClick = () => {}, isClickable }) => {
  const [pagination, setPagination] = useState({
    pageIndex: (paginationRequest?.page || 1) - 1,
    pageSize: paginationRequest?.size || 10,
  });

  useEffect(() => {
    if (paginationRequest) {
      setPagination({
        pageIndex: paginationRequest.page - 1,
        pageSize: paginationRequest.size,
      });
    }
  }, [paginationRequest]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
  });

  return (
    <div className="space-y-4">
      <Table className="border border-muted">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className=" h-8">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                onClick={() => onClick(row)}
                className={cn(isClickable ? 'cursor-pointer' : 'cursor-default')}
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={cn(isClickable ? 'h-13' : 'h-9', 'text-sm')}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="h-24 text-center text-text-60">
                Нет данных.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppTable;
