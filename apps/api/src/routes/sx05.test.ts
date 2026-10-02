import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import express from 'express';
import { sx05Router } from './sx05';

const app = express();
app.use(express.json());
app.use('/api/sx05', sx05Router);

test('SX05 API', async (t) => {
  await t.test('GET /api/sx05/export exists', async () => {
    const res = await request(app).get('/api/sx05/export');
    assert.ok(res.status === 500 || res.status === 200);
  });
});
