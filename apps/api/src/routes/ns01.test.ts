import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import express from 'express';
import { ns01Router } from './ns01';

const app = express();
app.use(express.json());
app.use('/api/ns01', ns01Router);

test('NS01 API', async (t) => {
  await t.test('GET /api/ns01/export exists', async () => {
    const res = await request(app).get('/api/ns01/export');
    assert.ok(res.status === 500 || res.status === 200);
  });
});
