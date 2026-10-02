import { roundMoney } from './decimal';

export function calculateLineTotal(qty: number | string, unitPrice: number | string, discountPct: number | string): number {
  const q = Number(qty);
  const p = Number(unitPrice);
  const d = Number(discountPct);

  if (isNaN(q) || isNaN(p) || isNaN(d)) throw new Error('Invalid number');
  if (q <= 0) throw new Error('Quantity must be > 0');
  if (p < 0) throw new Error('Unit price must be >= 0');
  if (d < 0 || d > 100) throw new Error('Discount must be between 0 and 100');

  const total = q * p * (1 - d / 100);
  return Number(roundMoney(total));
}

export function calculateTotal(lines: { line_total_vnd: number }[]): number {
  return lines.reduce((sum, line) => sum + line.line_total_vnd, 0);
}
