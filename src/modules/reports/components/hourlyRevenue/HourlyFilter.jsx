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

import { updateHourlyFilter } from '../../reports.processes';
import { useReportsStore } from '../../reports.store';

const ALL_SALE_POINTS = 'all';

const HourlyFilter = () => {
  const salePoints = useSalePointsStore((state) => state.salePoints);
  const hourlyFilter = useReportsStore((state) => state.hourlyFilter);
  const [openDate, setOpenDate] = useState(false);

  const handleSalePointChange = (value) => {
    updateHourlyFilter({ salePointIds: value === ALL_SALE_POINTS ? '' : value });
  };

  return (
    <Card className="my-10">
      <CardContent className="flex flex-row justify-between p-6 max-sm:flex-col max-sm:gap-3">
        <Popover open={openDate} onOpenChange={setOpenDate}>
          <PopoverTrigger asChild>
            <div className="w-[48%] max-sm:w-full">
              <Label className="mb-3">Дата:</Label>
              <Button variant="outline" id="date" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {`${format(hourlyFilter.date, 'dd MMMM, y', { locale: ru })}`}
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={hourlyFilter.date}
              locale={ru}
              disabled={{ after: new Date() }}
              onSelect={(date) => {
                setOpenDate(false);
                updateHourlyFilter({ date: format(date, 'yyyy-MM-dd') });
              }}
            />
          </PopoverContent>
        </Popover>

        <div className="w-[48%] max-sm:w-full">
          <Label className="mb-3">Объект:</Label>
          <Select value={hourlyFilter.salePointIds || ALL_SALE_POINTS} onValueChange={handleSalePointChange}>
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

export default HourlyFilter;
