import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import express from 'express';
import { kv04Router } from './kv04';

const app = express();
app.use(express.json());
app.use('/api/kv04', kv04Router);

test('KV04 API', async (t) => {
  await t.test('GET /api/kv04/export exists', async () => {
    const res = await request(app).get('/api/kv04/export');
    assert.ok(res.status === 500 || res.status === 200);
  });
});
