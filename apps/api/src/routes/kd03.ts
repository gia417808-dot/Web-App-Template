import { Router } from 'express';
import { getTenantId } from '@web-app-template/auth-audit';
import { calculateTargetProgress } from '@web-app-template/domain';
import { generateKd03Workbook } from '@web-app-template/workbook-engine';

const router = Router();

router.get('/muctieu', async (req: any, res) => {
  const tenantId = getTenantId(req);
  try {
    const { rows: targets } = await req.db.query('SELECT * FROM "MucTieu" WHERE organization_id = $1 ORDER BY period_start DESC', [tenantId]);
    
    // For each target, get the sum of confirmed revenue
    const results = [];
    for (const t of targets) {
      const { rows: sumRows } = await req.db.query(
        `SELECT SUM(total_vnd) as confirmed_revenue_vnd 
         FROM "DonHang" 
         WHERE organization_id = $1 AND status = 'CONFIRMED' 
         AND business_date >= $2 AND business_date <= $3`,
        [tenantId, t.period_start, t.period_end]
      );
      
      const confirmed_revenue_vnd = parseFloat(sumRows[0].confirmed_revenue_vnd || 0);
      const target_vnd = parseFloat(t.target_vnd);
      
      results.push({
        ...t,
        confirmed_revenue_vnd,
        progress_pct: calculateTargetProgress(confirmed_revenue_vnd, target_vnd)
      });
    }
    
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/muctieu', async (req: any, res) => {
  const tenantId = getTenantId(req);
  const { owner_id, period_start, period_end, target_vnd } = req.body;

  if (!owner_id || !period_start || !period_end || target_vnd === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (target_vnd < 0) {
    return res.status(400).json({ error: 'Target must be positive' });
  }

  if (new Date(period_start) > new Date(period_end)) {
    return res.status(400).json({ error: 'Invalid period' });
  }

  try {
    const { rows } = await req.db.query(
      `INSERT INTO "MucTieu" (organization_id, owner_id, period_start, period_end, target_vnd, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [tenantId, owner_id, period_start, period_end, target_vnd, 'DRAFT']
    );
    res.status(200).json({ id: rows[0].id });
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/muctieu/export', async (req: any, res) => {
  const tenantId = getTenantId(req);
  try {
    const { rows: targets } = await req.db.query('SELECT * FROM "MucTieu" WHERE organization_id = $1', [tenantId]);
    const results = [];
    for (const t of targets) {
      const { rows: sumRows } = await req.db.query(
        `SELECT SUM(total_vnd) as confirmed_revenue_vnd 
         FROM "DonHang" 
         WHERE organization_id = $1 AND status = 'CONFIRMED' 
         AND business_date >= $2 AND business_date <= $3`,
        [tenantId, t.period_start, t.period_end]
      );
      results.push({
        ...t,
        confirmed_revenue_vnd: sumRows[0].confirmed_revenue_vnd || 0
      });
    }
    
    const buffer = await generateKd03Workbook(results);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="muctieu.xlsx"');
    res.send(buffer);
  } catch (e) {
    res.status(500).json({ error: 'Export error' });
  }
});

export const kd03Router = router;
