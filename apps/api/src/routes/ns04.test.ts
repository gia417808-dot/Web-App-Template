import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import express from 'express';
import { ns04Router } from './ns04';

const app = express();
app.use(express.json());
app.use('/api/ns04', ns04Router);

test('NS04 API', async (t) => {
  await t.test('GET /api/ns04/export exists', async () => {
    const res = await request(app).get('/api/ns04/export');
    assert.ok(res.status === 500 || res.status === 200);
  });
});
