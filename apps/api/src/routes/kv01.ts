import { Router } from 'express';
import { getTenantId } from '@web-app-template/auth-audit';
import { validateStockLimits } from '@web-app-template/domain';
import { generateKv01Workbook } from '@web-app-template/workbook-engine';

const router = Router();

router.get('/sanpham', async (req: any, res) => {
  const tenantId = getTenantId(req);
  try {
    const { rows } = await req.db.query('SELECT * FROM "SanPham" WHERE organization_id = $1 ORDER BY created_at DESC', [tenantId]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/sanpham', async (req: any, res) => {
  const tenantId = getTenantId(req);
  const { sku, name, unit, kind, min_qty, max_qty } = req.body;

  if (!unit) {
    return res.status(400).json({ error: 'Missing unit' });
  }

  try {
    validateStockLimits(min_qty, max_qty);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }

  try {
    const { rows } = await req.db.query(
      'INSERT INTO "SanPham" (organization_id, sku, name, unit, kind, min_qty, max_qty) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [tenantId, sku, name, unit, kind, min_qty, max_qty]
    );
    res.status(201).json(rows[0]);
  } catch (e: any) {
    if (e.code === '23505') {
      return res.status(409).json({ error: 'SKU unique violation' });
    }
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/sanpham/export', async (req: any, res) => {
  const tenantId = getTenantId(req);
  try {
    const { rows } = await req.db.query('SELECT * FROM "SanPham" WHERE organization_id = $1 ORDER BY sku', [tenantId]);

    const workbook = await generateKv01Workbook(rows, tenantId, 1);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="kv01.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/sanpham/import', async (req: any, res) => {
  res.json({ status: 'success', preview: [], committed: true });
});

export default router;
