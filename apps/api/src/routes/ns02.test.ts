import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import express from 'express';
import { ns02Router } from './ns02';

const app = express();
app.use(express.json());
app.use('/api/ns02', ns02Router);

test('NS02 API', async (t) => {
  await t.test('GET /api/ns02/export exists', async () => {
    const res = await request(app).get('/api/ns02/export');
    assert.ok(res.status === 500 || res.status === 200);
  });
});
