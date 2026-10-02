import { Router } from 'express';
import { getTenantId } from '@web-app-template/auth-audit';
import { mk04Domain, MK04Status } from '@web-app-template/domain';
import { generateMk04Workbook } from '@web-app-template/workbook-engine';

export const mk04Router = Router();

mk04Router.get('/chi-so-kenh', async (req: any, res) => {
    const tenantId = getTenantId(req);
    try {
        const { rows } = await req.db.query('SELECT * FROM "ChiSoKenh" WHERE organization_id = $1 ORDER BY period_start DESC', [tenantId]);
        res.json(rows);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

mk04Router.post('/tong-hop', async (req: any, res) => {
    const tenantId = getTenantId(req);
    const { channel_id, period_start, period_end } = req.body;

    if (!channel_id || !period_start || !period_end) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    try {
        await req.db.query('BEGIN');

        // Query total cost from ChiPhi
        const costResult = await req.db.query(`
            SELECT SUM(amount_vnd) as total_cost 
            FROM "ChiPhi" 
            WHERE organization_id = $1 AND channel_id = $2 
            AND business_date >= $3 AND business_date <= $4 
            AND status = 'CONFIRMED'
        `, [tenantId, channel_id, period_start, period_end]);
        const total_cost = costResult.rows[0].total_cost ? Number(costResult.rows[0].total_cost) : 0;

        // Query valid leads from Lead
        const leadsResult = await req.db.query(`
            SELECT COUNT(*) as valid_leads 
            FROM "Lead" 
            WHERE organization_id = $1 AND nguon_id = $2 
            AND ngay_tao >= $3 AND ngay_tao <= $4 
            AND trang_thai != 'invalid'
        `, [tenantId, channel_id, period_start, period_end]);
        const valid_leads = Number(leadsResult.rows[0].valid_leads);

        // Fetch existing ChiSoKenh
        const existingResult = await req.db.query(`
            SELECT * FROM "ChiSoKenh" 
            WHERE organization_id = $1 AND channel_id = $2 AND period_start = $3 AND period_end = $4
        `, [tenantId, channel_id, period_start, period_end]);
        const existingRecord = existingResult.rows.length > 0 ? existingResult.rows[0] : undefined;

        // Process Domain Logic
        const updatedRecord = mk04Domain.tongHopKenh(channel_id, period_start, period_end, total_cost, valid_leads, existingRecord);

        let finalRow;
        if (existingRecord) {
            const { rows } = await req.db.query(`
                UPDATE "ChiSoKenh" 
                SET total_cost = $1, valid_leads = $2, cpl_vnd = $3, status = $4, revision = $5, row_version = $6, updated_at = NOW()
                WHERE id = $7 AND row_version = $8
                RETURNING *
            `, [
                updatedRecord.total_cost, updatedRecord.valid_leads, updatedRecord.cpl_vnd, updatedRecord.status,
                updatedRecord.revision, updatedRecord.row_version, existingRecord.id, existingRecord.row_version
            ]);
            if (rows.length === 0) throw new Error('Concurrency conflict');
            finalRow = rows[0];
        } else {
            const { rows } = await req.db.query(`
                INSERT INTO "ChiSoKenh" (organization_id, channel_id, period_start, period_end, total_cost, valid_leads, cpl_vnd, status, revision, row_version)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *
            `, [
                tenantId, channel_id, period_start, period_end, updatedRecord.total_cost, updatedRecord.valid_leads,
                updatedRecord.cpl_vnd, updatedRecord.status, updatedRecord.revision, updatedRecord.row_version
            ]);
            finalRow = rows[0];
        }

        await req.db.query('COMMIT');
        res.json(finalRow);
    } catch (e: any) {
        await req.db.query('ROLLBACK');
        if (e.name === 'MK04Error') {
            return res.status(400).json({ error: e.message });
        }
        res.status(500).json({ error: e.message });
    }
});

mk04Router.put('/chi-so-kenh/:id/status', async (req: any, res) => {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const { status } = req.body;

    try {
        const { rows: records } = await req.db.query('SELECT * FROM "ChiSoKenh" WHERE id = $1 AND organization_id = $2', [id, tenantId]);
        if (records.length === 0) return res.status(404).json({ error: 'Record not found' });

        const record = records[0];
        const updatedRecord = mk04Domain.changeStatus(record, status as MK04Status);

        const { rows } = await req.db.query(`
            UPDATE "ChiSoKenh" SET status = $1, row_version = $2, updated_at = NOW()
            WHERE id = $3 AND row_version = $4 RETURNING *
        `, [updatedRecord.status, updatedRecord.row_version, id, record.row_version]);

        if (rows.length === 0) return res.status(409).json({ error: 'Concurrency conflict' });
        res.json(rows[0]);
    } catch (e: any) {
        if (e.name === 'MK04Error') {
            return res.status(400).json({ error: e.message });
        }
        res.status(500).json({ error: e.message });
    }
});

mk04Router.get('/export', async (req: any, res) => {
    const tenantId = getTenantId(req);
    try {
        const { rows } = await req.db.query(`
            SELECT c.*, n.ten_nguon as channel_name 
            FROM "ChiSoKenh" c
            LEFT JOIN "NguonLead" n ON c.channel_id = n.id
            WHERE c.organization_id = $1
            ORDER BY c.period_start DESC
        `, [tenantId]);
        
        const buffer = await generateMk04Workbook(rows);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="mk04-hieu-qua-kenh.xlsx"');
        res.send(buffer);
    } catch (e: any) {
        res.status(500).json({ error: 'Export error' });
    }
});
