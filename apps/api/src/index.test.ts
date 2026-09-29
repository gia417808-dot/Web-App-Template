import test from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from './index';

test('GET /health returns ok', async () => {
  const response = await request(app).get('/health');
  assert.strictEqual(response.status, 200);
  assert.deepStrictEqual(response.body, { status: 'ok' });
});

test('GET /ready returns ready', async () => {
  const response = await request(app).get('/ready');
  assert.strictEqual(response.status, 200);
  assert.deepStrictEqual(response.body, { status: 'ready' });
});
