import test from 'node:test';
import assert from 'node:assert';
import { getTenantId, generateAuditLog } from './index';

test('getTenantId extracts from headers', () => {
  const req = { headers: { 'x-tenant-id': 'tenant-123' } };
  assert.strictEqual(getTenantId(req), 'tenant-123');
});

test('getTenantId returns null if missing', () => {
  const req = { headers: {} };
  assert.strictEqual(getTenantId(req), null);
});

test('generateAuditLog generates valid log', () => {
  const log = generateAuditLog('CREATE', 'entity-1', { foo: 'bar' });
  assert.strictEqual(log.action, 'CREATE');
  assert.strictEqual(log.entityId, 'entity-1');
  assert.deepStrictEqual(log.diff, { foo: 'bar' });
  assert.ok(log.id);
  assert.ok(log.timestamp);
});
