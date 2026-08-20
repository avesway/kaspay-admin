# Официальная архитектурная конвенция модулей

Сформулировано по реальному коду всех модулей `src/modules` (auth, profile, products/*, priceManagement/*, storages, saleReports, salePoints, devices). Это описание существующего порядка, не новый стандарт.

## Стандартные файлы модуля

### `<name>.page.jsx` — страница-роутер
- Именованный `export const Component = XxxPage` — конвенция `lazy()` react-router.
- Собирает секции/компоненты модуля (`Card` + списки + фильтры).
- Может быть чисто композитным, без своей логики и даже без api/store (`products.page.jsx`, `priceManagement.page.jsx` — только композиция подмодулей).
- Страница подмодуля живёт в его папке (`matrices/matrixTemplate.page.jsx`).

### `<name>.api.js` — HTTP-слой
- Экспорт объекта `<name>API` с `async`-методами.
- Только вызовы `instanceAxios` (`@/config/axios`), возврат `response?.data`.
- Без бизнес-логики, сторов, тостов, сборки сложного state.

### `<name>.store.js` — состояние модуля (zustand)
- `create((set, get) => ...)`, один стор на модуль/подмодуль.
- Типовые поля: данные списков, `loading: { list: ... }` и `error: { list: ... }` (объекты по операциям), `pagination { page, size, totalItems, totalPages }` + `updatePagination`.
- Может существовать без api/processes — чистое клиентское состояние (`profile.store.js` — аккаунт пользователя).

### `<name>.processes.js` — оркестрация
- Единственное место, связывающее api ↔ store ↔ toast.
- Схема: `useXxxStore.getState()` → `setLoading({op:true})` → `xAPI.method().then/.catch/.finally` → сеттеры/`updatePagination`/`setError` → `toast.success/error` (мутации).
- Возвращает данные вызывающему (закрытие диалога, навигация).
- Может обслуживать отдельную задачу без своего стора (`productImages.processes.js`).

## Стандартные папки

| Папка | Назначение | Реальные примеры |
|---|---|---|
| `components/` | UI-компоненты фичи: `export default`, PascalCase-файл, читают стор через `useShallow` | `SalePointsList.jsx`, `StoragesRegisterProduct.jsx`, `PriceListForm.jsx` |
| `components/<subgroup>/` | Группировка родственных компонентов внутри фичи | `devices/components/deviceCommandsForms/` (`GeneralForm.jsx`, `ChangeControllerLatchMode.jsx`) |
| `hooks/` | Переиспользуемая логика форм/поведения, вынесенная из компонентов; как правило вызывает processes | `auth/hooks/useAuth.js`, `productsCatalog/hooks/useProductForm.js`, `useProductImage.js`, `pricesBase/hooks/usePriceBaseProducts.jsx` |
| `helpers/` | Чистые функции/компоненты отображения, привязанные к домену модуля | `devices/helpers/deviceStatusBadge.jsx`, `deviceMatrixBadge.jsx`, `devicePriceListBadge.jsx` |

Отсутствие папки — нормально: модули создают её только когда нужна (`salePoints` без hooks/helpers; `profile` — только стор).

## Shared vs модульный код

**Shared** — код, не зависящий ни от одного домена:
- `src/shared/` — `AppTable`, `Pagination`, `AppSidebar`, `AppHeader`, `AppLoader`, `SvgLogo`, `layouts/`, shadcn-примитивы `ui/*`;
- `src/lib/utils.js` (`cn()`), `src/hooks/use-mobile.js`;
- `src/helpers/priceHelpers.js` — общая конвертация копейки/рубли;
- `src/constants/` — `ENV`, `ROUTES`/`PAGE_TITLES`, `MENU`, images.

**Модульный** — всё, что знает конкретный домен: api/store/processes, компоненты, hooks и helpers фичи (бейджи статуса/матрицы/прайс-листа — в `devices/helpers/`, т.к. отражают доменную семантику).

**Критерий границы**: используется более чем одним модулем и не зависит от домена → `src/shared|helpers|hooks|constants`; иначе — внутри модуля.

## Вложенность модулей

Домены с поддоменами (`products` → `productsCatalog`, `productsBalances`, `productsCoffeeMachine`, `matrices`; `priceManagement` → `pricesBase`, `pricesLists`) устроены так:
- корень модуля: композитная `<name>.page.jsx`;
- каждый подмодуль: полный самодостаточный набор api/store/processes/components(/hooks).

Подмодули одного домена друг про друга не знают; общий код домена (если появится) — уровнем модуля.

---

# Архитектура kaspay-admin

> Всё описанное ниже основано на реальном коде проекта (состояние на 2026-08).

## Обзор

SPA админ-панель на **React 19 + Vite 7**, JavaScript/JSX (без TypeScript), Tailwind CSS v4.
Построена по модульному принципу: каждая фича (модуль) самодостаточна — свои API-слой, стор, «процессы», компоненты и страница.

## Слои и поток данных

```
Component (useEffect / обработчик)
   → process (<name>.processes.js)
        → <name>API (<name>.api.js) → axios instance (src/config/axios.js)
        → zustand store (<name>.store.js) через .getState()
        → toast (sonner)
   → Component читает стор через useShallow-селектор
```

- **API-слой** — только HTTP-вызовы: `src/modules/*/<name>.api.js`, экспорт объекта `<name>API`, методы `async` с `instanceAxios.get/post/...`, возврат `response?.data`.
- **Процессы** — оркестрация: берут сеттеры стора через `useXxxStore.getState()`, ставят `loading`/`error`, вызывают API, обновляют данные и пагинацию, показывают тосты. Возвращают данные вызывающему.
- **Сторы** — `zustand create((set, get) => ...)`, один на модуль/подмодуль. Типовые поля: данные списков, `loading: { list: true, ... }`, `error: { list: false, ... }`, `pagination { page, size, totalItems, totalPages }` + `updatePagination`.
- **React-query / Redux не используются.**

## HTTP и авторизация

`src/config/axios.js` — единственный axios-экземпляр, `baseURL = ENV.SERVER_URL + ENV.VERSION_API`.
Request-интерцептор добавляет заголовок `X-BID-Token` (токен из `localStorage[ENV.AUTH_TOKENS]`, валидация через `validateAuthToken()` из auth.processes). Нет токена → очистка localStorage и редирект на `#/auth/login`. Экспортируется также `writeTokenRequest(token)`.

Логин: `modules/auth` → `authAPI.login` → токен в localStorage → `navigate(ROUTES.HOME)`.

## Роутинг и guard'ы

`src/app/router.jsx` — `createHashRouter`, обёрнут в `Providers` (SidebarProvider + `<Toaster richColors/>`).

- Ветка `AuthLayout` → `ROUTES.LOGIN` (`/auth/login`).
- Ветка `loader: protectedLoader` + `<ProtectedRoute/>` → `DashboardLayout` → ленивые страницы (`lazy: () => import('@/modules/.../*.page')`).
  - `protectedLoader`: валидирует токен, пишет токен в заголовок, грузит аккаунт в `useProfileStore`.
  - `ProtectedRoute`: нет аккаунта → `<Navigate to={ROUTES.LOGIN}/>`, иначе `<Outlet/>`.
- Страницы экспортируют `export const Component = XxxPage` (конвенция react-router lazy).

Пути: `/`, `/products` (+ `matrix-templates/:id`), `/storages`, `/price-management`, `/sale-reports`, `/sale-points` (+ `:id`, `:id/device/:deviceId/:slaveDeviceId`).

Константы путей: `src/constants/routes.js` (`ROUTES`, `PAGE_TITLES`); меню сайдбара — `src/constants/menu.jsx` (`MENU`).

## Shared-слой

- `src/shared/layouts/` — `DashboardLayout` (Sidebar + Header + Outlet), `AuthLayout` (центрированный Outlet).
- `src/shared/AppTable.jsx` — обёртка над `@tanstack/react-table`, `manualPagination`, `isClickable`, колоночные дефиниции — плоские массивы (`accessorKey`/`header`/`cell`).
- `src/shared/Pagination.jsx` — размер страницы 5/10/50/100 + нумерованные кнопки; состояние `page/size` живёт в сторе модуля (серверная пагинация).
- `src/shared/ui/*` — shadcn/radix примитивы (button, dialog, form, table, sonner и др.), `cva`-варианты, `cn()` из `src/lib/utils.js`.
- `src/helpers/priceHelpers.js` — `priceRoundedKopecks` / `priceRoundedRubles` (×100 / ÷100).
- `src/hooks/use-mobile.js` — `useIsMobile()`.

## Модули (src/modules)

| Модуль | Назначение |
|---|---|
| `auth` | логин/логаут, `AuthForm`, `useAuth` |
| `profile` | `profile.store.js` — аккаунт текущего пользователя |
| `products` | каталог (`productsCatalog`), балансы (`productsBalances`), кофемашины (`productsCoffeeMachine`), матрицы (`matrices`, dnd-kit сетка) |
| `priceManagement` | базовые цены (`pricesBase`), прайс-листы (`pricesLists`) |
| `storages` | склады, регистрация/перемещение товаров, операции с балансом |
| `saleReports` | статистика/отчёты по продажам, фильтры |
| `salePoints` | список точек, детали точки, операции, устройства точки |
| `devices` | карточка устройства: инфо, события, команды (`deviceCommandsForms/`), операции, подключение прайс-листа |

## Сборка и окружение

- Vite, alias `@` → `./src`. Режимы: `dev` = `--mode test`; `.env.<mode>` → `ENV` (`src/constants/env.js`, префикс `VITE_`).
- `deployTest` / `deployProd` — build + `scp ./dist/*` на сервер.
- ESLint 9 flat config + `simple-import-sort`; Prettier + `prettier-plugin-tailwindcss`.
