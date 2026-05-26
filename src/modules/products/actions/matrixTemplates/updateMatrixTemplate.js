import { productsMatrixTemplatesAPI } from '../../api/productsMatrixTemplates.api';
import { useProductsMatrixTemplatesStore } from '../../store';
import { toast } from 'sonner';
import { getMatrixTemplates } from './getMatrixTemplates';

export async function updateMatrixTemplate(templateId, data, setOpen) {
  const { setLoading } = useProductsMatrixTemplatesStore.getState();
  setLoading({ update: true });

  const template = await productsMatrixTemplatesAPI
    .update(templateId, data)
    .then(async (res) => {
      await getMatrixTemplates();
      toast.success('Шаблон матрицы успешно изменен', { position: 'top-center' });
      return res;
    })
    .catch(() => {
      toast.error('Ошибка изменения шаблона матрицы', { position: 'top-center' });
      return null;
    })
    .finally(() => {
      setLoading({ update: false });
      setOpen(false);
    });

  return template;
}
