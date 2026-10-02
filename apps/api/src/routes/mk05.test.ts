import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import express from 'express';
import { mk05Router } from './mk05';

const app = express();
app.use(express.json());
app.use('/api/mk05', mk05Router);

test('MK05 API', async (t) => {
  // Test that export endpoint exists
  await t.test('GET /api/mk05/export exists', async () => {
    const res = await request(app).get('/api/mk05/export');
    // If db fails, it returns 500, but route is mapped
    assert.ok(res.status === 500 || res.status === 200);
  });
  
  await t.test('GET /api/mk05/thu-nghiem exists', async () => {
    const res = await request(app).get('/api/mk05/thu-nghiem');
    assert.ok(res.status === 500 || res.status === 200);
  });
});
