import test from 'node:test';
import assert from 'node:assert';
import { roundMoney, roundQuantity, multiplyMoney } from './decimal';

test('Decimal rounding HALF_UP for money', () => {
  assert.strictEqual(roundMoney('100.5'), '101');
  assert.strictEqual(roundMoney('100.4'), '100');
  assert.strictEqual(roundMoney('100.500'), '101');
  assert.strictEqual(roundMoney('-100.5'), '-101');
});

test('Decimal for quantity', () => {
  assert.strictEqual(roundQuantity('10.1234567'), '10.123457');
  assert.strictEqual(roundQuantity('10'), '10');
});

test('Decimal multiplication', () => {
  assert.strictEqual(multiplyMoney('10.5', '2'), '21');
  assert.strictEqual(multiplyMoney('3.333333', '3'), '10'); // 9.999999 -> 10
});
