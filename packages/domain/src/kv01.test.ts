import test from 'node:test';
import assert from 'node:assert';
import { validateStockLimits } from './kv01';

test('validateStockLimits', () => {
  assert.ok(validateStockLimits(10, 20));
  assert.throws(() => validateStockLimits(20, 10), /Max qty must be >= min qty/);
});