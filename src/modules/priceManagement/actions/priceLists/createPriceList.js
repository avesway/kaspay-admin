import { priceListsAPI } from '../../api';
import { usePriceListsStore } from '../../store';
import { toast } from 'sonner';
import { getPriceLists } from './getPriceLists';

export async function createPriceList(data, setOpen) {
  const { setLoading } = usePriceListsStore.getState();
  setLoading({ create: true });

  const priceList = await priceListsAPI
    .create(data)
    .then(async (res) => {
      await getPriceLists();
      toast.success('Прайс лист успешно добавлен', { position: 'top-center' });
      return res;
    })
    .catch(() => {
      toast.error('Ошибка добавления прайс листа', { position: 'top-center' });
      return null;
    })
    .finally(() => {
      setLoading({ create: false });
      setOpen(false);
    });

  return priceList;
}
