import { Router } from 'express';
import { getDb } from '../db/index.js';
import { calculateDaysSinceLastInteraction, canScheduleInteraction, TuongTac } from '@web-app-template/domain';

const router = Router();

router.get('/customers-care-status', async (req, res) => {
    try {
        const organization_id = (req as any).user?.organization_id;
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
        const organization_id = (req as any).user?.organization_id;
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
            return res.status(400).json({ error: 'Kh├ích h├áng n├áy ─æ├ú c├│ lß╗ïch ch─âm s├│c (PLANNED) ch╞░a ho├án th├ánh.' });
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
        const organization_id = (req as any).user?.organization_id;
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

export default router;
