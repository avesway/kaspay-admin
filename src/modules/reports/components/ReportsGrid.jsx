import React from 'react';
import { BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/shared/ui/card';

import { CATEGORY_TYPE_COLORS, REPORT_ICONS } from '../helpers/reportsConfig';
import { useReportsStore } from '../reports.store';

const ReportsGrid = () => {
  const navigate = useNavigate();
  const { reports } = useReportsStore(
    useShallow((state) => ({
      reports: state.reports,
    })),
  );

  const handleOpenReport = (report) => {
    navigate(`${ROUTES.REPORTS}/${report.name}`, { state: { report } });
  };

  return (
    <div className="grid grid-cols-4 gap-5 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
      {reports.map((report) => {
        const colors = CATEGORY_TYPE_COLORS[report.categoryType?.name];
        const Icon = REPORT_ICONS[report.name] || BarChart3;
        return (
          <Card key={report.id} onClick={() => handleOpenReport(report)} className="hover:shadow-md cursor-pointer transition-shadow">
            <CardContent className="flex flex-col gap-3 p-5">
              <div className={cn('flex h-11 w-11 items-center justify-center rounded-lg', colors?.icon)}>
                <Icon className="size-6" />
              </div>

              <div>
                <p className={cn('text-xs', colors?.text)}>{report.categoryType?.description}</p>
                <h3 className="mt-1 font-semibold">{report.title}</h3>
                <p className="text-muted-foreground mt-0.5 text-sm">{report.description}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ReportsGrid;
