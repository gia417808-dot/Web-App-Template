import { test } from 'node:test';
import assert from 'node:assert';
import { calculateContractStatus } from './kd04';

test('KD04 calculateContractStatus', () => {
  const today = new Date('2026-09-30');
  
  // 10 days remaining
  const res1 = calculateContractStatus('2026-10-10', 'ACTIVE', today);
  assert.strictEqual(res1.days_remaining, 10);
  assert.strictEqual(res1.should_remind, true);
  
  // 40 days remaining
  const res2 = calculateContractStatus('2026-11-09', 'ACTIVE', today);
  assert.strictEqual(res2.days_remaining, 40);
  assert.strictEqual(res2.should_remind, false);
  
  // Past expiry
  const res3 = calculateContractStatus('2026-09-01', 'ACTIVE', today);
  assert.strictEqual(res3.days_remaining, -29);
  assert.strictEqual(res3.should_remind, true); // Still reminds if active but expired
  
  // Terminated
  const res4 = calculateContractStatus('2026-10-10', 'TERMINATED', today);
  assert.strictEqual(res4.days_remaining, 0);
  assert.strictEqual(res4.should_remind, false);
});
