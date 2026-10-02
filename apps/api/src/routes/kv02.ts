import { Router } from 'express';
import { getTenantId } from '@web-app-template/auth-audit';
import { calculateQuantityDelta, validateStockLevel } from '@web-app-template/domain';
import { generateKv02Workbook } from '@web-app-template/workbook-engine';

const router = Router();

router.get('/phieukho', async (req: any, res) => {
  const tenantId = getTenantId(req);
  try {
    const { rows } = await req.db.query('SELECT * FROM "PhieuKho" WHERE organization_id = $1 ORDER BY business_date DESC', [tenantId]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/phieukho', async (req: any, res) => {
  const tenantId = getTenantId(req);
  const { code, warehouse_id, movement_type, business_date, lines } = req.body;

  if (!code || !warehouse_id || !movement_type || !business_date || !lines || !Array.isArray(lines) || lines.length === 0) {
    return res.status(400).json({ error: 'Missing required fields or lines' });
  }

  try {
    await req.db.query('BEGIN');

    // 1. Insert PhieuKho
    const { rows: pkRows } = await req.db.query(
      `INSERT INTO "PhieuKho" (organization_id, code, warehouse_id, movement_type, business_date, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [tenantId, code, warehouse_id, movement_type, business_date, 'POSTED']
    );
    const voucherId = pkRows[0].id;

    // 2. Insert DongPhieuKho and StockLedger
    for (const line of lines) {
      const delta = calculateQuantityDelta(movement_type, line.quantity);
      
      // Check stock if outgoing
      if (delta < 0) {
        const { rows: stockRows } = await req.db.query(
          `SELECT COALESCE(SUM(quantity_delta), 0) as current_stock FROM "StockLedger"
           WHERE organization_id = $1 AND warehouse_id = $2 AND product_id = $3`,
          [tenantId, warehouse_id, line.product_id]
        );
        const currentStock = parseFloat(stockRows[0].current_stock);
        validateStockLevel(currentStock, delta);
      }

      const { rows: dpkRows } = await req.db.query(
        `INSERT INTO "DongPhieuKho" (organization_id, voucher_id, product_id, quantity)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [tenantId, voucherId, line.product_id, line.quantity]
      );
      
      await req.db.query(
        `INSERT INTO "StockLedger" (organization_id, warehouse_line_id, product_id, warehouse_id, quantity_delta)
         VALUES ($1, $2, $3, $4, $5)`,
        [tenantId, dpkRows[0].id, line.product_id, warehouse_id, delta]
      );
    }

    await req.db.query('COMMIT');
    res.status(200).json({ id: voucherId });
  } catch (e: any) {
    await req.db.query('ROLLBACK');
    if (e.message.includes('strictly positive') || e.message.includes('cannot be negative') || e.message.includes('Invalid movement')) {
      return res.status(400).json({ error: e.message });
    }
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/phieukho/export', async (req: any, res) => {
  const tenantId = getTenantId(req);
  try {
    const { rows } = await req.db.query('SELECT * FROM "PhieuKho" WHERE organization_id = $1', [tenantId]);
    const buffer = await generateKv02Workbook(rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="phieukho.xlsx"');
    res.send(buffer);
  } catch (e) {
    res.status(500).json({ error: 'Export error' });
  }
});

export const kv02Router = router;
