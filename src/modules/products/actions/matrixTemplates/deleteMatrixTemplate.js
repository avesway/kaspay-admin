import { productsMatrixTemplatesAPI } from '../../api/productsMatrixTemplates.api';
import { useProductsMatrixTemplatesStore } from '../../store';
import { toast } from 'sonner';
import { getMatrixTemplates } from './getMatrixTemplates';

export async function deleteMatrixTemplate(templateId, setOpen) {
  const { setLoading } = useProductsMatrixTemplatesStore.getState();
  setLoading({ delete: true });

  await productsMatrixTemplatesAPI
    .delete(templateId)
    .then(async () => {
      await getMatrixTemplates();
      toast.success('Шаблон матрицы успешно удален', { position: 'top-center' });
    })
    .catch(() => {
      toast.error('Ошибка удаления шаблона матрицы', { position: 'top-center' });
    })
    .finally(() => {
      setLoading({ delete: false });
      setOpen(false);
    });
}
