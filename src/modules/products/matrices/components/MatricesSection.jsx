import React, { useEffect } from 'react';
import { CircleAlert, Coffee, Cookie, Grid2X2Check, Loader2, Plus, Refrigerator } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';

import MatricesList from './MatricesList';
import { getTemplatesMatrices, getTypesMatrices } from '../matrices.processes';
import { useMatricesStore } from '../matrices.store';

const MatricesSection = () => {
  const { templates, typesMatrices, loading, error } = useMatricesStore(
    useShallow((state) => ({
      templates: state.templates,
      typesMatrices: state.typesMatrices,
      loading: state.loading,
      error: state.error,
    })),
  );
  const navigate = useNavigate();

  useEffect(() => {
    getTemplatesMatrices();
    getTypesMatrices();
  }, []);

  function renderIconTypes(type) {
    switch (type) {
      case 'common':
        return <Grid2X2Check className="text-muted-foreground h-5 w-5" />;
      case 'fridge':
        return <Refrigerator className="text-muted-foreground h-5 w-5" />;
      case 'coffeeMachine':
        return <Coffee className="text-muted-foreground h-5 w-5" />;
      case 'snackMachine':
        return <Cookie className="text-muted-foreground h-5 w-5" />;
      default:
        return <Grid2X2Check />;
    }
  }

  if (loading.list)
    return (
      <div className="mt-10 flex justify-center">
        <Loader2 className="animate-spin" color="var(--color-primary)" />
      </div>
    );

  if (error.list)
    return (
      <div className="mt-10 flex justify-center gap-5">
        <CircleAlert color="var(--color-destructive)" />
        <p className="text-destructive">Ошибка получения шаблонов матриц</p>
      </div>
    );

  return (
    <>
      <div className="mt-5 mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Шаблоны матриц</h2>
          <p className="text-muted-foreground text-sm">Управление шаблонами матриц для разных типов оборудования</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/products/matrix-templates/new')}>
          <Plus className="h-4 w-4" />
          Добавить шаблон
        </Button>
      </div>

      {typesMatrices.length ? (
        <div className="mb-6 flex flex-row justify-between gap-5">
          {typesMatrices.map((type) => (
            <Card className="w-full max-w-[25%]" key={type.name}>
              <CardContent className="flex flex-row justify-between">
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">{type.description}</p>
                  <div className="text-3xl font-bold">{templates.filter((template) => template.type === type.name)?.length}</div>
                </div>
                <div>{renderIconTypes(type.name)}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      <MatricesList />
    </>
  );
};

export default MatricesSection;
