export const WEEKDAY_SHORT = {
  monday: 'Пн',
  tuesday: 'Вт',
  wednesday: 'Ср',
  thursday: 'Чт',
  friday: 'Пт',
  saturday: 'Сб',
  sunday: 'Вс',
};

export function shortWeekday(weekday) {
  return WEEKDAY_SHORT[weekday?.name] || weekday?.description || '';
}

// Цвета столбцов: будни — красный, выходные — индиго (как на макете)
export const WEEKDAY_BAR_COLORS = {
  workday: '#ef4444',
  weekend: '#818cf8',
};

// Шкала тепловой карты: intensity 1..5 → фон ячейки
export const HEATMAP_INTENSITY_CLASSES = {
  1: 'bg-red-100 text-muted-foreground',
  2: 'bg-red-200 text-muted-foreground',
  3: 'bg-red-300 text-red-900',
  4: 'bg-red-400 text-white',
  5: 'bg-red-500 text-white',
};
