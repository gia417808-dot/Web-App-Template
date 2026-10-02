import test from 'node:test';
import assert from 'node:assert';
import { calculateLineTotal, calculateTotal } from './kd01';

test('KD01 calculateLineTotal', () => {
  assert.strictEqual(calculateLineTotal(2, 100000, 0), 200000);
  assert.strictEqual(calculateLineTotal(2, 100000, 10), 180000);
  assert.strictEqual(calculateLineTotal(1, 12345.6, 0), 12346); // Round half up
  assert.throws(() => calculateLineTotal(0, 10, 0), /Quantity must be > 0/);
  assert.throws(() => calculateLineTotal(1, -10, 0), /Unit price must be >= 0/);
  assert.throws(() => calculateLineTotal(1, 10, 110), /Discount must be between 0 and 100/);
});

test('KD01 calculateTotal', () => {
  assert.strictEqual(calculateTotal([{ line_total_vnd: 100 }, { line_total_vnd: 200 }]), 300);
});
