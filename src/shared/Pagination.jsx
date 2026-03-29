import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/shared/ui/select';

const Pagination = ({ pagination, setPagination }) => {
  return (
    <div className="flex items-center justify-end gap-10 mt-10">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Показать:</span>
        <Select value={pagination.size} onValueChange={(v) => setPagination(v, pagination.page)} className="h-6 w-16">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Показать" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel></SelectLabel>
              <SelectItem value={5}>5</SelectItem>
              <SelectItem value={10}>10</SelectItem>
              <SelectItem value={50}>50</SelectItem>
              <SelectItem value={100}>100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">записей</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Страница {pagination.page} из {pagination.totalPages}
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination(pagination.size, pagination.page - 1)}
            disabled={pagination.page === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="size-4" />
          </Button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter((page) => {
              return page === 1 || page === pagination.totalPages || (page >= pagination.page - 1 && page <= pagination.page + 1);
            })
            .map((page, index, array) => {
              const showEllipsis = index > 0 && array[index - 1] !== page - 1;
              return (
                <React.Fragment key={page}>
                  {showEllipsis && <span className="px-2 text-muted-foreground">...</span>}
                  <Button
                    variant={pagination.page === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPagination(pagination.size, page)}
                    className="h-8 min-w-8 px-3"
                  >
                    {page}
                  </Button>
                </React.Fragment>
              );
            })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination(pagination.size, pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages || pagination.totalPages === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
