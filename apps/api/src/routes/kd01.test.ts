import test from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import express from 'express';
import kd01Router from './kd01';

const mockDb = {
  query: async (text: string, params: any[]) => {
    if (text.includes('INSERT INTO "DonHang"')) {
      if (params[1] === 'DUPLICATE') {
        const error = new Error('duplicate');
        (error as any).code = '23505';
        throw error;
      }
      return { rows: [{ id: 'mock-order-id', code: params[1], total_vnd: params[5] }] };
    }
    if (text.includes('INSERT INTO "ChiTietDon"')) {
      return { rows: [] };
    }
    if (text.includes('SELECT * FROM "DonHang"')) {
      return { rows: [{ id: 'mock-order-id', code: 'DH001', total_vnd: 100 }] };
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
app.use('/api/kd01', kd01Router);

test('Integration KD01 DonHang CRUD', async (t) => {
  await t.test('POST /api/kd01/donhang - missing lines', async () => {
    const res = await request(app)
      .post('/api/kd01/donhang')
      .send({ code: 'DH01', customer_id: 'cus-1', business_date: '2026-10-01' });
    assert.strictEqual(res.status, 400);
    assert.match(res.body.error, /Missing required fields or lines/);
  });

  await t.test('POST /api/kd01/donhang - valid data', async () => {
    const res = await request(app)
      .post('/api/kd01/donhang')
      .send({
        code: 'DH02', customer_id: 'cus-1', business_date: '2026-10-01',
        lines: [
          { product_id: 'p1', product_name_snapshot: 'P1', unit_snapshot: 'Cái', quantity: 2, unit_price_vnd: 100, discount_pct: 0 }
        ]
      });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.total_vnd, 200);
  });

  await t.test('POST /api/kd01/donhang - invalid quantity', async () => {
    const res = await request(app)
      .post('/api/kd01/donhang')
      .send({
        code: 'DH03', customer_id: 'cus-1', business_date: '2026-10-01',
        lines: [
          { product_id: 'p1', product_name_snapshot: 'P1', unit_snapshot: 'Cái', quantity: -1, unit_price_vnd: 100, discount_pct: 0 }
        ]
      });
    assert.strictEqual(res.status, 400);
    assert.match(res.body.error, /Quantity must be > 0/);
  });

  await t.test('GET /api/kd01/donhang/export - should return excel stub', async () => {
    const res = await request(app).get('/api/kd01/donhang/export');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers['content-type'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });
});
