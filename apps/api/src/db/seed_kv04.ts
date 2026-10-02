import { Pool } from 'pg';
import crypto from 'crypto';

export async function seedKV04(db: Pool, orgId: string) {
  const khoRes = await db.query('SELECT id FROM "Kho" WHERE organization_id = $1 LIMIT 1', [orgId]);
  const spRes = await db.query('SELECT id FROM "SanPham" WHERE organization_id = $1 LIMIT 1', [orgId]);
  
  if (khoRes.rows.length === 0 || spRes.rows.length === 0) {
    console.log('Chưa đủ master data cho KV04');
    return;
  }
  
  const dotId = crypto.randomUUID();
  await db.query(`
    INSERT INTO "DotKiemKe" (id, organization_id, kho_id, ma_kiem_ke, ngay_kiem_ke, trang_thai)
    VALUES ($1, $2, $3, 'KK-2026-01', '2026-01-31', 'REVIEWED')
    ON CONFLICT DO NOTHING
  `, [dotId, orgId, khoRes.rows[0].id]);

  await db.query(`
    INSERT INTO "DongKiemKe" (id, organization_id, dot_kiem_ke_id, san_pham_id, ton_so, dem_thuc_te, lech)
    VALUES ($1, $2, $3, $4, 100, 95, -5)
    ON CONFLICT DO NOTHING
  `, [crypto.randomUUID(), orgId, dotId, spRes.rows[0].id]);
  
  console.log('Seeded KV04 successfully');
}
