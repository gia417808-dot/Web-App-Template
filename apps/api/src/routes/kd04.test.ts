import { test } from 'node:test';
import assert from 'node:assert';
import express from 'express';
import supertest from 'supertest';
import { kd04Router } from './kd04';
import { tenantMiddleware } from '@web-app-template/auth-audit';

const app = express();
app.use(express.json());
app.use(tenantMiddleware);

// Mock DB
app.use((req: any, res, next) => {
  req.db = {
    query: async (text: string, params: any[]) => {
      if (text.includes('INSERT INTO "HopDong"')) return { rows: [{ id: 'mock-hd-id' }] };
      if (text.includes('UPDATE "HopDong"')) return { rows: [{ id: 'mock-hd-id' }] };
      if (text.includes('SELECT * FROM "HopDong"')) {
        const today = new Date();
        const future = new Date(today.getTime() + 10 * 86400000); // 10 days
        return { 
          rows: [
            { id: '1', code: 'HD01', customer_id: 'cust1', start_date: '2026-01-01', expiry_date: future.toISOString(), status: 'ACTIVE' }
          ] 
        };
      }
      return { rows: [] };
    }
  };
  next();
});

app.use('/api/kd04', kd04Router);

test('Integration KD04 HopDong CRUD', async (t) => {
  await t.test('POST /api/kd04/hopdong - missing fields', async () => {
    const res = await supertest(app).post('/api/kd04/hopdong').set('x-tenant-id', 'org-123').send({});
    assert.strictEqual(res.status, 400);
  });

  await t.test('POST /api/kd04/hopdong - invalid dates', async () => {
    const res = await supertest(app).post('/api/kd04/hopdong').set('x-tenant-id', 'org-123').send({
      code: 'HD01',
      customer_id: 'cust1',
      start_date: '2026-12-31',
      expiry_date: '2026-01-01'
    });
    assert.strictEqual(res.status, 400);
  });

  await t.test('POST /api/kd04/hopdong - valid data', async () => {
    const res = await supertest(app).post('/api/kd04/hopdong').set('x-tenant-id', 'org-123').send({
      code: 'HD01',
      customer_id: 'cust1',
      start_date: '2026-01-01',
      expiry_date: '2027-01-01'
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.id, 'mock-hd-id');
  });
  
  await t.test('POST /api/kd04/hopdong/:id/terminate', async () => {
    const res = await supertest(app).post('/api/kd04/hopdong/mock-hd-id/terminate').set('x-tenant-id', 'org-123');
    assert.strictEqual(res.status, 200);
  });

  await t.test('GET /api/kd04/hopdong', async () => {
    const res = await supertest(app).get('/api/kd04/hopdong').set('x-tenant-id', 'org-123');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body[0].should_remind, true); // 10 days left
  });

  await t.test('GET /api/kd04/hopdong/export', async () => {
    const res = await supertest(app).get('/api/kd04/hopdong/export').set('x-tenant-id', 'org-123');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.header['content-type'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });
});
