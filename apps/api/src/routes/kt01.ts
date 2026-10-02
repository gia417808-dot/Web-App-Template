import { Router } from 'express';
import { getTenantId } from '@web-app-template/auth-audit';
import { validateTransactionAmount, isPeriodLocked } from '@web-app-template/domain';
import { generateKt01Workbook } from '@web-app-template/workbook-engine';

const router = Router();

router.get('/giaodich', async (req: any, res) => {
  const tenantId = getTenantId(req);
  try {
    const { rows } = await req.db.query('SELECT * FROM "GiaoDich" WHERE organization_id = $1 ORDER BY business_date DESC, created_at DESC', [tenantId]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/giaodich', async (req: any, res) => {
  const tenantId = getTenantId(req);
  const { code, account_id, business_date, direction, amount_vnd } = req.body;

  if (!code || !account_id || !business_date || !direction || !amount_vnd) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    validateTransactionAmount(amount_vnd);

    const { rows: locks } = await req.db.query('SELECT start_date, end_date FROM "KyKhoa" WHERE organization_id = $1', [tenantId]);
    if (isPeriodLocked(business_date, locks)) {
      return res.status(400).json({ error: 'Period is locked' });
    }

    const { rows } = await req.db.query(
      `INSERT INTO "GiaoDich" (organization_id, code, account_id, business_date, direction, amount_vnd, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [tenantId, code, account_id, business_date, direction, amount_vnd, 'DRAFT']
    );

    res.status(200).json(rows[0]);
  } catch (e: any) {
    if (e.message.includes('must be strictly positive')) {
      return res.status(400).json({ error: e.message });
    }
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/giaodich/export', async (req: any, res) => {
  const tenantId = getTenantId(req);
  try {
    const { rows } = await req.db.query('SELECT * FROM "GiaoDich" WHERE organization_id = $1 ORDER BY business_date DESC', [tenantId]);
    const buffer = await generateKt01Workbook(rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="giaodich.xlsx"');
    res.send(buffer);
  } catch (e) {
    res.status(500).json({ error: 'Export error' });
  }
});

export const kt01Router = router;
