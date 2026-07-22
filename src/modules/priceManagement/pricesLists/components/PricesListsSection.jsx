import React, { useState } from 'react';

import PriceListForm from './PriceListForm';
import PricesListsItems from './PricesListsItems';

const PricesListsSection = () => {
  const [openForm, setOpenForm] = useState(false);

  return (
    <>
      <div className="mt-5 mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Прайс листы</h2>
          <p className="text-muted-foreground text-sm">Создание прайс листов на основе шаблонов матриц</p>
        </div>

        <PriceListForm openForm={openForm} setOpenForm={setOpenForm} />
      </div>
      <PricesListsItems setOpenForm={setOpenForm} />
    </>
  );
};

export default PricesListsSection;
