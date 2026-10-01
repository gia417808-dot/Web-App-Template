import os

with open('apps/api/src/routes/kd05.ts', 'w', encoding='utf-8') as f:
    f.write("""import { Router } from 'express';
import { getDb } from '../db/index.js';
import { calculateDaysSinceLastInteraction, canScheduleInteraction, TuongTac } from '@web-app-template/domain';

const router = Router();

router.get('/customers-care-status', async (req, res) => {
    try {
        const organization_id = req.user?.organization_id;
        const db = getDb();
        const customers = await db.query('SELECT * FROM "KhachHang" WHERE organization_id = $1 AND deleted_at IS NULL', [organization_id]);
        
        const result = [];
        for (const customer of customers.rows) {
            const interactions = await db.query('SELECT * FROM "TuongTac" WHERE customer_id = $1 AND deleted_at IS NULL', [customer.id]);
            const mappedInteractions = interactions.rows.map((i: any) => ({
                ...i,
                interaction_date: new Date(i.interaction_date)
            }));
            const daysSinceLast = calculateDaysSinceLastInteraction(mappedInteractions);
            result.push({
                ...customer,
                days_since_last_interaction: daysSinceLast,
                last_interaction: mappedInteractions.filter((i: any) => i.status === 'COMPLETED').sort((a: any, b: any) => b.interaction_date.getTime() - a.interaction_date.getTime())[0] || null,
                interactions: mappedInteractions
            });
        }
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/interactions', async (req, res) => {
    try {
        const organization_id = req.user?.organization_id;
        const { customer_id, type, notes, interaction_date } = req.body;
        
        if (!customer_id || !type || !interaction_date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const db = getDb();
        const interactionsRes = await db.query('SELECT * FROM "TuongTac" WHERE customer_id = $1 AND deleted_at IS NULL', [customer_id]);
        const mappedInteractions = interactionsRes.rows.map((i: any) => ({
            ...i,
            interaction_date: new Date(i.interaction_date)
        }));

        if (!canScheduleInteraction(mappedInteractions)) {
            return res.status(400).json({ error: 'Khách hàng này đã có lịch chăm sóc (PLANNED) chưa hoàn thành.' });
        }

        const result = await db.query(
            `INSERT INTO "TuongTac" (organization_id, customer_id, interaction_date, type, notes, status)
             VALUES ($1, $2, $3, $4, $5, 'PLANNED') RETURNING *`,
            [organization_id, customer_id, new Date(interaction_date), type, notes || null]
        );
        res.json(result.rows[0]);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/interactions/:id/complete', async (req, res) => {
    try {
        const organization_id = req.user?.organization_id;
        const db = getDb();
        const result = await db.query(
            `UPDATE "TuongTac" SET status = 'COMPLETED', updated_at = NOW(), row_version = row_version + 1
             WHERE id = $1 AND organization_id = $2 AND status = 'PLANNED' RETURNING *`,
            [req.params.id, organization_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Interaction not found or not PLANNED' });
        }
        res.json(result.rows[0]);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;""")

with open('apps/api/src/db/seed_kd05.ts', 'w', encoding='utf-8') as f:
    f.write("""import { Client } from 'pg';

export async function seedKd05(db: Client) {
    const orgRes = await db.query('SELECT id FROM "ToChuc" LIMIT 1');
    if (orgRes.rows.length === 0) return;
    const orgId = orgRes.rows[0].id;

    const customers = await db.query('SELECT id FROM "KhachHang" WHERE organization_id = $1 LIMIT 10', [orgId]);
    if (customers.rows.length === 0) return;

    for (let i = 0; i < customers.rows.length; i++) {
        const cId = customers.rows[i].id;
        
        if (i < 3) {
            continue;
        } else if (i < 6) {
            await db.query(`
                INSERT INTO "TuongTac" (organization_id, customer_id, interaction_date, type, status, notes)
                VALUES ($1, $2, NOW() - interval '10 days', 'Call', 'COMPLETED', 'Đã gọi')
            `, [orgId, cId]);
        } else if (i < 8) {
            await db.query(`
                INSERT INTO "TuongTac" (organization_id, customer_id, interaction_date, type, status, notes)
                VALUES ($1, $2, NOW() + interval '2 days', 'Email', 'PLANNED', 'Lên lịch email')
            `, [orgId, cId]);
        } else {
            await db.query(`
                INSERT INTO "TuongTac" (organization_id, customer_id, interaction_date, type, status, notes)
                VALUES ($1, $2, NOW() - interval '60 days', 'Meeting', 'COMPLETED', 'Gặp mặt')
            `, [orgId, cId]);
        }
    }
}""")

with open('packages/workbook-engine/src/kd05.ts', 'w', encoding='utf-8') as f:
    f.write("""import ExcelJS from 'exceljs';
import { Buffer } from 'buffer';

export async function generateKd05Workbook(customersData: any[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'System';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('DanhSachChamSoc');
    sheet.columns = [
        { header: 'Mã KH', key: 'code', width: 15 },
        { header: 'Tên KH', key: 'name', width: 30 },
        { header: 'Ngày Tương Tác Cuối', key: 'last_interaction_date', width: 25 },
        { header: 'Số Ngày Chưa Tương Tác', key: 'days_since', width: 30 }
    ];

    let rowNum = 2;
    for (const customer of customersData) {
        let lastDate = '';
        if (customer.last_interaction) {
            lastDate = new Date(customer.last_interaction.interaction_date).toLocaleDateString('vi-VN');
        }
        sheet.addRow({
            code: customer.code,
            name: customer.name,
            last_interaction_date: lastDate,
            days_since: { formula: `IF(ISBLANK(C${rowNum}), "NO_CONTACT", TODAY() - C${rowNum})`, result: customer.days_since_last_interaction }
        });
        rowNum++;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
}""")

with open('apps/api/src/index.ts', 'w', encoding='utf-8') as f:
    f.write("""import express from 'express';
import { tenantMiddleware } from '@web-app-template/auth-audit';
import kv01Router from './routes/kv01';
import kd01Router from './routes/kd01';
import { kt01Router } from './routes/kt01';
import { kv02Router } from './routes/kv02';
import { mk01Router } from './routes/mk01';
import { kd02Router } from './routes/kd02';
import { kd03Router } from './routes/kd03';
import { kd04Router } from './routes/kd04';
import kd05Router from './routes/kd05';
import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const app = express();
app.use(express.json());
app.use(tenantMiddleware);

const dbClient = new Client({ connectionString: process.env.DATABASE_URL });
dbClient.connect().catch(e => console.error('DB connect error:', e));

app.use((req: any, res, next) => {
  req.db = dbClient;
  next();
});

app.get('/health', (req, res) => res.send('OK'));
app.get('/ready', (req, res) => res.send('Ready'));

app.use('/api/kv01', kv01Router);
app.use('/api/kd01', kd01Router);
app.use('/api/kt01', kt01Router);
app.use('/api/kv02', kv02Router);
app.use('/api/mk01', mk01Router);
app.use('/api/kd02', kd02Router);
app.use('/api/kd03', kd03Router);
app.use('/api/kd04', kd04Router);
app.use('/api/kd05', kd05Router);

export { app };""")