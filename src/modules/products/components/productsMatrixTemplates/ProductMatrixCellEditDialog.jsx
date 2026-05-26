import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { useProductsCatalogStore } from '../../store';

const ProductMatrixCellEditDialog = ({ editor }) => {
  const {
    selectedCell,
    isCellEditDialogOpen,
    setIsCellEditDialogOpen,
    editProduct,
    editProductId,
    editPrice,
    editMaxQuantity,
    setEditProduct,
    setEditProductId,
    setEditPrice,
    setEditMaxQuantity,
    handleSaveCell,
    handleClearCell,
  } = editor;

  const products = useProductsCatalogStore((state) => state.products);

  const handleProductChange = (productId) => {
    const found = products.find((p) => String(p.id) === productId);
    if (found) {
      setEditProduct(found.shortName || found.name);
      setEditProductId(found.id);
    }
  };

  const currentProductId = editProductId
    ? String(editProductId)
    : products.find((p) => p.shortName === editProduct || p.name === editProduct)
        ? String(products.find((p) => p.shortName === editProduct || p.name === editProduct).id)
        : '';

  return (
    <Dialog open={isCellEditDialogOpen} onOpenChange={(open) => !open && setIsCellEditDialogOpen(false)}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Ячейка {selectedCell}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label>Продукт</Label>
            <Select value={currentProductId} onValueChange={handleProductChange}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите продукт из каталога" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={String(product.id)}>
                      {product.shortName || product.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Цена</Label>
            <Input
              type="number"
              placeholder="0"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Максимальное количество</Label>
            <Input
              type="number"
              placeholder="0"
              value={editMaxQuantity}
              onChange={(e) => setEditMaxQuantity(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="mt-4 gap-2 sm:justify-between">
          <Button variant="outline" onClick={handleClearCell}>
            Очистить ячейку
          </Button>
          <Button onClick={handleSaveCell} disabled={!editProduct || !editPrice}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductMatrixCellEditDialog;
