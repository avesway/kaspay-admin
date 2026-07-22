import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

import { Button } from '@/shared/ui/button';

import MatrixFilled from './components/MatrixFilled';
import MatrixForm from './components/MatrixForm';
import MatrixGrid from './components/MatrixGrid';
import { checkingActiveMatrix, setEmptyGridMatrix } from './matrices.processes';

function MatrixTemplatePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id === 'new') setEmptyGridMatrix();
    if (id != 'new') checkingActiveMatrix(id, navigate);
  }, [id]);

  return (
    <>
      <div className="flex-items flex gap-5 max-sm:flex-col max-sm:gap-5">
        <Button variant="outline" onClick={() => navigate('/products', { state: { tab: 'matrix-templates' } })}>
          <ArrowLeft />
          Шаблоны матриц
        </Button>
        <h1 className="flex flex-row items-center text-3xl font-bold max-sm:text-xl">
          {id === 'new' ? 'Создание шаблона матрицы' : 'Редактирование шаблона матрицы'}
        </h1>
      </div>

      <div className="mt-10">
        <MatrixForm isUpdate={id != 'new'} matrixId={id} />
        <div className="mt-5 flex flex-row gap-5">
          <MatrixGrid isUpdate={id != 'new'} />
          <MatrixFilled />
        </div>
      </div>
    </>
  );
}

export const Component = MatrixTemplatePage;
