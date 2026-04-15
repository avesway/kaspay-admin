import { createHashRouter, redirect } from 'react-router';
import { App } from './app';
import { ROUTES } from '@/constants';
import { Providers } from './providers';
import { AppLoader } from '@/shared/AppLoader';
import { protectedLoader, ProtectedRoute } from './protectedRoute';
import { AuthLayout, DashboardLayout } from '@/shared/layouts';

export const router = createHashRouter([
  {
    element: (
      <Providers>
        <App />
      </Providers>
    ),
    hydrateFallbackElement: <AppLoader />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: ROUTES.LOGIN,
            lazy: () => import('@/modules/auth/login.page'),
          },
        ],
      },
      {
        loader: protectedLoader,
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: ROUTES.HOME,
                lazy: () => import('@/modules/home.page'),
              },
              {
                path: ROUTES.PRODUCTS,
                lazy: () => import('@/modules/products/products.page'),
              },
              {
                path: ROUTES.STORAGES,
                lazy: () => import('@/modules/storages/storages.page'),
              },
              {
                path: ROUTES.PRICE_MANAGEMENT,
                lazy: () => import('@/modules/priceManagement/priceManagement.page'),
              },
              {
                path: ROUTES.SALE_REPORTS,
                lazy: () => import('@/modules/saleReports/saleReports.page'),
              },
              {
                path: ROUTES.SALE_POINTS,
                children: [
                  {
                    index: true,
                    lazy: () => import('@/modules/salePoints/salePoints.page'),
                  },
                  {
                    path: ':id',
                    lazy: () => import('@/modules/salePoints/salePointDetails.page'),
                  },
                  {
                    path: ':id/device/:deviceId',
                    lazy: () => import('@/modules/devices/device.page'),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
