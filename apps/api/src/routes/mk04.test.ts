import { test } from 'node:test';
import assert from 'node:assert';
import { mk04Router } from './mk04';
import express from 'express';
import request from 'supertest';

const app = express();
app.use(express.json());

app.use((req: any, res, next) => {
    req.user = { organization_id: 'org1' };
    req.db = {
        query: async (sql: string, params: any[]) => {
            if (sql === 'BEGIN' || sql === 'COMMIT' || sql === 'ROLLBACK') return {};
            if (sql.includes('SELECT SUM(amount_vnd)')) return { rows: [{ total_cost: 100000 }] };
            if (sql.includes('SELECT COUNT(*)')) return { rows: [{ valid_leads: 5 }] };
            if (sql.includes('SELECT * FROM "ChiSoKenh" WHERE organization_id = $1 AND channel_id = $2')) {
                return { rows: [] };
            }
            if (sql.includes('SELECT * FROM "ChiSoKenh" WHERE id = $1')) {
                return { rows: [{ id: '1', status: 'DRAFT', row_version: 1 }] };
            }
            if (sql.includes('INSERT INTO "ChiSoKenh"')) {
                return { rows: [{ id: 'new-id', status: 'DRAFT', cpl_vnd: 20000 }] };
            }
            if (sql.includes('UPDATE "ChiSoKenh"')) {
                return { rows: [{ id: '1', status: 'VERIFIED' }] };
            }
            return { rows: [] };
        }
    };
    next();
});

app.use('/api/mk04', mk04Router);

test('MK04 API', async (t) => {
    await t.test('POST /api/mk04/tong-hop calculates and inserts record', async () => {
        const res = await request(app)
            .post('/api/mk04/tong-hop')
            .set('x-tenant-id', 'org1')
            .send({ channel_id: 'chan1', period_start: '2026-01-01', period_end: '2026-01-31' });
        
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.cpl_vnd, 20000);
    });

    await t.test('PUT /api/mk04/chi-so-kenh/:id/status updates status', async () => {
        const res = await request(app)
            .put('/api/mk04/chi-so-kenh/1/status')
            .set('x-tenant-id', 'org1')
            .send({ status: 'VERIFIED' });
        
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.status, 'VERIFIED');
    });
});
