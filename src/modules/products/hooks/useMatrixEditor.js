import { useState } from 'react';

const useMatrixEditor = (initialData = null) => {
  const [rowColumns, setRowColumns] = useState(initialData?.rowColumns || [4, 4]);
  const [matrixData, setMatrixData] = useState(initialData?.matrixData || {});
  const [selectedCell, setSelectedCell] = useState(null);
  const [editProduct, setEditProduct] = useState('');
  const [editProductId, setEditProductId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editMaxQuantity, setEditMaxQuantity] = useState('');
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isCellEditDialogOpen, setIsCellEditDialogOpen] = useState(false);

  const totalCells = rowColumns.reduce((sum, cols) => sum + cols, 0);
  const filledCells = Object.keys(matrixData).length;

  const handleCellClick = (position) => {
    setSelectedCell(position);
    const cellData = matrixData[position];
    setEditProduct(cellData?.product || '');
    setEditProductId(cellData?.productId || null);
    setEditPrice(cellData?.price || '');
    setEditMaxQuantity(cellData?.maxQuantity || '');
    setIsCellEditDialogOpen(true);
  };

  const handleSaveCell = () => {
    if (selectedCell && editProduct && editPrice) {
      setMatrixData((prev) => ({
        ...prev,
        [selectedCell]: {
          product: editProduct,
          productId: editProductId,
          price: editPrice,
          maxQuantity: editMaxQuantity,
        },
      }));
    }
    setIsCellEditDialogOpen(false);
    setSelectedCell(null);
  };

  const handleClearCell = () => {
    if (selectedCell) {
      setMatrixData((prev) => {
        const next = { ...prev };
        delete next[selectedCell];
        return next;
      });
    }
    setEditProduct('');
    setEditProductId(null);
    setEditPrice('');
    setEditMaxQuantity('');
    setIsCellEditDialogOpen(false);
    setSelectedCell(null);
  };

  const handleAddRow = () => setRowColumns((prev) => [...prev, 4]);

  const handleRemoveRow = (rowIndex) => {
    if (rowColumns.length <= 1) return;
    setRowColumns((prev) => prev.filter((_, i) => i !== rowIndex));
    setMatrixData((prev) => {
      const next = {};
      Object.entries(prev).forEach(([key, value]) => {
        const [row, col] = key.split('-').map(Number);
        if (row === rowIndex + 1) return;
        const newRow = row > rowIndex + 1 ? row - 1 : row;
        next[`${newRow}-${col}`] = value;
      });
      return next;
    });
  };

  const handleRowColumnsChange = (rowIndex, value) => {
    const clamped = Math.max(1, Math.min(10, parseInt(value) || 1));
    setRowColumns((prev) => prev.map((cols, i) => (i === rowIndex ? clamped : cols)));
  };

  const handleLoadTemplate = (template) => {
    if (template.rowColumns) {
      setRowColumns(template.rowColumns);
    }
    if (template.matrixData) {
      setMatrixData(template.matrixData);
    }
    setIsTemplateDialogOpen(false);
  };

  const getEditorData = () => ({ rowColumns, matrixData });

  return {
    rowColumns,
    matrixData,
    selectedCell,
    editProduct,
    editProductId,
    editPrice,
    editMaxQuantity,
    isTemplateDialogOpen,
    isCellEditDialogOpen,
    totalCells,
    filledCells,
    setEditProduct,
    setEditProductId,
    setEditPrice,
    setEditMaxQuantity,
    setIsTemplateDialogOpen,
    setIsCellEditDialogOpen,
    handleCellClick,
    handleSaveCell,
    handleClearCell,
    handleAddRow,
    handleRemoveRow,
    handleRowColumnsChange,
    handleLoadTemplate,
    getEditorData,
  };
};

export default useMatrixEditor;
