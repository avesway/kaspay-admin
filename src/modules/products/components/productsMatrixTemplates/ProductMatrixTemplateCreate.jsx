import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/shared/ui/button';
import { Plus } from 'lucide-react';

const ProductMatrixTemplateCreate = () => {
  const navigate = useNavigate();

  return (
    <Button className="gap-2" onClick={() => navigate('/products/matrix-templates/new')}>
      <Plus className="h-4 w-4" />
      Добавить шаблон
    </Button>
  );
};

export default ProductMatrixTemplateCreate;
