import React, { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { updateOperationsFilter } from '@/modules/salePoints/salePoints.processes';
import { useSalePointsStore } from '@/modules/salePoints/salePoints.store';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Card, CardContent } from '@/shared/ui/card';
import { Label } from '@/shared/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

const DeviceOperationsFilter = () => {
  const filterOperations = useSalePointsStore((state) => state.filterOperations);
  const [openDateFrom, setOpenDateFrom] = useState(false);
  const [openDateTo, setOpenDateTo] = useState(false);

  return (
    <Card className="my-3 flex">
      <CardContent className="flex flex-row justify-between gap-10 self-start max-sm:flex-col max-sm:gap-3">
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
