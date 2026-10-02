import { Decimal } from 'decimal.js';

Decimal.set({ rounding: Decimal.ROUND_HALF_UP });

export function roundMoney(amount: string | number | Decimal): string {
  return new Decimal(amount).toDecimalPlaces(0).toString();
}

export function roundQuantity(qty: string | number | Decimal): string {
  return new Decimal(qty).toDecimalPlaces(6).toString();
}

export function multiplyMoney(price: string | number, qty: string | number): string {
  const result = new Decimal(price).times(qty);
  return roundMoney(result);
}
