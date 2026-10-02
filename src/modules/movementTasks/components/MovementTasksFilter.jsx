import React, { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Card, CardContent } from '@/shared/ui/card';
import { Label } from '@/shared/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

import { updateMovementTasksFilter } from '../movementTasks.processes';
import { useMovementTasksStore } from '../movementTasks.store';

const ALL_STATUSES = 'all';

const MovementTasksFilter = () => {
  const { movementTaskTypes, filter, loading } = useMovementTasksStore(
    useShallow((state) => ({
      movementTaskTypes: state.movementTaskTypes,
      filter: state.filter,
      loading: state.loading,
    })),
  );
  const [openDateFrom, setOpenDateFrom] = useState(false);
  const [openDateTo, setOpenDateTo] = useState(false);

  const handleStatusChange = (value) => {
    updateMovementTasksFilter({ statuses: value === ALL_STATUSES ? '' : value });
  };

  return (
    <Card className="my-6">
      <CardContent className="flex flex-row justify-between p-4 max-sm:flex-col max-sm:gap-3">
        <div className="w-[30%] max-sm:w-full">
          <Label className="mb-3">Статус</Label>
          <Select value={filter.statuses || ALL_STATUSES} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={ALL_STATUSES}>Все статусы</SelectItem>
                {loading.types ? (
                  <div className="flex justify-center p-2">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : (
                  movementTaskTypes.map((type) => (
                    <SelectItem key={type.name} value={type.name}>
                      {type.description}
                    </SelectItem>
                  ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Popover open={openDateFrom} onOpenChange={setOpenDateFrom}>
          <PopoverTrigger asChild>
            <div className="w-[30%] max-sm:w-full">
              <Label className="mb-3">Дата с:</Label>
              <Button variant="outline" id="date" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {`${format(filter.createdAtFrom, 'dd MMMM, y', { locale: ru })}`}
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={filter.createdAtFrom}
              locale={ru}
              disabled={{ after: new Date() }}
              onSelect={(date) => {
                setOpenDateFrom(false);
                updateMovementTasksFilter({ createdAtFrom: format(date, 'yyyy-MM-dd') });
              }}
            />
          </PopoverContent>
        </Popover>

        <Popover open={openDateTo} onOpenChange={setOpenDateTo}>
          <PopoverTrigger asChild>
            <div className="w-[30%] max-sm:w-full">
              <Label className="mb-3">Дата по:</Label>
              <Button variant="outline" id="date" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {`${format(filter.createdAtTo, 'dd MMMM, y', { locale: ru })}`}
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={filter.createdAtTo}
              locale={ru}
              onSelect={(date) => {
                setOpenDateTo(false);
                updateMovementTasksFilter({ createdAtTo: format(date, 'yyyy-MM-dd') });
              }}
            />
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
};

export default MovementTasksFilter;
