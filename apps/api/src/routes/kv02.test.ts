import { test } from 'node:test';
import assert from 'node:assert';
import express from 'express';
import supertest from 'supertest';
import { kv02Router } from './kv02';
import { tenantMiddleware } from '@web-app-template/auth-audit';

const app = express();
app.use(express.json());
app.use(tenantMiddleware);

// Mock DB
app.use((req: any, res, next) => {
  req.db = {
    query: async (text: string, params: any[]) => {
      if (text.includes('BEGIN') || text.includes('COMMIT') || text.includes('ROLLBACK')) return {};
      if (text.includes('INSERT INTO "PhieuKho"')) return { rows: [{ id: 'mock-pk-id' }] };
      if (text.includes('INSERT INTO "DongPhieuKho"')) return { rows: [{ id: 'mock-dpk-id' }] };
      if (text.includes('INSERT INTO "StockLedger"')) return { rows: [{}] };
      if (text.includes('SELECT COALESCE(SUM(quantity_delta), 0)')) {
        // Return stock = 10 for testing
        return { rows: [{ current_stock: '10' }] };
      }
      if (text.includes('SELECT * FROM "PhieuKho"')) {
        return { rows: [{ id: 'mock-pk-id', code: 'PK01' }] };
      }
      return { rows: [] };
    }
  };
  next();
});

app.use('/api/kv02', kv02Router);

test('Integration KV02 PhieuKho CRUD', async (t) => {
  await t.test('POST /api/kv02/phieukho - missing lines', async () => {
    const res = await supertest(app).post('/api/kv02/phieukho').set('x-tenant-id', 'org-123').send({});
    assert.strictEqual(res.status, 400);
  });

  await t.test('POST /api/kv02/phieukho - valid IN', async () => {
    const res = await supertest(app).post('/api/kv02/phieukho').set('x-tenant-id', 'org-123').send({
      code: 'PK01',
      warehouse_id: 'wh1',
      movement_type: 'in',
      business_date: '2026-09-30',
      lines: [{ product_id: 'p1', quantity: 20 }]
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.id, 'mock-pk-id');
  });

  await t.test('POST /api/kv02/phieukho - valid OUT', async () => {
    const res = await supertest(app).post('/api/kv02/phieukho').set('x-tenant-id', 'org-123').send({
      code: 'PK02',
      warehouse_id: 'wh1',
      movement_type: 'out',
      business_date: '2026-09-30',
      lines: [{ product_id: 'p1', quantity: 5 }] // current_stock is mocked to 10
    });
    assert.strictEqual(res.status, 200);
  });

  await t.test('POST /api/kv02/phieukho - invalid OUT (negative stock)', async () => {
    const res = await supertest(app).post('/api/kv02/phieukho').set('x-tenant-id', 'org-123').send({
      code: 'PK03',
      warehouse_id: 'wh1',
      movement_type: 'out',
      business_date: '2026-09-30',
      lines: [{ product_id: 'p1', quantity: 15 }] // 10 - 15 = -5
    });
    assert.strictEqual(res.status, 400);
    assert.match(res.body.error, /Stock cannot be negative/);
  });

  await t.test('GET /api/kv02/phieukho/export', async () => {
    const res = await supertest(app).get('/api/kv02/phieukho/export').set('x-tenant-id', 'org-123');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.header['content-type'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });
});
