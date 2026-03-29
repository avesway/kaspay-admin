import 'react-router';

export const ROUTES = {
  LOGIN: '/auth/login',
  HOME: '/',
  PRODUCTS: '/products',
  STORAGES: '/storages',
  PRICE_MANAGEMENT: '/price-management',
  SALE_REPORTS: '/sale-reports',
  SALE_POINTS: '/sale-points',
};

export const PAGE_TITLES = {
  [ROUTES.HOME]: 'Главная',
  [ROUTES.PRODUCTS]: 'Товары',
  [ROUTES.STORAGES]: 'Склад',
  [ROUTES.PRICE_MANAGEMENT]: 'Управление ценами',
  [ROUTES.SALE_REPORTS]: 'Отчеты по продажам',
  [ROUTES.SALE_POINTS]: 'Объекты',
};
