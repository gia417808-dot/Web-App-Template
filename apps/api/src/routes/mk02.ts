import { Router } from 'express';
import { getTenantId } from '@web-app-template/auth-audit';
import { calculateRemainingBudget, canLockBudget } from '@web-app-template/domain';
import { generateMk02Workbook } from '@web-app-template/workbook-engine';

const router = Router();

// GET /api/mk02/chiendich
router.get('/chiendich', async (req: any, res) => {
  const tenantId = getTenantId(req);
  try {
    const { rows: campaigns } = await req.db.query(
      `SELECT cd.*,
        COALESCE(SUM(cp.amount_vnd) FILTER (WHERE cp.status = 'CONFIRMED'), 0) as confirmed_cost
       FROM "ChienDich" cd
       LEFT JOIN "ChiPhi" cp ON cd.id = cp.campaign_id AND cp.deleted_at IS NULL
       WHERE cd.organization_id = $1 AND cd.deleted_at IS NULL
       GROUP BY cd.id
       ORDER BY cd.created_at DESC`,
      [tenantId]
    );

    const results = campaigns.map((cd: any) => {
      const budgetCalc = calculateRemainingBudget(cd.budget_vnd, cd.confirmed_cost);
      return {
        ...cd,
        confirmed_cost: Number(cd.confirmed_cost),
        remaining_budget: budgetCalc.value ? Number(budgetCalc.value) : 0,
        is_over_budget: budgetCalc.is_over_budget
      };
    });

    res.json(results);
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Database error' });
  }
});

// POST /api/mk02/chiendich
router.post('/chiendich', async (req: any, res) => {
  const tenantId = getTenantId(req);
  const { code, name, start_date, end_date, budget_vnd } = req.body;

  if (!code || !name || !start_date || !end_date || budget_vnd === undefined || budget_vnd === null) {
    return res.status(400).json({ error: 'Missing required fields: code, name, start_date, end_date, budget_vnd' });
  }

  if (new Date(start_date) > new Date(end_date)) {
    return res.status(400).json({ error: 'Start date must be before or equal to end date' });
  }

  try {
    const { rows } = await req.db.query(
      `INSERT INTO "ChienDich" (organization_id, code, name, start_date, end_date, budget_vnd, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'ACTIVE') RETURNING id`,
      [tenantId, code, name, start_date, end_date, budget_vnd]
    );
    res.status(200).json({ id: rows[0].id });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Database error' });
  }
});

// POST /api/mk02/chiendich/:id/khoa-ngan-sach
router.post('/chiendich/:id/khoa-ngan-sach', async (req: any, res) => {
  const tenantId = getTenantId(req);
  const { id } = req.params;

  try {
    const { rows: cdRows } = await req.db.query(
      `SELECT * FROM "ChienDich" WHERE id = $1 AND organization_id = $2 AND deleted_at IS NULL`,
      [id, tenantId]
    );

    if (cdRows.length === 0) {
      return res.status(404).json({ error: 'Chiến dịch không tồn tại' });
    }

    const campaign = cdRows[0];
    if (!canLockBudget(campaign.status)) {
      return res.status(400).json({ error: 'Chỉ chiến dịch đang hoạt động (ACTIVE) mới có thể khóa ngân sách' });
    }

    const { rows } = await req.db.query(
      `UPDATE "ChienDich" SET status = 'CLOSED', updated_at = NOW(), row_version = row_version + 1
       WHERE id = $1 AND organization_id = $2 RETURNING id, status`,
      [id, tenantId]
    );
    res.status(200).json(rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Database error' });
  }
});

// GET /api/mk02/chiphi
router.get('/chiphi', async (req: any, res) => {
  const tenantId = getTenantId(req);
  try {
    const { rows } = await req.db.query(
      `SELECT cp.*, cd.name as campaign_name, k.name as channel_name
       FROM "ChiPhi" cp
       JOIN "ChienDich" cd ON cp.campaign_id = cd.id
       JOIN "Kenh" k ON cp.channel_id = k.id
       WHERE cp.organization_id = $1 AND cp.deleted_at IS NULL
       ORDER BY cp.business_date DESC`,
      [tenantId]
    );
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Database error' });
  }
});

// POST /api/mk02/chiphi
router.post('/chiphi', async (req: any, res) => {
  const tenantId = getTenantId(req);
  const { campaign_id, channel_id, business_date, amount_vnd, status } = req.body;

  if (!campaign_id || !channel_id || !business_date || amount_vnd === undefined || amount_vnd === null) {
    return res.status(400).json({ error: 'Missing required fields: campaign_id, channel_id, business_date, amount_vnd' });
  }

  try {
    const costStatus = status === 'CONFIRMED' ? 'CONFIRMED' : 'DRAFT';
    const { rows } = await req.db.query(
      `INSERT INTO "ChiPhi" (organization_id, campaign_id, channel_id, business_date, amount_vnd, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [tenantId, campaign_id, channel_id, business_date, amount_vnd, costStatus]
    );
    res.status(200).json({ id: rows[0].id });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Database error' });
  }
});

// GET /api/mk02/export
router.get('/export', async (req: any, res) => {
  const tenantId = getTenantId(req);
  try {
    const { rows: campaigns } = await req.db.query(
      `SELECT cd.*,
        COALESCE(SUM(cp.amount_vnd) FILTER (WHERE cp.status = 'CONFIRMED'), 0) as confirmed_cost
       FROM "ChienDich" cd
       LEFT JOIN "ChiPhi" cp ON cd.id = cp.campaign_id AND cp.deleted_at IS NULL
       WHERE cd.organization_id = $1 AND cd.deleted_at IS NULL
       GROUP BY cd.id
       ORDER BY cd.created_at DESC`,
      [tenantId]
    );
    const buffer = await generateMk02Workbook(campaigns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="MK02_3.0.0-vi.xlsx"');
    res.send(buffer);
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Export error' });
  }
});

export const mk02Router = router;
export default router;
