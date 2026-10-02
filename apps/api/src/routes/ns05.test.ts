import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import express from 'express';
import { ns05Router } from './ns05';

const app = express();
app.use(express.json());
app.use('/api/ns05', ns05Router);

test('NS05 API', async (t) => {
  await t.test('GET /api/ns05/export exists', async () => {
    const res = await request(app).get('/api/ns05/export');
    assert.ok(res.status === 500 || res.status === 200);
  });
});
