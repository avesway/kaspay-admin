import { toast } from 'sonner';

import { movementTasksAPI } from '@/modules/movementTasks/movementTasks.api';

import { useMovementTasksStore } from './movementTasks.store';

function buildTasksParams(filter, pagination) {
  const statuses = filter.statuses ? `statuses=${filter.statuses}&` : '';

  return `?${statuses}createdAtFrom=${filter.createdAtFrom}&createdAtTo=${filter.createdAtTo}&page=${pagination.page}&pageSize=${pagination.size}`;
}

export async function getMovementTaskTypes() {
  const { setLoading, setError, setMovementTaskTypes } = useMovementTasksStore.getState();
  setLoading({ types: true });

  await movementTasksAPI
    .getMovementTaskTypes()
    .then((res) => setMovementTaskTypes(res?.items ?? res ?? []))
    .catch((err) => setError({ types: true }))
    .finally(() => setLoading({ types: false }));
}

export async function getMovementTasksList() {
  const { setLoading, setError, setMovementTasks, setPagination, filter, pagination } =
    useMovementTasksStore.getState();
  setLoading({ list: true });

  await movementTasksAPI
    .getMovementTasks(buildTasksParams(filter, pagination))
    .then((res) => {
      setMovementTasks(res.items);
      setPagination({ page: res.page, totalItems: res.totalItems, totalPages: res.totalPages });
    })
    .catch((err) => {
      setError({ list: true });
      toast.error('Ошибка получения заданий', {
        position: 'top-center',
      });
    })
    .finally(() => setLoading({ list: false }));
}

export function updateMovementTasksFilter(data) {
  const { setFilter, setPagination } = useMovementTasksStore.getState();

  setFilter(data);
  setPagination({ page: 1 });

  getMovementTasksList();
}

export function updatePaginationMovementTasks(size, page) {
  const { setPagination } = useMovementTasksStore.getState();

  setPagination({ size, page });

  getMovementTasksList();
}
