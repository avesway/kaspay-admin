import React from 'react';
import PriceListCreate from './PriceListCreate';
import PriceListsList from './PriceListsList';

const PriceListsSection = () => {
  return (
    <>
      <div className="flex items-center justify-between mb-4 mt-5">
        <h2 className="text-xl font-semibold">Прайс листы</h2>
        <PriceListCreate />
      </div>
      <PriceListsList />
    </>
  );
};

export default PriceListsSection;
