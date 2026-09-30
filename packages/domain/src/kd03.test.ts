import { test } from 'node:test';
import assert from 'node:assert';
import { calculateTargetProgress } from './kd03';

test('KD03 calculateTargetProgress', () => {
  assert.strictEqual(calculateTargetProgress(500, 1000), 50);
  assert.strictEqual(calculateTargetProgress(1500, 1000), 150);
  assert.strictEqual(calculateTargetProgress(0, 1000), 0);
  assert.strictEqual(calculateTargetProgress(100, 0), 100);
  assert.strictEqual(calculateTargetProgress(0, 0), 0);
  
  assert.throws(() => calculateTargetProgress(-100, 1000), /Confirmed revenue cannot be negative/);
  assert.throws(() => calculateTargetProgress(100, -1000), /Target must be positive/);
});
