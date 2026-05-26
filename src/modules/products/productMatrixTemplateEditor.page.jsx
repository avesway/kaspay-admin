import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useProductsMatrixTemplatesStore, useProductsCatalogStore } from './store';
import { getMatrixTemplates } from './actions/matrixTemplates';
import { getProductsCatalog } from './actions/catalog';
import ProductMatrixTemplateForm from './components/productsMatrixTemplates/ProductMatrixTemplateForm';

function ProductMatrixTemplateEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const templates = useProductsMatrixTemplatesStore((state) => state.templates);
  const loading = useProductsMatrixTemplatesStore((state) => state.loading);

  const isEdit = !!id;
  const template = isEdit ? templates.find((t) => String(t.id) === String(id)) : null;

  const catalogProducts = useProductsCatalogStore((state) => state.products);

  useEffect(() => {
    if (!templates.length) getMatrixTemplates();
    if (!catalogProducts.length) getProductsCatalog();
  }, []);

  const handleClose = () =>
    navigate('/products', { state: { tab: 'matrix-templates' } });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? 'Редактировать шаблон матрицы' : 'Создать шаблон матрицы'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isEdit ? template?.name : 'Настройте строки и заполните ячейки'}
          </p>
        </div>
      </div>

      <ProductMatrixTemplateForm
        loading={isEdit ? loading.update : loading.create}
        type={isEdit ? 'edit' : 'create'}
        template={template}
        setOpen={handleClose}
      />
    </div>
  );
}

export const Component = ProductMatrixTemplateEditorPage;
