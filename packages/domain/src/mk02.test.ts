import { test } from 'node:test';
import * as assert from 'node:assert';
import { calculateRemainingBudget, canLockBudget } from './mk02.js';

test('MK02 calculateRemainingBudget - normal case', () => {
  const result = calculateRemainingBudget('1000000', '350000');
  assert.strictEqual(result.value, '650000');
  assert.strictEqual(result.error, null);
  assert.strictEqual(result.is_over_budget, false);
});

test('MK02 calculateRemainingBudget - boundary_1 over budget', () => {
  const result = calculateRemainingBudget('100', '120');
  assert.strictEqual(result.value, '-20');
  assert.strictEqual(result.error, null);
  assert.strictEqual(result.is_over_budget, true);
});

test('MK02 calculateRemainingBudget - blank_required', () => {
  const result = calculateRemainingBudget(null, '350000');
  assert.strictEqual(result.value, null);
  assert.strictEqual(result.error, 'REQUIRED_FIELD');
  assert.strictEqual(result.is_over_budget, false);
});

test('MK02 canLockBudget guard', () => {
  assert.strictEqual(canLockBudget('ACTIVE'), true);
  assert.strictEqual(canLockBudget('DRAFT'), false);
  assert.strictEqual(canLockBudget('CLOSED'), false);
});
