import { priceListsAPI } from '../../api';
import { usePriceListsStore } from '../../store';
import { toast } from 'sonner';
import { getPriceLists } from './getPriceLists';

export async function deletePriceList(priceListId, setOpen) {
  const { setLoading } = usePriceListsStore.getState();
  setLoading({ delete: true });

  await priceListsAPI
    .delete(priceListId)
    .then(async () => {
      await getPriceLists();
      toast.success('Прайс лист успешно удален', { position: 'top-center' });
    })
    .catch(() => {
      toast.error('Ошибка удаления прайс листа', { position: 'top-center' });
    })
    .finally(() => {
      setLoading({ delete: false });
      setOpen(false);
    });
}
