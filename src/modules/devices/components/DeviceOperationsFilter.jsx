import { useSalePointsStore } from '@/store';
import React, { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { ru } from 'date-fns/locale';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Calendar } from '@/shared/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Label } from '@/shared/ui/label';
import { updateOperationsFilter } from '@/actions/salePoints.actions';

const DeviceOperationsFilter = () => {
  const filterOperations = useSalePointsStore((state) => state.filterOperations);
  const [openDateFrom, setOpenDateFrom] = useState(false);
  const [openDateTo, setOpenDateTo] = useState(false);

  return (
    <Card className="my-3 flex">
      <CardContent className="flex self-start gap-10 flex-row justify-between">
        <Popover open={openDateFrom} onOpenChange={setOpenDateFrom}>
          <PopoverTrigger asChild>
            <div className="w-64">
              <Label className="mb-3">Период c:</Label>
              <Button variant="outline" id="date" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {`${format(filterOperations.from, 'dd MMMM, y', { locale: ru })}`}
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={filterOperations.from}
              locale={ru}
              disabled={{ after: new Date() }}
              onSelect={(date) => {
                setOpenDateFrom(false);
                updateOperationsFilter({ from: format(date, 'yyyy-MM-dd') });
              }}
            />
          </PopoverContent>
        </Popover>

        <Popover open={openDateTo} onOpenChange={setOpenDateTo}>
          <PopoverTrigger asChild>
            <div className="w-64">
              <Label className="mb-3">Период по:</Label>
              <Button variant="outline" id="date" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {`${format(filterOperations.to, 'dd MMMM, y', { locale: ru })}`}
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={filterOperations.to}
              locale={ru}
              disabled={{ after: new Date() }}
              onSelect={(date) => {
                setOpenDateTo(false);
                updateOperationsFilter({ to: format(date, 'yyyy-MM-dd') });
              }}
            />
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
};

export default DeviceOperationsFilter;
