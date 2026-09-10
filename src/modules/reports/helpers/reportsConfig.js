import { Activity, AlertTriangle, Award, BarChart3, BarChartHorizontalBig, Building2, CalendarDays, ChartPie, Clock, DollarSign, Grid3x3, Tag } from 'lucide-react';

export const REPORTS_CATEGORY_TYPES = [
  { value: '', title: 'Все отчеты' },
  { value: 'sales', title: 'Продажи' },
  { value: 'products', title: 'Товары' },
  { value: 'operations', title: 'Операции' },
];

export const REPORT_ICONS = {
  revenueDynamics: BarChart3,
  hourlyReport: Clock,
  weekdayReport: CalendarDays,
  salePointsComparison: Building2,
  topOutsiders: Award,
  abcAnalysis: BarChartHorizontalBig,
  categoriesReport: ChartPie,
  bcgMatrix: Grid3x3,
  averageReceipt: DollarSign,
  transactionsTraffic: Activity,
  anomaliesFailures: AlertTriangle,
  discountsPromo: Tag,
};

export const CATEGORY_TYPE_COLORS = {
  sales: {
    icon: 'bg-blue-100 text-blue-600',
    text: 'text-blue-600',
  },
  products: {
    icon: 'bg-emerald-100 text-emerald-600',
    text: 'text-emerald-600',
  },
  operations: {
    icon: 'bg-orange-100 text-orange-600',
    text: 'text-orange-600',
  },
};
