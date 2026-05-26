import { productsMatrixTemplatesAPI } from '../../api/productsMatrixTemplates.api';
import { useProductsMatrixTemplatesStore } from '../../store';
import { toast } from 'sonner';
import { getMatrixTemplates } from './getMatrixTemplates';

export async function createMatrixTemplate(data, setOpen) {
  const { setLoading } = useProductsMatrixTemplatesStore.getState();
  setLoading({ create: true });

  const template = await productsMatrixTemplatesAPI
    .create(data)
    .then(async (res) => {
      await getMatrixTemplates();
      toast.success('Шаблон матрицы успешно добавлен', { position: 'top-center' });
      return res;
    })
    .catch(() => {
      toast.error('Ошибка добавления шаблона матрицы', { position: 'top-center' });
      return null;
    })
    .finally(() => {
      setLoading({ create: false });
      setOpen(false);
    });

  return template;
}
