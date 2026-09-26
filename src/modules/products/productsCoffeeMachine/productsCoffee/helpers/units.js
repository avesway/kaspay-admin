export const COMPOSITION_UNITS = [
  { value: 'pcs', label: 'Штука', short: 'шт' },
  { value: 'gram', label: 'Грамм', short: 'г' },
  { value: 'millilitre', label: 'Миллилитр', short: 'мл' },
];

export function getUnitShort(unitName) {
  return COMPOSITION_UNITS.find((unit) => unit.value === unitName)?.short || '';
}

export function getProductUnitType(product) {
  const unitType = product?.unitType;
  if (!unitType) return '';
  if (typeof unitType === 'string') return unitType;
  return unitType.name || '';
}
