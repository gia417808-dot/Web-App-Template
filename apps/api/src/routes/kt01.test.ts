import { test } from 'node:test';
import assert from 'node:assert';
import express from 'express';
import supertest from 'supertest';
import { kt01Router } from './kt01';
import { tenantMiddleware } from '@web-app-template/auth-audit';

const app = express();
app.use(express.json());
app.use(tenantMiddleware);

// Mock DB
app.use((req: any, res, next) => {
  req.db = {
    query: async (text: string, params: any[]) => {
      if (text.includes('SELECT start_date, end_date FROM "KyKhoa"')) {
        return { rows: [] };
      }
      if (text.includes('INSERT INTO "GiaoDich"')) {
        return { rows: [{ id: 'mock-gd-id', code: params[1], amount_vnd: params[5] }] };
      }
      if (text.includes('SELECT * FROM "GiaoDich"')) {
        return { rows: [{ id: 'mock-gd-id', code: 'GD01', amount_vnd: 1000 }] };
      }
      return { rows: [] };
    }
  };
  next();
});

app.use('/api/kt01', kt01Router);

test('Integration KT01 GiaoDich CRUD', async (t) => {
  await t.test('POST /api/kt01/giaodich - missing fields', async () => {
    const res = await supertest(app).post('/api/kt01/giaodich').set('x-tenant-id', 'org-123').send({});
    assert.strictEqual(res.status, 400);
  });

  await t.test('POST /api/kt01/giaodich - invalid amount', async () => {
    const res = await supertest(app).post('/api/kt01/giaodich').set('x-tenant-id', 'org-123').send({
      code: 'GD01',
      account_id: 'acc1',
      business_date: '2026-09-30',
      direction: 'in',
      amount_vnd: -500
    });
    assert.strictEqual(res.status, 400);
  });

  await t.test('POST /api/kt01/giaodich - valid data', async () => {
    const res = await supertest(app).post('/api/kt01/giaodich').set('x-tenant-id', 'org-123').send({
      code: 'GD01',
      account_id: 'acc1',
      business_date: '2026-09-30',
      direction: 'in',
      amount_vnd: 1000
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.id, 'mock-gd-id');
  });

  await t.test('GET /api/kt01/giaodich/export', async () => {
    const res = await supertest(app).get('/api/kt01/giaodich/export').set('x-tenant-id', 'org-123');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.header['content-type'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });
});
