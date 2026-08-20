# AGENTS.md — kaspay-admin

Админ-панель KasPay. React 19 + Vite 7, **JavaScript (JSX), без TypeScript**.

## Стек
- React 19, react-router 7 (`createHashRouter`, loaders, `lazy`)
- Состояние: **zustand** (по стору на модуль), без Redux/react-query
- API: **axios** (`src/config/axios.js`, токен `X-BID-Token` из localStorage)
- Формы: **react-hook-form + zod** (`zodResolver`), shadcn-обёртки `Form/FormField/...`
- Таблицы: **@tanstack/react-table** через `src/shared/AppTable.jsx` + `src/shared/Pagination.jsx`
- UI: shadcn/radix примитивы в `src/shared/ui/*`, Tailwind v4 (utility-классы, токены `text-muted-foreground` и т.п.), иконки `lucide-react`, тосты `sonner`
- Прочее: `@dnd-kit` (drag-n-drop), `date-fns` + `react-day-picker`

## Структура
```
src/
  app/         router.jsx, providers, ProtectedRoute
  config/      axios.js
  constants/   env.js (ENV), routes.js (ROUTES, PAGE_TITLES), menu.jsx (MENU)
  helpers/     priceHelpers.js (копейки ↔ рубли)
  lib/utils.js cn()
  shared/      AppTable, Pagination, AppSidebar, AppHeader, layouts/, ui/
  modules/
    auth/  profile/  products/ (productsCatalog, productsBalances, productsCoffeeMachine, matrices)
    priceManagement/ (pricesBase, pricesLists)  storages/  saleReports/
    salePoints/  devices/
```

## Официальная архитектурная конвенция модулей

### Стандартные файлы модуля
| Файл | Назначение |
|---|---|
| `<name>.page.jsx` | Entry-страница для роутера: именованный `export const Component = XxxPage`. Собирает секции/компоненты модуля. Может быть чисто композитным без своей логики (напр. `products.page.jsx`, `priceManagement.page.jsx`) |
| `<name>.api.js` | Только HTTP: объект `<name>API` с `async`-методами над `instanceAxios`, возврат `response?.data`. Без логики, сторов и тостов |
| `<name>.store.js` | zustand-стор модуля: данные списков, `loading: {...}` / `error: {...}` по операциям, `pagination` + `updatePagination`. Может существовать сам по себе (напр. `profile.store.js` — только аккаунт, без api/processes) |
| `<name>.processes.js` | Оркестрация: `useXxxStore.getState()` → `setLoading` → API `.then/.catch/.finally` → сеттеры стора → `toast` (sonner). Возвращает данные вызывающему. Может не иметь своего стора (`productImages.processes.js`) |

### Стандартные папки
| Папка | Назначение | Примеры |
|---|---|---|
| `components/` | UI-компоненты фичи, `export default`, PascalCase-файлы | `SalePointsList.jsx`, `ProductForm.jsx` |
| `components/<subgroup>/` | Группировка родственных компонентов внутри фичи | `deviceCommandsForms/` |
| `hooks/` | Логика форм/поведения, вынесенная из компонентов | `useAuth.js`, `useProductForm.js`, `usePriceBaseProducts.jsx` |
| `helpers/` | Чистые утилиты отображения домена | `devices/helpers/deviceStatusBadge.jsx` и др. |

### Shared vs модульный код
- **Shared** (`src/shared/`, `src/lib/`, `src/hooks/`, `src/helpers/`, `src/constants/`): код, не знающий ни один домен — `AppTable`, `Pagination`, layouts, сайдбар/хедер, `cn()`, `useIsMobile()`, `priceHelpers.js` (общая конвертация копеек/рублей), `ENV`/`ROUTES`/`MENU`, shadcn-примитивы `shared/ui/*`.
- **Модульный** (`src/modules/<feature>/...`): всё, что знает домен — API-вызовы, сторы, процессы, компоненты, хуки и хелперы фичи (бейджи статусов устройства — модульные, т.к. привязаны к домену devices).
- Критерий: используется ≥1 модулем и не зависит от домена → shared; иначе — внутрь модуля.

### Вложенность
Домены с поддоменами (`products`, `priceManagement`) держат композитную страницу в корне модуля, а полный набор api/store/processes/components — в подпапках поддоменов (`productsCatalog`, `pricesLists`, ...). У подмодуля может быть свой `*.page.jsx` (`matrixTemplate.page.jsx`).

## Прочие конвенции
2. **Страницы**: `*.page.jsx` с `export const Component = XxxPage` для `lazy()`. Роуты и меню — через константы `ROUTES`/`MENU`, не хардкод путей.
3. **Данные в компоненте**: `useShallow`-селектор стора + `useEffect(() => process(), [])`; рендер: `loading.list ? spinner : error.list ? текст text-destructive : <AppTable/>`.
4. **Тосты**: `toast.success/toast.error(msg, { position: 'top-center' })` (sonner), сообщения на русском.
5. **Формы**: zod-схема (числа через `z.preprocess(Number, ...)`), `useForm({resolver: zodResolver})`, shadcn Form-обёртки; создание/редактирование — в `Dialog`.
6. **Именование**: компоненты PascalCase (`SalePointsList.jsx`), модульные файлы с точечными суффиксами (`salePoints.api.js`), дефолтный экспорт для компонентов, `ENV`/`ROUTES` — только из `src/constants`.
7. **Деньги**: хранить/передавать в копейках — `priceHelpers.js`.

## Скрипты
- `npm run dev` — vite в mode=test; `npm run build`; `deployTest`/`deployProd` — build + scp на сервер.
- Линт: ESLint 9 flat config (`eslint.config.js`), сортировка импортов `simple-import-sort`; Prettier c `prettier-plugin-tailwindcss`.

## Skills для типовых задач
См. `.zcode/skills/`: `feature-development`, `bugfix`, `code-review`, `api-integration`, `ui-component`.

## Важно
- Ничего не менять в работающей логике без явной задачи; язык UI и сообщений — русский.
- Не вводить TypeScript, Redux, react-query — следовать существующим паттернам.
