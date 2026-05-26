import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/shared/ui/button';
import { Edit } from 'lucide-react';

const ProductMatrixTemplateUpdate = ({ template }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8"
      onClick={() => navigate(`/products/matrix-templates/${template.id}/edit`)}
    >
      <Edit className="size-4" />
    </Button>
  );
};

export default ProductMatrixTemplateUpdate;
