export const AVAILABLE_RESOURCES = [
  'Кофе зерновой',
  'Молоко',
  'Сливки',
  'Стакан',
  'Крышка',
  'Размешиватель',
  'Салфетка',
  'Сахар',
  'Ванильный сахар',
  'Какао-порошок',
  'Чай',
  'Специи',
  'Красное вино',
];

export const SNACK_PRODUCTS = ['Кола 0.5л', 'Спрайт 0.5л', 'Фанта 0.5л', 'Снекерс', 'Твикс', 'Вода 0.5л'];

export const COFFEE_PRODUCTS = [
  'Американо',
  'Капучино с молоком',
  'Латте',
  'Эспрессо',
  'Глинтвейн',
  'Какао',
  'Чай черный',
  'Чай зеленый',
  'Макиато',
  'Раф кофе',
];

export const TEMPLATE_TYPES = [
  { value: 'coffee', label: 'Кофейный автомат' },
  { value: 'fridge', label: 'Холодильник / снековый' },
];

export const PRODUCT_TYPES = ['Товар', 'Услуга'];

export const PRODUCT_INGREDIENTS = {
  Американо: [
    { name: 'Кофе зерновой', unit: 'г', amount: '0' },
    { name: 'Стакан', unit: 'шт', amount: '0' },
    { name: 'Крышка', unit: 'шт', amount: '0' },
    { name: 'Размешиватель', unit: 'шт', amount: '0' },
    { name: 'Салфетка', unit: 'шт', amount: '0' },
  ],
  'Капучино с молоком': [
    { name: 'Кофе зерновой', unit: 'г', amount: '0' },
    { name: 'Молоко', unit: 'мл', amount: '0' },
    { name: 'Стакан', unit: 'шт', amount: '0' },
    { name: 'Крышка', unit: 'шт', amount: '0' },
    { name: 'Размешиватель', unit: 'шт', amount: '0' },
    { name: 'Салфетка', unit: 'шт', amount: '0' },
  ],
  Латте: [
    { name: 'Кофе зерновой', unit: 'г', amount: '0' },
    { name: 'Молоко', unit: 'мл', amount: '0' },
    { name: 'Стакан', unit: 'шт', amount: '0' },
    { name: 'Крышка', unit: 'шт', amount: '0' },
    { name: 'Размешиватель', unit: 'шт', amount: '0' },
    { name: 'Салфетка', unit: 'шт', amount: '0' },
  ],
  Эспрессо: [
    { name: 'Кофе зерновой', unit: 'г', amount: '0' },
    { name: 'Стакан', unit: 'шт', amount: '0' },
    { name: 'Крышка', unit: 'шт', amount: '0' },
    { name: 'Размешиватель', unit: 'шт', amount: '0' },
    { name: 'Салфетка', unit: 'шт', amount: '0' },
  ],
  Глинтвейн: [
    { name: 'Красное вино', unit: 'мл', amount: '0' },
    { name: 'Специи', unit: 'г', amount: '0' },
    { name: 'Стакан', unit: 'шт', amount: '0' },
    { name: 'Крышка', unit: 'шт', amount: '0' },
    { name: 'Размешиватель', unit: 'шт', amount: '0' },
    { name: 'Салфетка', unit: 'шт', amount: '0' },
  ],
  Какао: [
    { name: 'Какао-порошок', unit: 'г', amount: '0' },
    { name: 'Молоко', unit: 'мл', amount: '0' },
    { name: 'Сахар', unit: 'г', amount: '0' },
    { name: 'Стакан', unit: 'шт', amount: '0' },
    { name: 'Крышка', unit: 'шт', amount: '0' },
    { name: 'Размешиватель', unit: 'шт', amount: '0' },
    { name: 'Салфетка', unit: 'шт', amount: '0' },
  ],
  'Чай черный': [
    { name: 'Чай', unit: 'г', amount: '0' },
    { name: 'Сахар', unit: 'г', amount: '0' },
    { name: 'Стакан', unit: 'шт', amount: '0' },
    { name: 'Крышка', unit: 'шт', amount: '0' },
    { name: 'Размешиватель', unit: 'шт', amount: '0' },
    { name: 'Салфетка', unit: 'шт', amount: '0' },
  ],
  'Чай зеленый': [
    { name: 'Чай', unit: 'г', amount: '0' },
    { name: 'Сахар', unit: 'г', amount: '0' },
    { name: 'Стакан', unit: 'шт', amount: '0' },
    { name: 'Крышка', unit: 'шт', amount: '0' },
    { name: 'Размешиватель', unit: 'шт', amount: '0' },
    { name: 'Салфетка', unit: 'шт', amount: '0' },
  ],
  Макиато: [
    { name: 'Кофе зерновой', unit: 'г', amount: '0' },
    { name: 'Молоко', unit: 'мл', amount: '0' },
    { name: 'Стакан', unit: 'шт', amount: '0' },
    { name: 'Крышка', unit: 'шт', amount: '0' },
    { name: 'Размешиватель', unit: 'шт', amount: '0' },
    { name: 'Салфетка', unit: 'шт', amount: '0' },
  ],
  'Раф кофе': [
    { name: 'Кофе зерновой', unit: 'г', amount: '0' },
    { name: 'Сливки', unit: 'мл', amount: '0' },
    { name: 'Ванильный сахар', unit: 'г', amount: '0' },
    { name: 'Стакан', unit: 'шт', amount: '0' },
    { name: 'Крышка', unit: 'шт', amount: '0' },
    { name: 'Размешиватель', unit: 'шт', amount: '0' },
    { name: 'Салфетка', unit: 'шт', amount: '0' },
  ],
};
