import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import express from 'express';
import { sx01Router } from './sx01';

const app = express();
app.use(express.json());
app.use('/api/sx01', sx01Router);

test('SX01 API', async (t) => {
  await t.test('GET /api/sx01/export exists', async () => {
    const res = await request(app).get('/api/sx01/export');
    assert.ok(res.status === 500 || res.status === 200);
  });
});
