---
name: code-review
description: Ревью кода в kaspay-admin — проверка соответствия модульной архитектуре (api/store/processes/components) и конвенциям проекта.
---

# Code review (kaspay-admin)

## Чек-лист

### Архитектура модуля
- [ ] HTTP только в `<name>.api.js`, объект `<name>API`, без логики.
- [ ] Мутации и загрузка — в `<name>.processes.js`: `getState()` → `setLoading` → `.then/.catch/.finally` → сеттеры + toast.
- [ ] Стор не вызывает API; компоненты не вызывают axios напрямую.
- [ ] `loading`/`error` — объекты по операциям, сбрасываются в `.finally` / success-ветке.

### Компоненты
- [ ] `export default`, PascalCase-файл; данные — `useShallow`-селектор стора.
- [ ] Список: `AppTable` + `Pagination`, паттерн `loading ? spinner : error ? text-destructive : table`.
- [ ] Числа в формах — `z.preprocess(Number, ...)`; сабмит через `form.handleSubmit`.

### Конвенции
- [ ] Пути через `ROUTES`, окружение через `ENV`, классы через `cn()`, деньги в копейках (`priceHelpers`).
- [ ] Русский текст UI/тостов; toast `{ position: 'top-center' }` (sonner).
- [ ] Импорты через `@/`, сортировка — ESLint simple-import-sort.
- [ ] Нет TypeScript/Redux/react-query, новых зависимостей без необходимости.

### Риски
- [ ] Попутные рефакторинги/изменения поведения вне scope задачи.
- [ ] Обработчик `.catch` без `toast.error` в мутациях; отсутствие `.finally` (вечный loading).
- [ ] Забытый `updatePagination` при серверной пагинации.

## Формат ответа
По пунктам: 🔴 блокирует / 🟡 стоит поправить / 🟢 ок — с путями `файл:строка`.
