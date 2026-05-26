import { useAccountStore } from './account.store';
import { useSalePointsStore } from './salePoints.store';
import {
  useProductsCatalogStore,
  useProductsStore,
  useProductsBalancesStore,
  useProductsCoffeeMachineStore,
  useProductsMatrixTemplatesStore,
} from '@/modules/products/store';
import { useStoragesStore } from './storages.store';
import { useSaleReportsStore } from './saleReports.store';
import { useDevicesStore } from './devices.store';
import { usePriceManagementStore, usePriceListsStore } from '@/modules/priceManagement/store';

export {
  useAccountStore,
  useSalePointsStore,
  useProductsCatalogStore,
  useProductsStore,
  useProductsBalancesStore,
  useProductsCoffeeMachineStore,
  useProductsMatrixTemplatesStore,
  useStoragesStore,
  useSaleReportsStore,
  useDevicesStore,
  usePriceManagementStore,
  usePriceListsStore,
};
