import { ROUTES } from './routes';
import { LayoutDashboard, Package, Warehouse, DollarSign, TrendingUp, Store } from 'lucide-react';

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
    title: 'Объекты',
    url: ROUTES.SALE_POINTS,
    icon: Store,
  },
];
