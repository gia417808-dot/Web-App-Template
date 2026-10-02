import { test } from 'node:test';
import assert from 'node:assert';
import express from 'express';
import supertest from 'supertest';
import { kd02Router } from './kd02';
import { tenantMiddleware } from '@web-app-template/auth-audit';

const app = express();
app.use(express.json());
app.use(tenantMiddleware);

// Mock DB
app.use((req: any, res, next) => {
  req.db = {
    query: async (text: string, params: any[]) => {
      if (text.includes('INSERT INTO "CoHoi"')) return { rows: [{ id: 'mock-ch-id' }] };
      if (text.includes('UPDATE "CoHoi"')) return { rows: [{ id: 'mock-ch-id' }] };
      if (text.includes('SELECT * FROM "CoHoi"')) {
        return { 
          rows: [
            { id: '1', code: 'CH01', value_vnd: '1000', probability_pct: '50', status: 'OPEN' }
          ] 
        };
      }
      return { rows: [] };
    }
  };
  next();
});

app.use('/api/kd02', kd02Router);

test('Integration KD02 CoHoi CRUD', async (t) => {
  await t.test('POST /api/kd02/cohoi - missing fields', async () => {
    const res = await supertest(app).post('/api/kd02/cohoi').set('x-tenant-id', 'org-123').send({});
    assert.strictEqual(res.status, 400);
  });

  await t.test('POST /api/kd02/cohoi - invalid values', async () => {
    const res = await supertest(app).post('/api/kd02/cohoi').set('x-tenant-id', 'org-123').send({
      code: 'CH01',
      stage_id: 'stg1',
      value_vnd: -100,
      probability_pct: 150
    });
    assert.strictEqual(res.status, 400);
  });

  await t.test('POST /api/kd02/cohoi - valid data', async () => {
    const res = await supertest(app).post('/api/kd02/cohoi').set('x-tenant-id', 'org-123').send({
      code: 'CH01',
      stage_id: 'stg1',
      value_vnd: 1000,
      probability_pct: 50
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.id, 'mock-ch-id');
  });

  await t.test('POST /api/kd02/cohoi/:id/stage', async () => {
    const res = await supertest(app).post('/api/kd02/cohoi/mock-ch-id/stage').set('x-tenant-id', 'org-123').send({
      stage_id: 'stg2',
      probability_pct: 80,
      status: 'OPEN'
    });
    assert.strictEqual(res.status, 200);
  });

  await t.test('GET /api/kd02/cohoi', async () => {
    const res = await supertest(app).get('/api/kd02/cohoi').set('x-tenant-id', 'org-123');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body[0].expected_value, 500); // 1000 * 50%
  });

  await t.test('GET /api/kd02/cohoi/export', async () => {
    const res = await supertest(app).get('/api/kd02/cohoi/export').set('x-tenant-id', 'org-123');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.header['content-type'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });
});
