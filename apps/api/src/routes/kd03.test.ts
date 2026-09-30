import { test } from 'node:test';
import assert from 'node:assert';
import express from 'express';
import supertest from 'supertest';
import { kd03Router } from './kd03';
import { tenantMiddleware } from '@web-app-template/auth-audit';

const app = express();
app.use(express.json());
app.use(tenantMiddleware);

// Mock DB
app.use((req: any, res, next) => {
  req.db = {
    query: async (text: string, params: any[]) => {
      if (text.includes('INSERT INTO "MucTieu"')) return { rows: [{ id: 'mock-mt-id' }] };
      if (text.includes('SELECT * FROM "MucTieu"')) {
        return { 
          rows: [
            { id: '1', owner_id: 'user1', target_vnd: '1000', period_start: '2026-01-01', period_end: '2026-01-31', status: 'ACTIVE' }
          ] 
        };
      }
      if (text.includes('SELECT SUM(total_vnd)')) {
        return { rows: [{ confirmed_revenue_vnd: '500' }] };
      }
      return { rows: [] };
    }
  };
  next();
});

app.use('/api/kd03', kd03Router);

test('Integration KD03 MucTieu CRUD', async (t) => {
  await t.test('POST /api/kd03/muctieu - missing fields', async () => {
    const res = await supertest(app).post('/api/kd03/muctieu').set('x-tenant-id', 'org-123').send({});
    assert.strictEqual(res.status, 400);
  });

  await t.test('POST /api/kd03/muctieu - invalid target', async () => {
    const res = await supertest(app).post('/api/kd03/muctieu').set('x-tenant-id', 'org-123').send({
      owner_id: 'user1',
      period_start: '2026-01-01',
      period_end: '2026-01-31',
      target_vnd: -100
    });
    assert.strictEqual(res.status, 400);
  });

  await t.test('POST /api/kd03/muctieu - valid data', async () => {
    const res = await supertest(app).post('/api/kd03/muctieu').set('x-tenant-id', 'org-123').send({
      owner_id: 'user1',
      period_start: '2026-01-01',
      period_end: '2026-01-31',
      target_vnd: 1000
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.id, 'mock-mt-id');
  });

  await t.test('GET /api/kd03/muctieu', async () => {
    const res = await supertest(app).get('/api/kd03/muctieu').set('x-tenant-id', 'org-123');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body[0].progress_pct, 50); // 500 / 1000 * 100
    assert.strictEqual(res.body[0].confirmed_revenue_vnd, 500);
  });

  await t.test('GET /api/kd03/muctieu/export', async () => {
    const res = await supertest(app).get('/api/kd03/muctieu/export').set('x-tenant-id', 'org-123');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.header['content-type'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });
});
