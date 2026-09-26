import React from 'react';

import CategoriesList from './CategoriesList';
import CategoryCreate from './CategoryCreate';

const CategoriesSection = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Категории</h3>
        <CategoryCreate />
      </div>
      <CategoriesList />
    </div>
  );
};

export default CategoriesSection;
