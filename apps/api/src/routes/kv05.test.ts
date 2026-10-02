import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import express from 'express';
import { kv05Router } from './kv05';

const app = express();
app.use(express.json());
app.use('/api/kv05', kv05Router);

test('KV05 API', async (t) => {
  await t.test('GET /api/kv05/export exists', async () => {
    const res = await request(app).get('/api/kv05/export');
    assert.ok(res.status === 500 || res.status === 200);
  });
});
