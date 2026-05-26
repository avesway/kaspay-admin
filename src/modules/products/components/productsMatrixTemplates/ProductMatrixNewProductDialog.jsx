import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { AVAILABLE_RESOURCES, PRODUCT_TYPES } from './constants';

const ProductMatrixNewProductDialog = ({ editor }) => {
  const {
    isNewProductDialogOpen,
    setIsNewProductDialogOpen,
    newProduct,
    setNewProduct,
    handleAddResource,
    handleRemoveResource,
    handleResourceChange,
    handleCreateProduct,
  } = editor;

  return (
    <Dialog open={isNewProductDialogOpen} onOpenChange={setIsNewProductDialogOpen}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Новый продукт</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label>
              Название<span className="text-destructive">*</span>
            </Label>
            <Input
              value={newProduct?.name}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Введите название продукта"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>
              Цена<span className="text-destructive">*</span>
            </Label>
            <Input
              type="number"
              value={newProduct?.price}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Внешний идентификатор</Label>
              <Input
                value={newProduct?.externalId}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, externalId: e.target.value }))}
                placeholder="Необязательно"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>НДС</Label>
              <Input
                value={newProduct?.vat}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, vat: e.target.value }))}
                placeholder="Необязательно"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Тип продукта</Label>
            <Select
              value={newProduct?.type}
              onValueChange={(value) => setNewProduct((prev) => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {newProduct?.type === 'Товар' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label>Ресурсы</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddResource} className="gap-1">
                  <Plus className="h-4 w-4" />
                  Добавить ресурс
                </Button>
              </div>

              {newProduct?.resources?.map((resource, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Select
                    value={resource.resource}
                    onValueChange={(value) => handleResourceChange(index, 'resource', value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Выберите ресурс" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_RESOURCES.map((res) => (
                        <SelectItem key={res} value={res}>
                          {res}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={resource.amount}
                    onChange={(e) => handleResourceChange(index, 'amount', e.target.value)}
                    placeholder="0"
                    className="w-24"
                  />
                  {newProduct.resources.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveResource(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          <Button onClick={handleCreateProduct} disabled={!newProduct?.name || !newProduct?.price} className="mt-2">
            Создать продукт
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductMatrixNewProductDialog;
