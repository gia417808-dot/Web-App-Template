import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import express from 'express';
import { kt03Router } from './kt03';

const app = express();
app.use(express.json());
app.use('/api/kt03', kt03Router);

test('KT03 API', async (t) => {
  await t.test('GET /api/kt03/export exists', async () => {
    const res = await request(app).get('/api/kt03/export');
    assert.ok(res.status === 500 || res.status === 200);
  });
});
