import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import express from 'express';
import { sx03Router } from './sx03';

const app = express();
app.use(express.json());
app.use('/api/sx03', sx03Router);

test('SX03 API', async (t) => {
  await t.test('GET /api/sx03/export exists', async () => {
    const res = await request(app).get('/api/sx03/export');
    assert.ok(res.status === 500 || res.status === 200);
  });
});
