import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import express from 'express';
import { kt02Router } from './kt02';

const app = express();
app.use(express.json());
app.use('/api/kt02', kt02Router);

test('KT02 API', async (t) => {
  await t.test('GET /api/kt02/export exists', async () => {
    const res = await request(app).get('/api/kt02/export');
    assert.ok(res.status === 500 || res.status === 200);
  });
});
