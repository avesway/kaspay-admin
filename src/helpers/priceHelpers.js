export function priceRoundedKopecks(price) {
  return Math.round(price * 100);
}

export function priceRoundedRubles(price) {
  return price / 100;
}
