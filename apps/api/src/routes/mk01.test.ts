import { test } from 'node:test';
import assert from 'node:assert';
import express from 'express';
import supertest from 'supertest';
import { mk01Router } from './mk01';
import { tenantMiddleware } from '@web-app-template/auth-audit';

const app = express();
app.use(express.json());
app.use(tenantMiddleware);

// Mock DB
app.use((req: any, res, next) => {
  req.db = {
    query: async (text: string, params: any[]) => {
      if (text.includes('INSERT INTO "NoiDung"')) return { rows: [{ id: 'mock-nd-id' }] };
      if (text.includes('UPDATE "NoiDung"')) return { rows: [{ id: 'mock-nd-id' }] };
      if (text.includes('SELECT * FROM "NoiDung"')) {
        const now = new Date();
        const future = new Date(now.getTime() + 10000);
        return { 
          rows: [
            { id: '1', status: 'PUBLISHED', scheduled_at: future, published_at: now },
            { id: '2', status: 'SCHEDULED', scheduled_at: future, published_at: null }
          ] 
        };
      }
      return { rows: [] };
    }
  };
  next();
});

app.use('/api/mk01', mk01Router);

test('Integration MK01 NoiDung CRUD', async (t) => {
  await t.test('POST /api/mk01/noidung - missing fields', async () => {
    const res = await supertest(app).post('/api/mk01/noidung').set('x-tenant-id', 'org-123').send({});
    assert.strictEqual(res.status, 400);
  });

  await t.test('POST /api/mk01/noidung - valid data', async () => {
    const res = await supertest(app).post('/api/mk01/noidung').set('x-tenant-id', 'org-123').send({
      code: 'ND01',
      title: 'Bài viết 1',
      channel_id: 'ch1',
      scheduled_at: '2026-10-01T10:00:00Z',
      owner_id: 'user1'
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.id, 'mock-nd-id');
  });

  await t.test('POST /api/mk01/noidung/:id/publish', async () => {
    const res = await supertest(app).post('/api/mk01/noidung/mock-nd-id/publish').set('x-tenant-id', 'org-123');
    assert.strictEqual(res.status, 200);
  });

  await t.test('GET /api/mk01/noidung/kpi', async () => {
    const res = await supertest(app).get('/api/mk01/noidung/kpi').set('x-tenant-id', 'org-123');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.onTimePublishRate, 50); // 1 published on time, 1 scheduled. Total 2. Rate = 50%
  });

  await t.test('GET /api/mk01/noidung/export', async () => {
    const res = await supertest(app).get('/api/mk01/noidung/export').set('x-tenant-id', 'org-123');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.header['content-type'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });
});
