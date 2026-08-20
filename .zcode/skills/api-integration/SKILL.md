---
name: api-integration
description: Подключение нового backend-эндпоинта в kaspay-admin — метод в api-модуль, process-функция, поля в zustand-стор и использование в компоненте.
---

# API integration (kaspay-admin)

## Шаги

1. **Референс**: открыть `src/modules/salePoints/salePoints.api.js` и `salePoints.processes.js` — копировать стиль.
2. **`.api.js`** — добавить метод в объект `<name>API`:
   ```js
   getListX: async (params) => {
     const response = await instanceAxios.get(`resource${params ?? ''}`);
     return response?.data;
   },
   ```
   Никаких `baseURL` — он в `src/config/axios.js` (там же токен `X-BID-Token`).
3. **`.processes.js`** — новая функция по шаблону:
   ```js
   export async function getListX() {
     const { setX, setLoading, setError } = useXStore.getState();
     setLoading({ list: true });
     return await xAPI.getListX(params)
       .then((res) => { setX(res.items); setError({ list: false }); return res.items; })
       .catch(() => { setError({ list: true }); return []; })
       .finally(() => setLoading({ list: false }));
   }
   ```
   Мутации: `toast.success('...')` / `toast.error(err?.response?.data?.message || 'Ошибка', { position: 'top-center' })`.
4. **`.store.js`** — при новом списке добавить данные + ключи в `loading`/`error`, при пагинации — `updatePagination({ totalItems, totalPages })` из ответа.
5. **Компонент** — `useEffect(() => process(), [...])`, чтение через `useShallow`; query-параметры фильтров/пагинации собираются в process или компоненте и уходят в `params`.
6. **Сверить имена полей** ответа (`items`, `totalItems`, `totalPages`) с реальным бэкендом — не предполагать.

## Запрещено
- Вызовы axios из компонентов, `fetch`, свой экземпляр axios, `import.meta.env` вместо `ENV`.
