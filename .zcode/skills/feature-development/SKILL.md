---
name: feature-development
description: Разработка новой фичи в kaspay-admin — новый модуль/подмодуль, страница, стор, API, роут и пункт меню по существующим паттернам проекта.
---

# Feature development (kaspay-admin)

Следуй структуре модуля и потоку данных проекта. Не выдумывать свои паттерны.

## Шаги

1. **Найти референс**: прочитать ближайший по смыслу модуль (напр. `src/modules/salePoints/` или `src/modules/storages/`) и повторять его устройство.
2. **Создать файлы модуля** в `src/modules/<feature>/`:
   - `<name>.api.js` — объект `<name>API`, только axios-вызовы через `instanceAxios` из `@/config/axios`, возврат `response?.data`.
   - `<name>.store.js` — zustand `create((set, get) => ...)`: данные, `loading: {...}`, `error: {...}`, `pagination` + `updatePagination` (если есть списки).
   - `<name>.processes.js` — функции: `getState()` стора → `setLoading` → API `.then/.catch/.finally` → сеттеры + `toast` (sonner, `position: 'top-center'`, русский).
   - `components/` — компоненты с `export default`.
   - `<name>.page.jsx` — `export const Component = XxxPage`.
3. **Роут**: добавить путь в `ROUTES` (`src/constants/routes.js`), роут в `src/app/router.jsx` внутри `DashboardLayout`-ветки (`lazy: () => import(...)`), пункт в `MENU` (`src/constants/menu.jsx`) при необходимости.
4. **Список**: колонки — плоский массив, рендер через `AppTable` + `Pagination`, данные — `useShallow`-селектор стора, загрузка в `useEffect`.
5. **Формы** (если нужны): zod-схема (`z.preprocess(Number, ...)` для чисел), `useForm + zodResolver`, shadcn `Form/FormField/...`, создание/редактирование в `Dialog`.
6. **Проверить**: `npx eslint src` чисто, `npm run dev` запускается.

## Запрещено
- TypeScript, Redux, react-query, новые UI-библиотеки.
- Хардкод путей/URL — только `ROUTES`, `ENV`.
- Логику в `.api.js` (только HTTP) и JSX-логику в processes.
