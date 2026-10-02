import { test } from 'node:test';
import assert from 'node:assert';
import { validateTransactionAmount, isPeriodLocked } from './kt01';

test('KT01 validateTransactionAmount', () => {
  assert.throws(() => validateTransactionAmount(0), /must be strictly positive/);
  assert.throws(() => validateTransactionAmount(-100), /must be strictly positive/);
  assert.doesNotThrow(() => validateTransactionAmount(100));
});

test('KT01 isPeriodLocked', () => {
  const periods = [
    { start_date: '2026-01-01', end_date: '2026-01-31' },
    { start_date: '2026-03-01', end_date: '2026-03-31' },
  ];

  assert.strictEqual(isPeriodLocked('2026-01-15', periods), true);
  assert.strictEqual(isPeriodLocked('2026-02-15', periods), false);
  assert.strictEqual(isPeriodLocked('2026-03-01', periods), true);
  assert.strictEqual(isPeriodLocked('2026-04-01', periods), false);
});
