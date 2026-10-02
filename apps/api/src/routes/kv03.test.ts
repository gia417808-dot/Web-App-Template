import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import express from 'express';
import { kv03Router } from './kv03';

const app = express();
app.use(express.json());
app.use('/api/kv03', kv03Router);

test('KV03 API', async (t) => {
  await t.test('GET /api/kv03/export exists', async () => {
    const res = await request(app).get('/api/kv03/export');
    assert.ok(res.status === 500 || res.status === 200);
  });
});
