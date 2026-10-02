import { Pool } from 'pg';

export async function seedKv02(pool: Pool, orgId: string) {
  const { rows: warehouses } = await pool.query(
    `INSERT INTO "Kho" (organization_id, code, name) 
     VALUES ($1, $2, $3) RETURNING id`,
    [orgId, 'WH01', 'Kho Trung Tâm']
  );

  const warehouseId = warehouses[0].id;

  // Assuming SanPham has been seeded
  const { rows: products } = await pool.query(`SELECT id FROM "SanPham" WHERE organization_id = $1 LIMIT 5`, [orgId]);
  
  if (products.length === 0) return;

  for (let i = 1; i <= 30; i++) {
    const code = `PK${String(i).padStart(3, '0')}`;
    const product = products[i % products.length];
    
    // Insert PK
    const { rows: pkRows } = await pool.query(
      `INSERT INTO "PhieuKho" (organization_id, code, warehouse_id, movement_type, business_date, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [orgId, code, warehouseId, 'in', '2026-09-30', 'POSTED']
    );

    // Insert DPK
    const { rows: dpkRows } = await pool.query(
      `INSERT INTO "DongPhieuKho" (organization_id, voucher_id, product_id, quantity)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [orgId, pkRows[0].id, product.id, 100]
    );

    // Insert StockLedger
    await pool.query(
      `INSERT INTO "StockLedger" (organization_id, warehouse_line_id, product_id, warehouse_id, quantity_delta)
       VALUES ($1, $2, $3, $4, $5)`,
      [orgId, dpkRows[0].id, product.id, warehouseId, 100]
    );
  }
}
