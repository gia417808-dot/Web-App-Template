import test from 'node:test';
import assert from 'node:assert';
import { getTenantId } from './index';

test('getTenantId', () => {
  assert.strictEqual(getTenantId({ headers: { 'x-tenant-id': '123' } }), '123');
});