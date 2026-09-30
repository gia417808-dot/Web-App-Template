import { Router } from 'express';
import { getTenantId } from '@web-app-template/auth-audit';
import { calculateExpectedValue } from '@web-app-template/domain';
import { generateKd02Workbook } from '@web-app-template/workbook-engine';

const router = Router();

router.get('/cohoi', async (req: any, res) => {
  const tenantId = getTenantId(req);
  try {
    const { rows } = await req.db.query('SELECT * FROM "CoHoi" WHERE organization_id = $1 ORDER BY created_at DESC', [tenantId]);
    // Optionally append calculated field
    const results = rows.map((r: any) => ({
      ...r,
      expected_value: calculateExpectedValue(parseFloat(r.value_vnd), parseFloat(r.probability_pct), r.status)
    }));
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/cohoi', async (req: any, res) => {
  const tenantId = getTenantId(req);
  const { code, customer_id, lead_id, stage_id, value_vnd, probability_pct, expected_close_date } = req.body;

  if (!code || !stage_id || value_vnd === undefined || probability_pct === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (value_vnd < 0 || probability_pct < 0 || probability_pct > 100) {
    return res.status(400).json({ error: 'Invalid value or probability' });
  }

  try {
    const { rows } = await req.db.query(
      `INSERT INTO "CoHoi" (organization_id, code, customer_id, lead_id, stage_id, value_vnd, probability_pct, expected_close_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [tenantId, code, customer_id, lead_id, stage_id, value_vnd, probability_pct, expected_close_date, 'OPEN']
    );
    res.status(200).json({ id: rows[0].id });
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/cohoi/:id/stage', async (req: any, res) => {
  const tenantId = getTenantId(req);
  const { id } = req.params;
  const { stage_id, probability_pct, status } = req.body;

  if (!stage_id || probability_pct === undefined || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { rows } = await req.db.query(
      `UPDATE "CoHoi" SET stage_id = $1, probability_pct = $2, status = $3, updated_at = NOW() 
       WHERE id = $4 AND organization_id = $5 RETURNING id`,
      [stage_id, probability_pct, status, id, tenantId]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ id: rows[0].id });
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/cohoi/export', async (req: any, res) => {
  const tenantId = getTenantId(req);
  try {
    const { rows } = await req.db.query('SELECT * FROM "CoHoi" WHERE organization_id = $1', [tenantId]);
    const buffer = await generateKd02Workbook(rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="cohoi.xlsx"');
    res.send(buffer);
  } catch (e) {
    res.status(500).json({ error: 'Export error' });
  }
});

export const kd02Router = router;
