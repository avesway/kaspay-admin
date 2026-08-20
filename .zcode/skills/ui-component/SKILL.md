---
name: ui-component
description: Создание UI-компонента в kaspay-admin — списки на AppTable, формы на react-hook-form + zod, диалоги, фильтры по существующим shadcn/Tailwind паттернам.
---

# UI component (kaspay-admin)

## Базовые правила
- Стиль: Tailwind v4 utility + токены темы (`bg-background`, `text-muted-foreground`, `text-destructive`), объединение через `cn()`.
- Примитивы — только из `src/shared/ui/*` (shadcn/radix), иконки — `lucide-react`, тосты — `sonner` (`position: 'top-center'`).
- Файл `PascalCase.jsx`, `export default`. UI-текст — русский.

## Список (референс: `SalePointsList.jsx`)
```jsx
const columns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Название', cell: ({ row }) => <span>{row.original.name}</span> },
];

const { items, loading, error } = useXStore(useShallow((s) => ({ ... })));
useEffect(() => { getListX(); }, []);

<Card>
  <CardContent>
    {loading.list ? <Loader2 className="animate-spin" />
      : error.list ? <p className="text-destructive">Ошибка ...</p>
      : <AppTable data={items} columns={columns} onClick={handler} isClickable />}
  </CardContent>
</Card>
<Pagination ... /> {/* page/size из стора, серверная пагинация */}
```

## Форма (референс: `ProductForm.jsx`)
- zod-схема рядом; числа: `z.preprocess((v) => Number(v), z.number().min(1, '...'))`.
```jsx
const form = useForm({ resolver: zodResolver(schema), defaultValues });
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField control={form.control} name="name" render={({ field }) => (
      <FormItem>
        <FormLabel>Название</FormLabel>
        <FormControl><Input {...field} /></FormControl>
        <FormMessage />
      </FormItem>
    )} />
  </form>
</Form>
```
- `Select` — через `FormControl><Select>...`; сабмит — вызов process-функции, тосты показывает она.
- Логику формы выносить в хук (`hooks/useXForm.js`), если компонент разрастается.

## Диалог создания/редактирования (референс: `ProductCreate.jsx`)
`Dialog` + триггер-кнопка; внутри — форма; закрытие после успешного ответа process (по её результату/флагу стора).

## Фильтры (референс: `SalePointsOperationsFilter.jsx`)
Контролируемые Select/Calendar, значения → параметры запроса в сторе/process, сброс — отдельной кнопкой.

## Не создавать
- Свои CSS-модули/styled-components, дубликаты примитивов из `shared/ui`, глобальный CSS (только `src/app/index.css`).
