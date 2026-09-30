import { Router } from 'express';
import { getTenantId } from '@web-app-template/auth-audit';
import { calculateLineTotal, calculateTotal } from '@web-app-template/domain';
import { generateKd01Workbook } from '@web-app-template/workbook-engine';

const router = Router();

router.get('/donhang', async (req: any, res) => {
  const tenantId = getTenantId(req);
  try {
    const { rows } = await req.db.query('SELECT * FROM "DonHang" WHERE organization_id = $1 ORDER BY created_at DESC', [tenantId]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/donhang', async (req: any, res) => {
  const tenantId = getTenantId(req);
  const { code, customer_id, business_date, lines } = req.body;

  if (!code || !customer_id || !business_date || !lines || !Array.isArray(lines) || lines.length === 0) {
    return res.status(400).json({ error: 'Missing required fields or lines' });
  }

  try {
    await req.db.query('BEGIN');

    // Process lines and calculate total
    const computedLines = lines.map((line: any, index: number) => {
      const lineTotal = calculateLineTotal(line.quantity, line.unit_price_vnd, line.discount_pct || 0);
      return { ...line, sequence: index + 1, line_total_vnd: lineTotal };
    });

    const totalVnd = calculateTotal(computedLines);

    // Insert DonHang
    const { rows: dhRows } = await req.db.query(
      `INSERT INTO "DonHang" (organization_id, code, customer_id, business_date, status, total_vnd) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [tenantId, code, customer_id, business_date, 'DRAFT', totalVnd]
    );
    const donHang = dhRows[0];

    // Insert ChiTietDon
    for (const line of computedLines) {
      await req.db.query(
        `INSERT INTO "ChiTietDon" (organization_id, order_id, product_id, sequence, product_name_snapshot, unit_snapshot, quantity, unit_price_vnd, discount_pct, line_total_vnd) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [tenantId, donHang.id, line.product_id, line.sequence, line.product_name_snapshot, line.unit_snapshot, line.quantity, line.unit_price_vnd, line.discount_pct || 0, line.line_total_vnd]
      );
    }

    await req.db.query('COMMIT');
    res.status(201).json(donHang);
  } catch (e: any) {
    await req.db.query('ROLLBACK');
    if (e.code === '23505') {
      return res.status(409).json({ error: 'DonHang code unique violation' });
    }
    if (e.message.includes('must be > 0') || e.message.includes('must be >=')) {
        return res.status(400).json({ error: e.message });
    }
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/donhang/export', async (req: any, res) => {
  const tenantId = getTenantId(req);
  try {
    const { rows } = await req.db.query('SELECT * FROM "DonHang" WHERE organization_id = $1 ORDER BY code', [tenantId]);
    
    const workbook = await generateKd01Workbook(rows, tenantId, 1);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="kd01.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
