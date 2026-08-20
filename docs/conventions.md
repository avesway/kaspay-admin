# Конвенции и паттерны kaspay-admin

Все примеры — из реального кода проекта.

## Именование файлов

- Компоненты: `PascalCase.jsx` (`SalePointsList.jsx`, `ProductForm.jsx`), `export default`.
- Страницы: `<name>.page.jsx`, именованный `export const Component = XxxPage`.
- Модульные файлы с точечными суффиксами: `salePoints.api.js`, `salePoints.store.js`, `salePoints.processes.js`.
- Инфраструктура: kebab/lowercase (`protectedRoute.jsx`, `use-mobile.js`).

## Анатомия модуля

Минимальный полный набор (см. `modules/salePoints`, `modules/storages`):

```
modules/<feature>/
  <name>.api.js         — только HTTP (axios instance), объект <name>API
  <name>.store.js       — zustand стор
  <name>.processes.js   — оркестрация api → store → toast
  components/           — UI-компоненты фичи
  hooks/                — опционально (useProductForm, useAuth)
  <name>.page.jsx       — entry для роутера
```

## API-модуль

```js
// salePoints.api.js
import instanceAxios from '@/config/axios';

export const salePointsAPI = {
  getListSalePoints: async () => {
    const response = await instanceAxios.get(`sale-points`);
    return response?.data;
  },
};
```

- Пути — относительные, без baseURL (он в `src/config/axios.js`).
- GET-параметры собираются строкой `params` вызывающим процессом.

## Стор (zustand)

```js
export const useSalePointsStore = create((set, get) => ({
  salePoints: [],
  loading: { list: false },
  error: { list: false },
  pagination: { page: 1, size: 10, totalItems: 0, totalPages: 1 },
  setSalePoints: (salePoints) => set({ salePoints }),
  setLoading: (loading) => set({ loading: { ...get().loading, ...loading } }),
  setError: (error) => set({ error: { ...get().error, ...error } }),
  updatePagination: (pagination) => set({ pagination: { ...get().pagination, ...pagination } }),
}));
```

- `loading`/`error` — объекты по операциям (`list`, `create`, ...), чтобы не блокировать UI целиком.
- В компоненте: `useShallow` для выборки нескольких полей.

## Процесс

```js
export async function getListSalePoints() {
  const { setSalePoints, setLoading, setError, updatePagination } = useSalePointsStore.getState();
  setLoading({ list: true });
  const items = await salePointsAPI.getListSalePoints()
    .then((res) => {
      setSalePoints(res.items);
      updatePagination({ totalItems: res.totalItems, totalPages: res.totalPages });
      setError({ list: false });
      return res.items;
    })
    .catch((err) => { setError({ list: true }); return []; })
    .finally(() => setLoading({ list: false }));
  return items;
}
```

- Мутации завершаются `toast.success(...)` / `toast.error(err?.response?.data?.message || 'Ошибка', { position: 'top-center' })` (sonner).
- Процессы возвращают данные — их можно использовать в обработчиках (закрыть диалог, перейти на страницу).

## Компонент со списком

```jsx
const { salePoints, loading, error } = useSalePointsStore(
  useShallow((s) => ({ salePoints: s.salePoints, loading: s.loading, error: s.error })));

useEffect(() => { getListSalePoints(); }, []);

// рендер
loading.list ? <Loader2 className="animate-spin" />
: error.list ? <p className="text-destructive">Ошибка получения торговых точек</p>
: <AppTable data={salePoints} columns={columns} onClick={handler} isClickable />
```

Колонки — плоский массив:

```js
const columns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Название', cell: ({ row }) => <span>{row.original.name}</span> },
];
```

## Формы

- Схема: zod; числовые поля — `z.preprocess((val) => Number(val), z.number().min(1, '...'))`.
- `useForm({ resolver: zodResolver(schema), defaultValues })`.
- Разметка: shadcn-обёртки `<Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>` + `<FormField control render={...}>` c `FormItem/FormLabel/FormControl/FormMessage`.
- Создание/редактирование — внутри `Dialog`; логика сабмита — в хуке (`useProductForm`) или напрямую вызов process-функции.
- UI-тексты и сообщения валидации — на русском.

## Роутинг

- Новый путь: добавить в `ROUTES` (`src/constants/routes.js`), при необходимости `PAGE_TITLES` и `MENU` (`menu.jsx`).
- Роут в `src/app/router.jsx`: `{ path: ROUTES.X, lazy: () => import('@/modules/...x.page') }`.
- Приватные страницы — внутри ветки `ProtectedRoute`/`DashboardLayout`.

## Стилизация

- Только Tailwind v4 utility-классы; токены темы (`bg-background`, `text-muted-foreground`, `text-destructive` и т.п.).
- Объединение классов — `cn()` (`src/lib/utils.js`), варианты — `cva` (см. `shared/ui/button.jsx`).
- Иконки — `lucide-react`. Тосты — `sonner` (`position: 'top-center'`).

## Прочее

- Константы окружения — только через `ENV` (`src/constants/env.js`), не `import.meta.env` напрямую.
- Денежные значения — в копейках; конвертация через `src/helpers/priceHelpers.js`.
- Импорты — через alias `@/`; порядок контролирует ESLint `simple-import-sort`.
- Язык кода — JavaScript. TypeScript, Redux, react-query не вводить.
