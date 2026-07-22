import { toast } from 'sonner';

import { matricesAPI } from './matrices.api';
import { useMatricesStore } from './matrices.store';
import { getProductsCatalog } from '../productsCatalog/productsCatalog.processes';
import { useProductsCatalogStore } from '../productsCatalog/productsCatalog.store';

export async function getTemplatesMatrices() {
  const { setTemplates, setPagination, setError, setLoading } = useMatricesStore.getState();

  try {
    setLoading({ list: true });

    const response = await matricesAPI.getListMatrices();

    setTemplates(response.items);
    setPagination({ totalItems: response.totalItems, totalPages: response.totalPages });
    return response.items;
  } catch (error) {
    setError({ list: true });
    toast.error('Ошибка получения шаблонов матриц', { position: 'top-center' });
    return null;
  } finally {
    setLoading({ list: false });
  }
}

export function setPaginationMatricesList(size, page) {
  const { setPagination } = useMatricesStore.getState();
  setPagination({ size, page });
  getTemplatesMatrices();
}

export function filledCells() {
  const { activeMatrixRows } = useMatricesStore.getState();
  const { products } = useProductsCatalogStore.getState();

  const data = activeMatrixRows.reduce((acc, row) => {
    const filledColumns = row.columns.filter((col) => col.productId);

    if (!filledColumns.length) return acc;

    const filter = filledColumns.map((col) => ({
      position: `${row.row}:${col.columnId}`,
      product: products.find((i) => i.id === col.productId)?.name,
      columnProductQuantity: col.columnProductQuantity,
    }));

    return [...acc, ...filter];
  }, []);

  return data;
}

export function countEmptyCells() {
  const { activeMatrixRows } = useMatricesStore.getState();

  const data = activeMatrixRows.reduce((acc, row) => {
    const emptyColumns = row.columns.filter((col) => col.productId === '');

    if (!emptyColumns.length) return acc;

    return acc + emptyColumns.length;
  }, 0);

  return data;
}

export async function getTypesMatrices() {
  const { setTypesMatrices, setError, setLoading } = useMatricesStore.getState();

  try {
    setLoading({ types: true });

    const response = await matricesAPI.getTypesMatrices();

    setTypesMatrices(response);
  } catch (error) {
    setError({ types: true });
  } finally {
    setLoading({ types: false });
  }
}

export async function createMatrixTemplate(data, navigate) {
  const { activeMatrixRows, setError, setLoading } = useMatricesStore.getState();

  try {
    if (countEmptyCells() > 0) {
      setError({ emptyColumns: true });
      return;
    }

    setLoading({ create: true });

    const payload = {
      ...data,
      rows: activeMatrixRows,
    };

    await matricesAPI.create(payload);

    toast.success('Шаблон матрицы успешно создан', { position: 'top-center' });
    navigate('/products', { state: { tab: 'matrix-templates' } });
  } catch (error) {
    if (error?.response?.status === 409) {
      toast.error(error?.response?.data?.message, { position: 'top-center' });
      return;
    }

    toast.error('Ошибка создания шаблона матрицы', { position: 'top-center' });
  } finally {
    setLoading({ create: false });
  }
}

export async function updateMatrixTemplate(matrixId, data, navigate) {
  const { activeMatrixRows, setError, setLoading } = useMatricesStore.getState();

  try {
    if (countEmptyCells() > 0) {
      setError({ emptyColumns: true });
      return;
    }

    setLoading({ update: true });

    const payload = {
      ...data,
      rows: activeMatrixRows,
    };

    await matricesAPI.update(matrixId, payload);

    toast.success('Шаблон матрицы успешно изменен', { position: 'top-center' });
    navigate('/products', { state: { tab: 'matrix-templates' } });
  } catch (error) {
    if (error?.response?.status === 409) {
      toast.error(error?.response?.data?.message, { position: 'top-center' });
      return;
    }

    toast.error('Ошибка изменения шаблона матрицы', { position: 'top-center' });
  } finally {
    setLoading({ update: false });
  }
}

export function setEmptyGridMatrix() {
  const { setActiveMatrixRows, setActiveMatrix, typesMatrices } = useMatricesStore.getState();

  setActiveMatrixRows(
    Array.from({ length: 1 }, (_, index) => {
      return {
        row: index + 1,
        columns: Array.from({ length: 1 }, (_, i) => {
          return {
            productId: '',
            rowId: index + 1,
            columnId: i + 1,
            columnProductQuantity: 0,
          };
        }),
      };
    }),
  );

  setActiveMatrix(null);

  if (!typesMatrices.length) getTypesMatrices();
}

export async function checkingActiveMatrix(matrixId, navigate) {
  const { setActiveMatrixRows, setUpdatedMatrixRows, setActiveMatrix, templates } = useMatricesStore.getState();

  if (templates.length) return;

  const newTemplates = await getTemplatesMatrices();

  if (!newTemplates) {
    navigate('/products', { state: { tab: 'matrix-templates' } });
    return;
  }

  await getTypesMatrices();
  await getProductsCatalog();

  const activeMatrix = newTemplates.find((template) => template.id === matrixId);

  setActiveMatrix(activeMatrix);
  setUpdatedMatrixRows({ originalColumns: activeMatrix.rows });
  setActiveMatrixRows(activeMatrix.rows);
}
