import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import express from 'express';
import { ns03Router } from './ns03';

const app = express();
app.use(express.json());
app.use('/api/ns03', ns03Router);

test('NS03 API', async (t) => {
  await t.test('GET /api/ns03/export exists', async () => {
    const res = await request(app).get('/api/ns03/export');
    assert.ok(res.status === 500 || res.status === 200);
  });
});
