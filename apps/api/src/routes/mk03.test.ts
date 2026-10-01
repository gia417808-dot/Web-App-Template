import { test } from 'node:test';
import assert from 'node:assert';
import { mk03Router } from './mk03';
import express from 'express';
import request from 'supertest';

const app = express();
app.use(express.json());

app.use((req: any, res, next) => {
    req.user = { organization_id: 'org1' };
    req.db = {
        query: async (sql: string, params: any[]) => {
            if (sql.includes('SELECT * FROM "Lead" WHERE organization_id')) {
                return { rows: [{ id: '1', ten_lead: 'L1' }] };
            }
            if (sql.includes('SELECT * FROM "Lead" WHERE id = $1')) {
                if (req.body.nguon_id === 'src_invalid') {
                    return { rows: [{ id: '1', trang_thai: 'invalid', version: 1 }] };
                }
                return { rows: [{ id: '1', trang_thai: 'new', version: 1 }] };
            }
            if (sql.includes('UPDATE "Lead"')) {
                return { rows: [{ id: '1', nguon_id: 'src1', version: 2 }] };
            }
            return { rows: [] };
        }
    };
    next();
});

app.use('/api/mk03', mk03Router);

test('MK03 API', async (t) => {
    await t.test('GET /api/mk03/leads returns leads', async () => {
        const res = await request(app).get('/api/mk03/leads').set('x-tenant-id', 'org1');
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body[0].id, '1');
    });

    await t.test('POST /api/mk03/leads/:id/gan-nguon assigns source', async () => {
        const res = await request(app)
            .post('/api/mk03/leads/1/gan-nguon')
            .set('x-tenant-id', 'org1')
            .send({ nguon_id: 'src1' });
        
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.nguon_id, 'src1');
    });

    await t.test('POST /api/mk03/leads/:id/gan-nguon fails on invalid state', async () => {
        const res = await request(app)
            .post('/api/mk03/leads/1/gan-nguon')
            .set('x-tenant-id', 'org1')
            .send({ nguon_id: 'src_invalid' });
        
        assert.strictEqual(res.status, 400);
        assert.ok(res.body.error.includes('Không thể gán nguồn'));
    });
});
