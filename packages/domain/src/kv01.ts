export function validateStockLimits(minQty: number | string, maxQty: number | string) {
  const min = Number(minQty);
  const max = Number(maxQty);
  if (isNaN(min) || isNaN(max)) throw new Error('Invalid number');
  if (min > max) throw new Error('Max qty must be >= min qty');
  return true;
}