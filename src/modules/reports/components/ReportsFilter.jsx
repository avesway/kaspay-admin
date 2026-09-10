import React, { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';

import { useSalePointsStore } from '@/modules/salePoints/salePoints.store';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Card, CardContent } from '@/shared/ui/card';
import { Label } from '@/shared/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

import { updateReportsFilter } from '../reports.processes';
import { useReportsStore } from '../reports.store';

const ALL_SALE_POINTS = 'all';

const ReportsFilter = () => {
  const salePoints = useSalePointsStore((state) => state.salePoints);
  const reportsFilter = useReportsStore((state) => state.reportsFilter);
  const [openDateFrom, setOpenDateFrom] = useState(false);
  const [openDateTo, setOpenDateTo] = useState(false);

  const handleSalePointChange = (value) => {
    updateReportsFilter({ salePointIds: value === ALL_SALE_POINTS ? '' : value });
  };

  return (
    <Card className="my-6">
      <CardContent className="flex flex-row justify-between p-4 max-sm:flex-col max-sm:gap-3">
        <Popover open={openDateFrom} onOpenChange={setOpenDateFrom}>
          <PopoverTrigger asChild>
            <div className="w-[30%] max-sm:w-full">
              <Label className="mb-3">Период c:</Label>
              <Button variant="outline" id="date" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {`${format(reportsFilter.from, 'dd MMMM, y', { locale: ru })}`}
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={reportsFilter.from}
              locale={ru}
              disabled={{ after: new Date() }}
              onSelect={(date) => {
                setOpenDateFrom(false);
                updateReportsFilter({ from: format(date, 'yyyy-MM-dd') });
              }}
            />
          </PopoverContent>
        </Popover>

        <Popover open={openDateTo} onOpenChange={setOpenDateTo}>
          <PopoverTrigger asChild>
            <div className="w-[30%] max-sm:w-full">
              <Label className="mb-3">Период по:</Label>
              <Button variant="outline" id="date" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {reportsFilter.to ? `${format(reportsFilter.to, 'dd MMMM, y', { locale: ru })}` : 'По текущий момент'}
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={reportsFilter.to}
              locale={ru}
              onSelect={(date) => {
                setOpenDateTo(false);
                updateReportsFilter({ to: format(date, 'yyyy-MM-dd') });
              }}
            />
          </PopoverContent>
        </Popover>

        <div className="w-[30%] max-sm:w-full">
          <Label className="mb-3">Объект</Label>
          <Select value={reportsFilter.salePointIds || ALL_SALE_POINTS} onValueChange={handleSalePointChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Объект" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={ALL_SALE_POINTS}>Все объекты</SelectItem>
                {salePoints.length ? (
                  salePoints.map((point) => (
                    <SelectItem key={point.id} value={point.id}>
                      {point.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="flex justify-center p-2">
                    <Loader2 className="animate-spin" />
                  </div>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsFilter;
