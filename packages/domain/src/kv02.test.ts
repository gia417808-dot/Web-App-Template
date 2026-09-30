import { test } from 'node:test';
import assert from 'node:assert';
import { calculateQuantityDelta, validateStockLevel } from './kv02';

test('KV02 calculateQuantityDelta', () => {
  assert.strictEqual(calculateQuantityDelta('in', 10), 10);
  assert.strictEqual(calculateQuantityDelta('out', 10), -10);
  assert.throws(() => calculateQuantityDelta('out', 0), /strictly positive/);
  assert.throws(() => calculateQuantityDelta('unknown', 10), /Invalid movement type/);
});

test('KV02 validateStockLevel', () => {
  assert.doesNotThrow(() => validateStockLevel(10, -5));
  assert.doesNotThrow(() => validateStockLevel(10, 0));
  assert.throws(() => validateStockLevel(10, -15), /Stock cannot be negative/);
});
