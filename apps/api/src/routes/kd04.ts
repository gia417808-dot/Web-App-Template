import { Router } from 'express';
import { getTenantId } from '@web-app-template/auth-audit';
import { calculateContractStatus } from '@web-app-template/domain';
import { generateKd04Workbook } from '@web-app-template/workbook-engine';

const router = Router();

router.get('/hopdong', async (req: any, res) => {
  const tenantId = getTenantId(req);
  try {
    const { rows } = await req.db.query('SELECT * FROM "HopDong" WHERE organization_id = $1 ORDER BY created_at DESC', [tenantId]);
    
    const today = new Date();
    const results = rows.map((r: any) => {
      const statusObj = calculateContractStatus(r.expiry_date, r.status, today);
      return {
        ...r,
        days_remaining: statusObj.days_remaining,
        should_remind: statusObj.should_remind
      };
    });
    
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/hopdong', async (req: any, res) => {
  const tenantId = getTenantId(req);
  const { code, customer_id, start_date, expiry_date } = req.body;

  if (!code || !customer_id || !start_date || !expiry_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (new Date(start_date) > new Date(expiry_date)) {
    return res.status(400).json({ error: 'Start date must be before expiry date' });
  }

  try {
    const { rows } = await req.db.query(
      `INSERT INTO "HopDong" (organization_id, code, customer_id, start_date, expiry_date, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [tenantId, code, customer_id, start_date, expiry_date, 'ACTIVE']
    );
    res.status(200).json({ id: rows[0].id });
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/hopdong/:id/terminate', async (req: any, res) => {
  const tenantId = getTenantId(req);
  const { id } = req.params;

  try {
    const { rows } = await req.db.query(
      `UPDATE "HopDong" SET status = 'TERMINATED', updated_at = NOW() 
       WHERE id = $1 AND organization_id = $2 RETURNING id`,
      [id, tenantId]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ id: rows[0].id });
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/hopdong/export', async (req: any, res) => {
  const tenantId = getTenantId(req);
  try {
    const { rows } = await req.db.query('SELECT * FROM "HopDong" WHERE organization_id = $1', [tenantId]);
    const buffer = await generateKd04Workbook(rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="hopdong.xlsx"');
    res.send(buffer);
  } catch (e) {
    res.status(500).json({ error: 'Export error' });
  }
});

export const kd04Router = router;
