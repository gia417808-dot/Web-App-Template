import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import express from 'express';
import { kt05Router } from './kt05';

const app = express();
app.use(express.json());
app.use('/api/kt05', kt05Router);

test('KT05 API', async (t) => {
  await t.test('GET /api/kt05/export exists', async () => {
    const res = await request(app).get('/api/kt05/export');
    assert.ok(res.status === 500 || res.status === 200);
  });
});
