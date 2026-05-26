import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Card, CardContent } from '@/shared/ui/card';
import { useProductsMatrixTemplatesStore } from '../../store';
import ProductMatrixTemplateCreate from './ProductMatrixTemplateCreate';
import ProductMatrixTemplateList from './ProductMatrixTemplateList';

const ProductsMatrixTemplatesSection = () => {
  const templates = useProductsMatrixTemplatesStore(useShallow((state) => state.templates));
  const total = templates.length;
  const coffeeCount = templates.filter((t) => t.type === 'coffee').length;
  const fridgeCount = templates.filter((t) => t.type === 'fridge').length;

  return (
    <>
      <div className="flex items-center justify-between mb-4 mt-5">
        <h2 className="text-xl font-semibold">Шаблоны матриц</h2>
        <ProductMatrixTemplateCreate />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{total}</div>
            <p className="text-sm text-muted-foreground mt-1">Всего шаблонов</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{coffeeCount}</div>
            <p className="text-sm text-muted-foreground mt-1">Кофейные автоматы</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{fridgeCount}</div>
            <p className="text-sm text-muted-foreground mt-1">Холодильники / снековые</p>
          </CardContent>
        </Card>
      </div>

      <ProductMatrixTemplateList />
    </>
  );
};

export default ProductsMatrixTemplatesSection;
