import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStoragesStore } from '@/store';
import { getListStorages } from '@/actions/storages.actions';
import StorageItem from './StorageItem';
import { getStatisticsStorageRemainingProducts } from '@/actions/saleReports.actions';

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
    <div className="my-5 flex flex-row gap-5 flex-wrap">
      {storages.map((item) => (
        <StorageItem key={item.id} storage={item} loading={loading.listStorages} />
      ))}
    </div>
  );
};

export default StoragesList;
