import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { getStatisticsStorageRemainingProducts } from '@/modules/saleReports/saleReports.processes';
import { getListStorages } from '@/modules/storages/storages.processes';

import StorageItem from './StorageItem';
import { useStoragesStore } from '../storages.store';

const StoragesList = () => {
  const { loading, storages } = useStoragesStore(
    useShallow((state) => ({
      loading: state.loading,
      storages: state.storages,
    })),
  );

  useEffect(() => {
    getListStorages();
  }, []);

  useEffect(() => {
    if (storages.length) {
      const ids = storages
        .map((item) => `storageIds=${item.id}`)
        .join()
        .replace(/,/g, '&');

      getStatisticsStorageRemainingProducts(ids);
    }
  }, [storages]);

  return (
    <div className="my-5 flex flex-row flex-wrap gap-5">
      {storages.map((item) => (
        <StorageItem key={item.id} storage={item} loading={loading.listStorages} />
      ))}
    </div>
  );
};

export default StoragesList;
