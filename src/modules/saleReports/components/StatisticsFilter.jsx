import { useSalePointsStore, useSaleReportsStore } from '@/store';
import React, { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { ru } from 'date-fns/locale';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Calendar } from '@/shared/ui/calendar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Label } from '@/shared/ui/label';
import { updateStatisticsFilter } from '@/actions/saleReports.actions';

const StatisticsFilter = () => {
  const salePoints = useSalePointsStore((state) => state.salePoints);
  const statisticFilter = useSaleReportsStore((state) => state.statisticFilter);
  const [openDateFrom, setOpenDateFrom] = useState(false);
  const [openDateTo, setOpenDateTo] = useState(false);

  return (
    <Card className="my-10">
      <CardContent className="p-6 flex flex-row justify-between">
        <Popover open={openDateFrom} onOpenChange={setOpenDateFrom}>
          <PopoverTrigger asChild>
            <div className="w-[30%]">
              <Label className="mb-3">Период c:</Label>
              <Button variant="outline" id="date" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {`${format(statisticFilter.from, 'dd MMMM, y', { locale: ru })}`}
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={statisticFilter.from}
              locale={ru}
              disabled={{ after: new Date() }}
              onSelect={(date) => {
                setOpenDateFrom(false);
                updateStatisticsFilter({ from: format(date, 'yyyy-MM-dd') });
              }}
            />
          </PopoverContent>
        </Popover>

        <Popover open={openDateTo} onOpenChange={setOpenDateTo}>
          <PopoverTrigger asChild>
            <div className="w-[30%]">
              <Label className="mb-3">Период по:</Label>
              <Button variant="outline" id="date" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {`${format(statisticFilter.to, 'dd MMMM, y', { locale: ru })}`}
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={statisticFilter.to}
              locale={ru}
              disabled={{ after: new Date() }}
              onSelect={(date) => {
                setOpenDateTo(false);
                updateStatisticsFilter({ to: format(date, 'yyyy-MM-dd') });
              }}
            />
          </PopoverContent>
        </Popover>

        <div className="w-[30%]">
          <Label className="mb-3">Объект</Label>
          <Select value={statisticFilter.salePointIds} onValueChange={(e) => updateStatisticsFilter({ salePointIds: +e })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Объект" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {salePoints.length ? (
                  salePoints.map((point) => (
                    <SelectItem key={point.id} value={point.id}>
                      {point.name}
                    </SelectItem>
                  ))
                ) : (
                  <Loader2 className="animate-spin" />
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsFilter;
