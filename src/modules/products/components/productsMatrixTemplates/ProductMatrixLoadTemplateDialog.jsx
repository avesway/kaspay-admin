import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { Button } from '@/shared/ui/button';
import { Plus } from 'lucide-react';
import { useProductsMatrixTemplatesStore } from '../../store';
import { useShallow } from 'zustand/react/shallow';

const TemplateList = ({ templates, onLoad }) => {
  if (!templates.length) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">Нет доступных шаблонов</p>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto">
      {templates.map((template) => (
        <Button
          key={template.id}
          variant="outline"
          className="w-full justify-between h-auto py-3"
          onClick={() => onLoad(template)}
        >
          <div className="text-left">
            <div className="font-medium">{template.name}</div>
            <div className="text-sm text-muted-foreground">
              Размер матрицы: {template.template} · {Object.keys(template.matrixData || {}).length} ячеек
            </div>
          </div>
          <Plus className="h-4 w-4 shrink-0" />
        </Button>
      ))}
    </div>
  );
};

const ProductMatrixLoadTemplateDialog = ({ editor, templateType = 'coffee' }) => {
  const { isTemplateDialogOpen, setIsTemplateDialogOpen, handleLoadTemplate } = editor;

  const templates = useProductsMatrixTemplatesStore(useShallow((state) => state.templates));

  const coffeeTemplates = templates.filter((t) => t.type === 'coffee');
  const fridgeTemplates = templates.filter((t) => t.type === 'fridge');

  return (
    <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Загрузить из шаблона</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={templateType} className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="coffee" className="flex-1">
              Кофейные автоматы
            </TabsTrigger>
            <TabsTrigger value="fridge" className="flex-1">
              Холодильники
            </TabsTrigger>
          </TabsList>

          <TabsContent value="coffee" className="mt-4">
            <TemplateList templates={coffeeTemplates} onLoad={handleLoadTemplate} />
          </TabsContent>

          <TabsContent value="fridge" className="mt-4">
            <TemplateList templates={fridgeTemplates} onLoad={handleLoadTemplate} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProductMatrixLoadTemplateDialog;
