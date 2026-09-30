import test from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import express from 'express';
import kv01Router from './kv01';

// Mock DB
const mockDb = {
  query: async (text: string, params: any[]) => {
    if (text.includes('INSERT INTO "SanPham"')) {
      if (params[1] === 'DUPLICATE') {
        const error = new Error('duplicate');
        (error as any).code = '23505';
        throw error;
      }
      return { rows: [{ id: 'mock-id' }] };
    }
    if (text.includes('SELECT * FROM "SanPham"')) {
      return { rows: [{ id: 'mock-id', sku: 'SKU01', name: 'Item 1' }] };
    }
    return { rows: [] };
  }
};

const app = express();
app.use(express.json());
app.use((req: any, res, next) => {
  req.db = mockDb;
  req.headers['x-tenant-id'] = 'mock-tenant';
  next();
});
app.use('/api/kv01', kv01Router);

test('Integration KV01 SanPham CRUD', async (t) => {
  await t.test('POST /api/kv01/sanpham - should fail if missing unit', async () => {
    const res = await request(app)
      .post('/api/kv01/sanpham')
      .send({ sku: 'SP01', name: 'Product', min_qty: 1, max_qty: 10 });
    assert.strictEqual(res.status, 400);
    assert.match(res.body.error, /unit/i);
  });

  await t.test('POST /api/kv01/sanpham - should succeed with valid data', async () => {
    const res = await request(app)
      .post('/api/kv01/sanpham')
      .send({ sku: 'SP02', name: 'Product 2', unit: 'Cái', kind: 'Hàng hóa', min_qty: 1, max_qty: 10 });
    assert.strictEqual(res.status, 201);
  });

  await t.test('POST /api/kv01/sanpham - should handle unique SKU conflict', async () => {
    const res = await request(app)
      .post('/api/kv01/sanpham')
      .send({ sku: 'DUPLICATE', name: 'Dup', unit: 'Cái', kind: 'Hàng hóa', min_qty: 1, max_qty: 10 });
    assert.strictEqual(res.status, 409);
  });

  await t.test('GET /api/kv01/sanpham/export - should return excel stub', async () => {
    const res = await request(app).get('/api/kv01/sanpham/export');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers['content-type'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });
});
