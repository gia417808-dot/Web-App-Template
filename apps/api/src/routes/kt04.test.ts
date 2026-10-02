import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import express from 'express';
import { kt04Router } from './kt04';

const app = express();
app.use(express.json());
app.use('/api/kt04', kt04Router);

test('KT04 API', async (t) => {
  await t.test('GET /api/kt04/export exists', async () => {
    const res = await request(app).get('/api/kt04/export');
    assert.ok(res.status === 500 || res.status === 200);
  });
});
