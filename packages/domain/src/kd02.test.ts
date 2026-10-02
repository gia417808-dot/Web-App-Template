import { test } from 'node:test';
import assert from 'node:assert';
import { calculateExpectedValue } from './kd02';

test('KD02 calculateExpectedValue', () => {
  assert.strictEqual(calculateExpectedValue(1000, 50, 'OPEN'), 500);
  assert.strictEqual(calculateExpectedValue(1000, 50, 'WON'), 1000);
  assert.strictEqual(calculateExpectedValue(1000, 50, 'LOST'), 0);
  assert.strictEqual(calculateExpectedValue(0, 10, 'OPEN'), 0);
  
  assert.throws(() => calculateExpectedValue(-100, 50, 'OPEN'), /Value cannot be negative/);
  assert.throws(() => calculateExpectedValue(100, 150, 'OPEN'), /Probability must be between 0 and 100/);
});
