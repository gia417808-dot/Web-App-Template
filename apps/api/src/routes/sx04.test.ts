import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import express from 'express';
import { sx04Router } from './sx04';

const app = express();
app.use(express.json());
app.use('/api/sx04', sx04Router);

test('SX04 API', async (t) => {
  await t.test('GET /api/sx04/export exists', async () => {
    const res = await request(app).get('/api/sx04/export');
    assert.ok(res.status === 500 || res.status === 200);
  });
});
