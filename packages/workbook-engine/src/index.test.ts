import test from 'node:test';
import assert from 'node:assert';
import { generateWorkbook } from './index';

test('generateWorkbook', () => {
  assert.strictEqual(generateWorkbook(), 'workbook');
});