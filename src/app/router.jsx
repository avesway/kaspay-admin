import { createHashRouter, redirect } from 'react-router';

import { ROUTES } from '@/constants';
import { AppLoader } from '@/shared/AppLoader';
import { AuthLayout, DashboardLayout } from '@/shared/layouts';

import { App } from './app';
import { protectedLoader, ProtectedRoute } from './protectedRoute';
import { Providers } from './providers';

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
                children: [
                  {
                    index: true,
                    lazy: () => import('@/modules/products/products.page'),
                  },
                  {
                    path: 'matrix-templates/:id',
                    lazy: () => import('@/modules/products/matrices/matrixTemplate.page'),
                  },
                ],
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
                    path: ':id/device/:deviceId/:slaveDeviceId',
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
