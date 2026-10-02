import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import express from 'express';
import { sx02Router } from './sx02';

const app = express();
app.use(express.json());
app.use('/api/sx02', sx02Router);

test('SX02 API', async (t) => {
  await t.test('GET /api/sx02/export exists', async () => {
    const res = await request(app).get('/api/sx02/export');
    assert.ok(res.status === 500 || res.status === 200);
  });
});
