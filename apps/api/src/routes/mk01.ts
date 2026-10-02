import { Router } from 'express';
import { getTenantId } from '@web-app-template/auth-audit';
import { calculateOnTimePublishRate } from '@web-app-template/domain';
import { generateMk01Workbook } from '@web-app-template/workbook-engine';

const router = Router();

router.get('/noidung', async (req: any, res) => {
  const tenantId = getTenantId(req);
  try {
    const { rows } = await req.db.query('SELECT * FROM "NoiDung" WHERE organization_id = $1 ORDER BY scheduled_at ASC', [tenantId]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/noidung', async (req: any, res) => {
  const tenantId = getTenantId(req);
  const { code, title, channel_id, scheduled_at, owner_id } = req.body;

  if (!code || !title || !channel_id || !scheduled_at || !owner_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { rows } = await req.db.query(
      `INSERT INTO "NoiDung" (organization_id, code, title, channel_id, scheduled_at, owner_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [tenantId, code, title, channel_id, scheduled_at, owner_id, 'SCHEDULED']
    );
    res.status(200).json({ id: rows[0].id });
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/noidung/:id/publish', async (req: any, res) => {
  const tenantId = getTenantId(req);
  const { id } = req.params;

  try {
    const { rows } = await req.db.query(
      `UPDATE "NoiDung" SET status = 'PUBLISHED', published_at = NOW() WHERE id = $1 AND organization_id = $2 RETURNING id`,
      [id, tenantId]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ id: rows[0].id });
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/noidung/kpi', async (req: any, res) => {
  const tenantId = getTenantId(req);
  try {
    const { rows } = await req.db.query('SELECT * FROM "NoiDung" WHERE organization_id = $1', [tenantId]);
    const rate = calculateOnTimePublishRate(rows);
    res.json({ onTimePublishRate: rate });
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/noidung/export', async (req: any, res) => {
  const tenantId = getTenantId(req);
  try {
    const { rows } = await req.db.query('SELECT * FROM "NoiDung" WHERE organization_id = $1', [tenantId]);
    const buffer = await generateMk01Workbook(rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="lichnoidung.xlsx"');
    res.send(buffer);
  } catch (e) {
    res.status(500).json({ error: 'Export error' });
  }
});

export const mk01Router = router;
