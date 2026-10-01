import os

with open('apps/api/src/routes/kd05.ts', 'w', encoding='utf-8') as f:
    f.write('''import { Router } from 'express';
import { getDb } from '../db/index.js';
import { calculateDaysSinceLastInteraction, canScheduleInteraction, TuongTac } from '@web-app-template/domain';

const router = Router();

// GET /api/kd05/customers-care-status
router.get('/customers-care-status', async (req, res) => {
    try {
        const organization_id = req.user?.organization_id;
        const db = getDb();
        const customers = await db.query('SELECT * FROM "KhachHang" WHERE organization_id =  AND deleted_at IS NULL', [organization_id]);
        
        const result = [];
        for (const customer of customers.rows) {
            const interactions = await db.query('SELECT * FROM "TuongTac" WHERE customer_id =  AND deleted_at IS NULL', [customer.id]);
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

// POST /api/kd05/interactions
router.post('/interactions', async (req, res) => {
    try {
        const organization_id = req.user?.organization_id;
        const { customer_id, type, notes, interaction_date } = req.body;
        
        if (!customer_id || !type || !interaction_date) {
            return res.status(400).json({ error: 'Missing required fields: customer_id, type, interaction_date' });
        }

        const db = getDb();
        
        // Guard: check if can schedule
        const interactionsRes = await db.query('SELECT * FROM "TuongTac" WHERE customer_id =  AND deleted_at IS NULL', [customer_id]);
        const mappedInteractions = interactionsRes.rows.map((i: any) => ({
            ...i,
            interaction_date: new Date(i.interaction_date)
        }));

        if (!canScheduleInteraction(mappedInteractions)) {
            return res.status(400).json({ error: 'Khách hàng này đã có lịch chăm sóc (PLANNED) chưa hoàn thành.' });
        }

        const result = await db.query(
            INSERT INTO "TuongTac" (organization_id, customer_id, interaction_date, type, notes, status)
             VALUES (, , , , , 'PLANNED') RETURNING *,
            [organization_id, customer_id, new Date(interaction_date), type, notes || null]
        );
        res.json(result.rows[0]);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/kd05/interactions/:id/complete
router.put('/interactions/:id/complete', async (req, res) => {
    try {
        const organization_id = req.user?.organization_id;
        const db = getDb();
        const result = await db.query(
            UPDATE "TuongTac" SET status = 'COMPLETED', updated_at = NOW(), row_version = row_version + 1
             WHERE id =  AND organization_id =  AND status = 'PLANNED' RETURNING *,
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

export default router;
''')

with open('apps/api/src/db/seed_kd05.ts', 'w', encoding='utf-8') as f:
    f.write('''import { Client } from 'pg';

export async function seedKd05(db: Client) {
    const orgRes = await db.query('SELECT id FROM "ToChuc" LIMIT 1');
    if (orgRes.rows.length === 0) return;
    const orgId = orgRes.rows[0].id;

    const customers = await db.query('SELECT id FROM "KhachHang" WHERE organization_id =  LIMIT 10', [orgId]);
    if (customers.rows.length === 0) return;

    for (let i = 0; i < customers.rows.length; i++) {
        const cId = customers.rows[i].id;
        
        if (i < 3) {
            // No interactions for first 3 (NO_CONTACT)
            continue;
        } else if (i < 6) {
            // Completed interactions
            await db.query(
                INSERT INTO "TuongTac" (organization_id, customer_id, interaction_date, type, status, notes)
                VALUES (, , NOW() - interval '10 days', 'Call', 'COMPLETED', 'Đã gọi')
            , [orgId, cId]);
        } else if (i < 8) {
            // Planned interaction
            await db.query(
                INSERT INTO "TuongTac" (organization_id, customer_id, interaction_date, type, status, notes)
                VALUES (, , NOW() + interval '2 days', 'Email', 'PLANNED', 'Lên lịch email')
            , [orgId, cId]);
        } else {
            // Completed long ago
            await db.query(
                INSERT INTO "TuongTac" (organization_id, customer_id, interaction_date, type, status, notes)
                VALUES (, , NOW() - interval '60 days', 'Meeting', 'COMPLETED', 'Gặp mặt')
            , [orgId, cId]);
        }
    }
}
''')

with open('packages/workbook-engine/src/kd05.ts', 'w', encoding='utf-8') as f:
    f.write('''import ExcelJS from 'exceljs';
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

        // Add row
        sheet.addRow({
            code: customer.code,
            name: customer.name,
            last_interaction_date: lastDate,
            days_since: { formula: IF(ISBLANK(C), "NO_CONTACT", TODAY() - C), result: customer.days_since_last_interaction }
        });
        rowNum++;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
}
''')