import { ChartColumn, DollarSign, LayoutDashboard, Package, Store, TrendingUp, Warehouse } from 'lucide-react';

import { ROUTES } from './routes';

export const MENU = [
  {
    id: 1,
    title: 'Главная',
    url: ROUTES.HOME,
    icon: LayoutDashboard,
  },
  {
    id: 2,
    title: 'Товары',
    url: ROUTES.PRODUCTS,
    icon: Package,
  },
  {
    id: 3,
    title: 'Склад',
    url: ROUTES.STORAGES,
    icon: Warehouse,
  },
  {
    id: 4,
    title: 'Управление ценами',
    url: ROUTES.PRICE_MANAGEMENT,
    icon: DollarSign,
  },
  {
    id: 5,
    title: 'Отчеты по продажам',
    url: ROUTES.SALE_REPORTS,
    icon: TrendingUp,
  },
  {
    id: 6,
    title: 'Все отчеты',
    url: ROUTES.REPORTS,
    icon: ChartColumn,
  },
  {
    id: 7,
    title: 'Объекты',
    url: ROUTES.SALE_POINTS,
    icon: Store,
  },
];
