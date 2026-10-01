import { test } from 'node:test';
import assert from 'node:assert';
import express from 'express';
import supertest from 'supertest';
import { mk02Router } from './mk02';
import { tenantMiddleware } from '@web-app-template/auth-audit';

const app = express();
app.use(express.json());
app.use(tenantMiddleware);

// Mock DB
app.use((req: any, res, next) => {
  req.db = {
    query: async (text: string, params: any[]) => {
      if (text.includes('INSERT INTO "ChienDich"')) {
        return { rows: [{ id: 'mock-cd-id' }] };
      }
      if (text.includes('SELECT cd.*')) {
        return {
          rows: [
            {
              id: 'mock-cd-1',
              code: 'CD01',
              name: 'Tet Campaign',
              start_date: '2026-01-01',
              end_date: '2026-02-15',
              budget_vnd: 1000000,
              status: 'ACTIVE',
              confirmed_cost: 350000
            }
          ]
        };
      }
      if (text.includes('SELECT * FROM "ChienDich" WHERE id = $1')) {
        return {
          rows: [
            {
              id: params[0],
              status: 'ACTIVE',
              row_version: 1
            }
          ]
        };
      }
      if (text.includes('UPDATE "ChienDich" SET status = \'CLOSED\'')) {
        return { rows: [{ id: params[0], status: 'CLOSED' }] };
      }
      if (text.includes('INSERT INTO "ChiPhi"')) {
        return { rows: [{ id: 'mock-cp-id' }] };
      }
      if (text.includes('SELECT cp.*')) {
        return {
          rows: [
            {
              id: 'mock-cp-1',
              campaign_id: 'mock-cd-1',
              channel_id: 'chan-1',
              amount_vnd: 350000,
              status: 'CONFIRMED'
            }
          ]
        };
      }
      return { rows: [] };
    }
  };
  next();
});

app.use('/api/mk02', mk02Router);

test('Integration MK02 ChienDich and ChiPhi API', async (t) => {
  await t.test('POST /api/mk02/chiendich - missing fields returns 400', async () => {
    const res = await supertest(app).post('/api/mk02/chiendich').set('x-tenant-id', 'org-123').send({});
    assert.strictEqual(res.status, 400);
  });

  await t.test('POST /api/mk02/chiendich - valid data returns 200', async () => {
    const res = await supertest(app)
      .post('/api/mk02/chiendich')
      .set('x-tenant-id', 'org-123')
      .send({
        code: 'CD01',
        name: 'Chiến dịch Tết',
        start_date: '2026-01-01',
        end_date: '2026-02-15',
        budget_vnd: 1000000
      });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.id, 'mock-cd-id');
  });

  await t.test('GET /api/mk02/chiendich - returns computed budget remaining', async () => {
    const res = await supertest(app).get('/api/mk02/chiendich').set('x-tenant-id', 'org-123');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.length, 1);
    assert.strictEqual(res.body[0].remaining_budget, 650000);
    assert.strictEqual(res.body[0].is_over_budget, false);
  });

  await t.test('POST /api/mk02/chiendich/:id/khoa-ngan-sach - locks budget to CLOSED', async () => {
    const res = await supertest(app)
      .post('/api/mk02/chiendich/mock-cd-1/khoa-ngan-sach')
      .set('x-tenant-id', 'org-123')
      .send();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'CLOSED');
  });

  await t.test('POST /api/mk02/chiphi - creates expense successfully', async () => {
    const res = await supertest(app)
      .post('/api/mk02/chiphi')
      .set('x-tenant-id', 'org-123')
      .send({
        campaign_id: 'mock-cd-1',
        channel_id: 'chan-1',
        business_date: '2026-01-10',
        amount_vnd: 200000,
        status: 'CONFIRMED'
      });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.id, 'mock-cp-id');
  });

  await t.test('GET /api/mk02/export - exports excel sheet', async () => {
    const res = await supertest(app).get('/api/mk02/export').set('x-tenant-id', 'org-123');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(
      res.headers['content-type'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  });
});
