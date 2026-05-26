import { priceListsAPI } from '../../api';
import { usePriceListsStore } from '../../store';
import { toast } from 'sonner';
import { getPriceLists } from './getPriceLists';

export async function updatePriceList(priceListId, data, setOpen) {
  const { setLoading } = usePriceListsStore.getState();
  setLoading({ update: true });

  const priceList = await priceListsAPI
    .update(priceListId, data)
    .then(async (res) => {
      await getPriceLists();
      toast.success('Прайс лист успешно изменен', { position: 'top-center' });
      return res;
    })
    .catch(() => {
      toast.error('Ошибка изменения прайс листа', { position: 'top-center' });
      return null;
    })
    .finally(() => {
      setLoading({ update: false });
      setOpen(false);
    });

  return priceList;
}
